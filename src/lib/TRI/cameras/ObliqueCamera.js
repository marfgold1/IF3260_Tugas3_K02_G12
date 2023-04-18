import { M4 } from "../math/index.js";
import { Camera } from "./index.js";

export class ObliqueCamera extends Camera {
    /** @type {number} */
    top
    /** @type {number} */
    bottom
    /** @type {number} */
    left
    /** @type {number} */
    right
    /** @type {number} */
    near
    /** @type {number} */
    far
    /** @type {number} */
    angle

    constructor(left, right, top, bottom, near, far, angle=45) {
        super();
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.near = near;
        this.far = far;
        this.angle = angle;
        this.updateProjectionMatrix();
    }

    get type() {
        return "ObliqueCamera";
    }

    updateProjectionMatrix() {
        const d = [
            (this.right - this.left) / (2 * this.zoom),
            (this.top - this.bottom) / (2 * this.zoom),
            (this.right - this.left) / 2,
            (this.top - this.bottom) / 2,
        ];
        const border = [
            -(d[2] + d[0])/2,
            (d[2] + d[0])/2,
            -(d[3] + d[1])/2,
            (d[3] + d[1])/2,
        ]
        this.projectionMatrix = M4.oblique(
            ...border, this.near, this.far,
            this.angle, 0.5,
        );
    }
}