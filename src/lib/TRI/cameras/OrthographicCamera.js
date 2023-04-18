import { M4 } from "../math/index.js";
import { Camera } from "./index.js";

export class OrthographicCamera extends Camera {
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

    constructor(left, right, top, bottom, near, far) {
        super();
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.near = near;
        this.far = far;
        this.updateProjectionMatrix();
    }

    get type() {
        return "OrthographicCamera";
    }

    updateProjectionMatrix() {
        const d = [
            (this.right - this.left) / (2 * this.zoom),
            (this.top - this.bottom) / (2 * this.zoom),
            (this.right - this.left) / 2,
            (this.top - this.bottom) / 2,
        ];
        const border = [
            -(d[2] + d[0])/2, // left
            (d[2] + d[0])/2,  // right
            -(d[3] + d[1])/2, // bottom
            (d[3] + d[1])/2,  // top
        ]
        this.projectionMatrix = M4.ortographic(
            ...border, this.near, this.far,
        );
    }
}