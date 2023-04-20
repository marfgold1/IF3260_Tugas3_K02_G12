import TRI from "../lib/TRI/TRI.js";

import { tools } from "./toolbar.js";
import model from "./model.js";
import { inspector, inspectorItems, inspectorItems as state } from "./inspector.js";
import { cameraCreator } from "./cameras.js";

const canvas = document.querySelector('#glcanvas');

// Create scenes and setup non inspector states
const webgl = new TRI.WebGL(canvas);
webgl.clearColor.set(0.8, 0.8, 0.8);

const cameras = Object.keys(cameraCreator).map((key) => ({
    [key]: cameraCreator[key](canvas),
})).reduce((acc, cur) => ({ ...acc, ...cur }), {});
const camera = cameras[inspectorItems.camera.state.mode].cam;

webgl.addEventListener('resize', (ev) => {
    Object.keys(cameras).forEach((key) => {
        cameras[key].resizer(ev);
    });
});

const scene = new TRI.Scene();
scene.add(model);

const anim = inspectorItems.animation.state;
const animation = {
    isPlaying: false,
    isReverse: false,
}

const controls = {
    perspective: new TRI.OrbitControls(cameras.perspective.cam, canvas),
    orthographic: new TRI.OrbitControls(cameras.orthographic.cam, canvas),
    oblique: new TRI.OrbitControls(cameras.oblique.cam, canvas),
}

// Export definition to globalThis
globalThis.app = {
    cameras,
    model,
    animation,
    camera,
    renderer: webgl,
}

// Setup mutable states (from inspector)
model.position.onChange = (v) => {
    v = v.target;
    inspectorItems.model.setState({
        pos: {
            x: v.x,
            y: v.y,
            z: v.z,
        },
    }, false);
}
model.rotation.onChange = (v) => {
    v = v.target;
    inspectorItems.model.setState({
        rot: {
            x: v.x,
            y: v.y,
            z: v.z,
        },
    }, false);
}
model.scale.onChange = (v) => {
    v = v.target;
    inspectorItems.model.setState({
        scale: {
            x: v.x,
            y: v.y,
            z: v.z,
        },
    }, false);
}

const tf = 1000 / 60;
let dt = 0, lt = 0;
function render(ts) {
    controls[inspectorItems.camera.state.mode].update();
    webgl.render(scene, app.camera);
    dt = (ts - lt) / tf;
    lt = ts;
    if (animation.isPlaying) {
        if (!app.animation.isReverse){
            // Frame 9 -> 8 -> 7 -> ... -> 0
        } else {
            // Frame 0 -> 1 -> 2 -> 3 -> 4 -> ... -> 9
        }

    }
    requestAnimationFrame(render);
}

render();
