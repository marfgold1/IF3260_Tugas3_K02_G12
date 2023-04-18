import { Object3D } from "../core/index.js";
import { M4 } from "../math/index.js";

export class Camera extends Object3D {
    /** @type {M4} */
    projectionMatrix = M4.identity();
    /** @type {M4} */
    #invWorldMatrix = M4.identity();
    /** @type {number} */
    zoom = 1

    updateWorldMatrix() {
        super.updateWorldMatrix();
        this.#invWorldMatrix = M4.inv(this.worldMatrix);
    }

    get viewProjectionMatrix() {
        this.updateLocalMatrix();
        return this.projectionMatrix.premul(this.#invWorldMatrix);
    }

    get type() {
        return "Camera";
    }

    get isCamera() {
        return true;
    }

    updateProjectionMatrix() {
        throw new Error("Camera.updateProjectionMatrix() must be implemented in derived classes.");
    }
}
