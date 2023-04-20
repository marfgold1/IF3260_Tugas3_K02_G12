import { Vector3, M4, Quaternion } from '../math/index.js';
import { EventDispatcher }  from './index.js';

const _events = {
    added: {
        type: 'added',
    },
    removed: {
        type: 'removed',
    },
};
const _v1 = new Vector3(),
_xAxis = new Vector3(1, 0, 0),
_yAxis = Vector3.up,
_zAxis = new Vector3(0, 0, 1);
const _q1 = new Quaternion();

export class Object3D extends EventDispatcher {
    /** @type {Vector3} */
    #position
    /** @type {Vector3} */
    #rotation
    /** @type {Vector3} */
    #scale
    /** @type {Quaternion} */
    #quaternion
    /** @type {M4} */
    #localMatrix
    /** @type {M4} */
    #worldMatrix
    /** @type {Object3D} */
    #parent
    /** @type {Boolean} */
    visible=true

    constructor() {
        super();
        /** @type {string} */
        this.name = '';
        /** @type {Object3D} */
        this.#parent = null;
        /** @type {Array<Object3D>} */
        this.children = [];
        this.#position = new Vector3();
        this.#rotation = new Vector3();
        this.#scale = new Vector3(1, 1, 1);
        this.#quaternion = new Quaternion();
        this.#localMatrix = M4.identity();
        this.#worldMatrix = M4.identity();
        this.#quaternion.onChange = () => {
            // temporary so it won't trigger change event in rotation (infinite recursive)
            _v1.setVector(this.#rotation);
            this.#quaternion.toEuler(_v1);
            this.#rotation.setVector(_v1, false);
        }
        this.#rotation.onChange = () => {
            this.#quaternion.setEuler(this.#rotation, 0, 0, false);
        }
    }

    /**
     * The type of this object.
     *
     * @readonly
     * @memberof Object3D
     */
    get type() {
        return "Object3D";
    }

    /**
     * Is this object a object3d?
     *
     * @readonly
     * @memberof Object3D
     */
    get isObject3D() {
        return true;
    }

    get position() {
        return this.#position;
    }
    
    get worldPosition() {
        this.updateWorldMatrix(true, false);
        return M4.getTranslation(this.#worldMatrix);
    }

    get quaternion() {
        return this.#quaternion;
    }

    get worldQuaternion() {
        this.updateWorldMatrix(true, false);
        return M4.decompose(this.#worldMatrix).quaternion;
    }

    get rotation() {
        return this.#rotation;
    }

    get worldRotation() {
        this.updateWorldMatrix(true, false);
        return M4.getRotation(this.#worldMatrix);
    }

    get scale() {
        return this.#scale;
    }

    get worldScale() {
        this.updateWorldMatrix(true, false);
        return M4.decompose(this.#worldMatrix).scale;
    }

    get parent() {
        return this.#parent;
    }

    set parent(parent) {
        if (this.#parent !== parent) {
            this.#parent = parent;
            this.updateWorldMatrix();
        }
    }

    get localMatrix() {
        return this.#localMatrix;
    }

    get worldMatrix() {
        return this.#worldMatrix;
    }

    updateLocalMatrix() {
        this.#localMatrix = M4.compose(
            this.#position,
            this.#quaternion,
            this.#scale,
        );
    }

    updateWorldMatrix(updateParent=true, updateChildren=true) {
        if (updateParent && this.parent) {
            this.parent.updateWorldMatrix(true, false);
        }
        this.updateLocalMatrix();
        if (this.parent) {
            this.#worldMatrix = this.parent.#worldMatrix.premul(
                this.#localMatrix
            );
        } else {
            this.#worldMatrix = this.#localMatrix.clone();
        }
        if (updateChildren) {
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].updateWorldMatrix(false, true);
            }
        }
    }
  
    /**
     * Add object to this object.
     * 
     * If object already has parent, it will detach with its parent first.
     *
     * @param {...Object3D} objects
     * @return {Object3D} this object
     * @memberof Object3D
     */
    add(...objects) {
        if (objects.length > 1) {
            objects.forEach(obj => this.add(obj));
            return this;
        }

        if (objects.length === 0) return this;

        const obj = objects[0];
        if (obj && obj.isObject3D) {
            // change parent to this
            if (obj.parent !== this) {
                obj.removeFromParent();
                obj.parent = this;
            }
            this.children.push(obj);
            obj.dispatchEvent(_events.added);
        }
        return this;
    }

    /**
     * Remove object from this object.
     *
     * @param {...Object3D} objects
     * @return {Object3D} this object
     * @memberof Object3D
     */
    remove(...objects) {
        if (objects.length > 1) {
            objects.forEach(obj => this.remove(obj));
            return this;
        }
        if (objects.length === 0) return this;
        const object = objects[0];
        if (object && object.isObject3D) {
            const index = this.children.indexOf(object);
            if (index !== -1) {
                object.parent = null;
                this.children.splice(index, 1);
                object.dispatchEvent(_events.removed);
            }
        }
        return this;
    }

    /**
     * Remove this object from parent.
     *
     * @return {Object3D} this object. 
     * @memberof Object3D
     */
    removeFromParent() {
        if (this.parent !== null)
            this.parent.remove(this);
        return this;
    }

    /**
     * Remove all children from this object.
     *
     * @return {Object3D} this object.
     * @memberof Object3D
     */
    clear() {
        this.children.forEach(child => {
            child.parent = null;
            child.dispatchEvent(_events.removed);
        })
        this.children.length = 0;
        return this;
    }

    lookAt(target, up=Vector3.up) {
        if (target.isObject3D) target = target.worldPosition;

        let m;
        if (this.isCamera)
            m = M4.lookAt(this.worldPosition, target, up);
        else
            m = M4.lookAt(target, this.worldPosition, up);

        _q1.setMatrix(m);
        if (this.parent) {
            // move quaternion to local space
            const q = this.parent.worldQuaternion;
            this.quaternion.copy(q.inv().mul(_q1));
        } else {
            this.quaternion.copy(_q1);
        }
    }

    localToWorld(vector) {
        this.updateWorldMatrix(true, false);
        return Vector3.mulMat(vector, this.#worldMatrix);
    }

    worldToLocal(vector) {
        this.updateWorldMatrix(true, false);
        return Vector3.mulMat(vector, M4.inv(this.#worldMatrix));
    }

    applyMatrix(matrix) {
        this.updateLocalMatrix();
        this.#localMatrix = matrix.premul(this.#localMatrix);
        M4.decompose(this.#localMatrix, this.#position, this.#quaternion, this.#scale);
    }

    rotateOnWorldAxis(axis, angle) {
        _q1.setAxisAngle(axis, angle);
        _q1.mul(this.#quaternion);
        this.quaternion.copy(_q1);
    }

    rotateX(angle) {
        this.rotateOnWorldAxis(_xAxis, angle);
    }

    rotateY(angle) {
        this.rotateOnWorldAxis(_yAxis, angle);
    }

    rotateZ(angle) {
        this.rotateOnWorldAxis(_zAxis, angle);
    }

    toJSON() {
        return {
            name: this.name,
            position: this.position.toJSON(),
            quaternion: this.quaternion.toJSON(),
            scale: this.scale.toJSON(),
            type: this.type,
            children: this.children.map((child) => child.toJSON()),
        }
    }

    static fromJSON(json, obj=null) {
        if (!obj) obj = new Object3D();
        obj.name = json.name;
        obj.position.set(...json.position);
        obj.quaternion.set(...json.quaternion);
        obj.scale.set(...json.scale);

        json.children.forEach(child => {
            obj.add(TRI.DeserializeObject(child));
        });
        return obj;
    }
}
