import { Camera } from "../cameras/index.js";
import { Object3D } from "../core/index.js";
import { DEG2RAD, Vector3 } from "../math/index.js";

function mod(n, m) {
    return ((n % m) + m) % m;
}

const v1 = new Vector3();

export class OrbitControls {
    /** @type {HTMLCanvasElement} */
    #canvas
    /** @type {Camera} */
    #camera
    /** @type {Object3D} */
    target
    /** @type {number} */
    radius=700
    #center=new Object3D();
    allowPan=true
    allowZoom=true
    allowRotate=true
    #isPanning=false
    #isMoving=false

    /**
     * Create new orbit control for camera.
     * 
     * @param {Camera} camera Camera to attach the control.
     * @param {HTMLCanvasElement} canvas Canvas to attach the control.
     */
    constructor(camera, canvas, target=null) {
        this.#camera = camera;
        this.#canvas = canvas;
        this.target = target;
        this.#center.name = "Camera";
        this.#init();
    }

    get canvas() {
        return this.#canvas;
    }

    get camera() {
        return this.#camera;
    }

    get center() {
        return this.#center;
    }

    #init() {
        // convert camera position to spherical coordinate with theta = 0, phi = 0
        // this.#camera.position.set(0, 0, this.radius);
        this.#center.add(this.#camera);
        this.#canvas.addEventListener('mousedown', this.#onMouseDown.bind(this));
        this.#canvas.addEventListener('mousemove', this.#onMouseMove.bind(this));
        this.#canvas.addEventListener('mouseup', this.#onMouseUp.bind(this));
        this.#canvas.addEventListener('wheel', this.#onMouseWheel.bind(this));
    }

    /**
     * 
     * @param {MouseEvent} event onmousedown event.
     */
    #onMouseDown(event) {
        if (event.shiftKey)
            this.#isPanning = true;
        else
            this.#isMoving = true;
    }

    #onMouseUp(event) {
        this.#isMoving = false;
        this.#isPanning = false;
    }

    #onMouseMove(event) {
        const dx = event.movementX, dy = event.movementY;
        // convert camera position to spherical coordinate
        // const camPos = this.#camera.position;
        // const spRad = camPos.length;
        // let spTheta = Math.atan2(camPos.x, camPos.z);
        // let spPhi = Math.acos(Math.max(-1, Math.min(1, camPos.y / spRad)));

        if (this.#isMoving && this.allowRotate) {
            this.#center.rotation.set(
                mod(this.#center.rotation.x - dy * DEG2RAD, Math.PI*2),
                mod(this.#center.rotation.y - dx * DEG2RAD, Math.PI*2),
                0,
            )

            // spTheta = mod(spTheta - dx/180, Math.PI*2);
            // spPhi = mod(spPhi - dy/180, Math.PI*2);
            // // const radius = Math.sqrt(diff[0]*diff[0] + diff[1]*diff[1] + diff[2]*diff[2]);
            // // const theta = Math.atan2(diff[0], diff[2]);
            // // const phi = Math.acos(Math.max(-1, Math.min(1, diff[1] / radius)));
            // // convert spherical coordinate to camera position
            // this.#camera.position.set(
            //     spRad * Math.sin(spTheta) * Math.sin(spPhi),
            //     spRad * Math.cos(spPhi),
            //     spRad * Math.cos(spTheta) * Math.sin(spPhi),
            // );
            // this.#camera.lookAt(this.target || v1);
        } else if (this.#isPanning && this.allowPan) {
            this.#center.position.x -= dx;
            this.#center.position.y += dy;
        }
    }

    #onMouseWheel(event) {
        if (!this.allowZoom) return;
        const delta = event.deltaY;
        this.#camera.zoom += delta;
    }

    update() {
        if (this.target)
            this.#center.position.setVector(this.target.position);
        this.#center.updateLocalMatrix();
    }

    destroy() {
        this.#canvas.removeEventListener('mousedown', this.#onMouseDown);
        this.#canvas.removeEventListener('mousemove', this.#onMouseMove);
        this.#canvas.removeEventListener('mouseup', this.#onMouseUp);
        this.#canvas.removeEventListener('wheel', this.#onMouseWheel);
    }
}