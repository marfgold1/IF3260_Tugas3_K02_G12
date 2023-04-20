import { EventDispatcher } from "../core/EventDispatcher.js";
import { BufferAttribute } from "../geometry/index.js";

export class Vector3 extends EventDispatcher {
    /** @type {number} */
    #x
    /** @type {number} */
    #y
    /** @type {number} */
    #z

    /**
     * Creates an instance of Vector3.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @memberof Vector3
     */
    constructor(x=0, y=0, z=0) {
        super();
        this.set(x, y, z);
    }

    get x() {
        return this.#x;
    }

    set x(value) {
        this.#x = value;
        this.dispatchEvent({ type: "change", target: this });
    }

    get y() {
        return this.#y;
    }

    set y(value) {
        this.#y = value;
        this.dispatchEvent({ type: "change", target: this });
    }

    get z() {
        return this.#z;
    }

    set z(value) {
        this.#z = value;
        this.dispatchEvent({ type: "change", target: this });
    }

    /**
     * Add callback function to be called when value changed.
     * 
     * @param {Function} callback
     */
    set onChange(callback) {
        this.addEventListener("change", callback);
    }

    /**
     * Set vector's value.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @return {this} This vector.
     * @memberof Vector3
     */
    set(x=0, y=0, z=0) {
        this.#x = x;
        this.#y = y;
        this.#z = z;
        this.dispatchEvent({ type: "change", target: this });
        return this;
    }

    /**
     * Set vector's value from scalar number.
     *
     * @param {number} scalar
     * @return {this} This vector.
     * @memberof Vector3
     */
    setScalar(scalar) {
        return this.set(scalar, scalar, scalar);
    }

    /**
     * Clone this vector to new instance.
     *
     * @return {Vector3} New cloned vector with the same value.
     * @memberof Vector3
     */
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Set vector's value from another vector.
     *
     * @param {Vector3} v
     * @param {boolean} update Whether to dispatch change event.
     * @return {this} This vector.
     * @memberof Vector3
     */
    setVector(v, update=true) {
        this.#x = v.x;
        this.#y = v.y;
        this.#z = v.z;
        if (update) this.dispatchEvent({ type: "change", target: this });
        return this;
    }
    
    /**
     * Add value to this vector.
     *
     * @param {(number|Vector3)} val Number or vector to add with.
     * @return {this} This vector.
     * @memberof Vector3
     */
    add(val) {
        if (val instanceof Vector3) {
            return this.set(
                this.x + val.x,
                this.y + val.y,
                this.z + val.z
            );
        } else if (typeof val === 'number') {
            return this.set(
                this.x + val,
                this.y + val,
                this.z + val
            );
        } else {
            throw new Error('Invalid argument type');
        }
    }
    
    /**
     * Subtract value from this vector.
     *
     * @param {number|Vector3} val Number or vector to subtract with.
     * @return {this} This vector.
     * @memberof Vector3
     */
    sub(val) {
        if (val instanceof Vector3) {
            return this.set(
                this.x - val.x,
                this.y - val.y,
                this.z - val.z
            );
        } else if (typeof val === 'number') {
            return this.set(
                this.x - val,
                this.y - val,
                this.z - val
            );
        } else {
            throw new Error('Invalid argument type');
        }
    }

    /**
     * Multiply this vector with value.
     *
     * @param {number|Vector3} val Number or vector to multiply with.
     * @return {this} This vector.
     * @memberof Vector3
     */
    mul(val) {
        if (val instanceof Vector3) {
            return this.set(
                this.x * val.x,
                this.y * val.y,
                this.z * val.z
            );
        } else if (typeof val === 'number') {
            return this.set(
                this.x * val,
                this.y * val,
                this.z * val
            );
        } else {
            throw new Error('Invalid argument type');
        }
    }

    /**
     * Divide this vector with value.
     *
     * @param {number|Vector3} val Number or vector to divide with.
     * @return {this} This vector.
     * @memberof Vector3
     */
    div(val) {
        if (val instanceof Vector3) {
            return this.set(
                this.x / val.x,
                this.y / val.y,
                this.z / val.z
            );
        } else if (typeof val === 'number') {
            return this.mul(1 / val);
        } else {
            throw new Error('Invalid argument type');
        }
    }

    /**
     * Get dot product of this vector.
     * 
     * @param {Vector3} v Vector to dot product with.
     * @return {number} Result this vector dot product with v.
     * @memberof Vector3
     */
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    get lengthSq() {
        return this.dot(this);
    }

    /**
     * Get length of this vector.
     *
     * @memberof Vector3
     */
    get length() {
        return Math.sqrt(this.lengthSq);
    }

    /**
     * Set length of this vector.
     *
     * @memberof Vector3
     */
    set length(length) {
        return this.normalize().mul(length);
    }

    /**
     * Normalize this vector.
     *
     * @return {Vector3} This vector.
     * @memberof Vector3
     */
    normalize() {
        // in case length is 0, return 1 to not divide by 0
        return this.div(this.length || 1);
    }

    /**
     * Get cross product of this vector to another vector.
     *
     * @param {Vector3} v Vector to cross product with.
     * @return {this} This vector.
     * @memberof Vector3
     */
    cross(v) {
        return this.set(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    /**
     * Get distance to another vector.
     *
     * @param {Vector3} v Vector to get distance to.
     * @return {number} Distance to v.
     * @memberof Vector3
     */
    distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
    }

    /**
     * Get squared distance to another vector.
     *
     * @param {Vector3} v Vector to get squared distance to.
     * @return {number} Squared distance to v.
     * @memberof Vector3
     */
    distanceToSquared(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * Convert object to array.
     *
     * @param {Array<number>} arr
     * @param {number} offset
     * @return {Array<number>} 
     * @memberof Vector3
     */
    toArray(arr=null) {
        if (arr === null) arr = [0,0,0];
        arr[0] = this.x;
        arr[1] = this.y;
        arr[2] = this.z;
        return arr;
    }

    toDict() {
        return {
            x: this.x,
            y: this.y,
            z: this.z
        };
    }

    /**
     * Check if vector is equal.
     *
     * @param {Vector3} v
     * @return {boolean} True if equal, false otherwise. 
     * @memberof Vector3
     */
    equals(v) {
		return (
            v.x === this.x &&
            v.y === this.y &&
            v.z === this.z
        );
	}

    toJSON() {
        return this.toArray();
    }

    static fromJSON(arr) {
        return new Vector3(...arr);
    }

    /**
     * Multiply vector with matrix.
     *
     * @static
     * @param {Vector3} v Vector to multiply with.
     * @param {Matrix} m Matrix to multiply with.
     * @param {boolean} isPoint True if v is point, false otherwise.
     * @return {Vector3} Vector3
     * @memberof Vector3
     */
    static mulMat(v, m, isPoint=true) {
        return v.clone().mulMat(m, isPoint);
    }

    /**
     * Multiply this vector with matrix.
     *
     * @param {Matrix} m Matrix to multiply with.
     * @param {boolean} isPoint True if v is point, false otherwise.
     * @return {Vector3} Vector3
     * @memberof Vector3
     */
    mulMat(m, isPoint=true) {
        const v = this;
        return this.set(
            v.x * m.get(0, 0) + v.y * m.get(1, 0) + v.z * m.get(2, 0) + (isPoint ? m.get(3, 0) : 0),
            v.x * m.get(0, 1) + v.y * m.get(1, 1) + v.z * m.get(2, 1) + (isPoint ? m.get(3, 1) : 0),
            v.x * m.get(0, 2) + v.y * m.get(1, 2) + v.z * m.get(2, 2) + (isPoint ? m.get(3, 2) : 0),
        );
    }

    /**
     * Set vector from buffer attribute.
     *
     * @param {BufferAttribute} attribute Buffer attribute to get.
     * @param {number} index Index of the attribute.
     * @return {Vector3} Current vector instance.
     * @memberof Vector3
     */
    fromBufferAttribute(attribute, index) {
        return this.set(
            ...attribute.get(index, attribute.size),
            ...[0, 0, 0].slice(attribute.size),
        );
    }

    static get up() {
        return new Vector3(0, 1, 0);
    }

    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
}
