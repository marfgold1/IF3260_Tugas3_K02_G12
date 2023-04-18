import { M4 } from "../math/index.js";
import { Camera } from "./index.js";

export class PerspectiveCamera extends Camera {
    /** @type {number} */
    fov
    /** @type {number} */
    aspect
    /** @type {number} */
    near
    /** @type {number} */
    far

    constructor(fov, aspect, near, far) {
        super();
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.updateProjectionMatrix();
    }

    get type() {
        return "PerspectiveCamera";
    }

    updateProjectionMatrix() {
        this.projectionMatrix = M4.perspective(
            this.fov, this.aspect, this.near, this.far,
        );
    }
}