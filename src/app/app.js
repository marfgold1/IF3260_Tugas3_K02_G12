import TRI from "../lib/TRI/TRI.js";
import model1 from "./models/generator.js";

import { tools } from "./toolbar.js";
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
const modelg = model1;
const modelm = new TRI.PhongMaterial({
    lightPosition: new TRI.Vector3(0.5, 0.5, 1),
    shininess: 80,
});
modelm.ambientColor.set(1, 0.2, 0.2);
const model = new TRI.Mesh(
    modelg,
    modelm,
)
scene.add(model);

const anim = inspectorItems.animation.state;
const animation = {
    isPlaying: false,
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
    materials: {
        basic: new TRI.BasicMaterial(),
        phong: modelm,
    },
    renderer: webgl,
    light: {
        color: modelm.ambientColor,
        direction: modelm.lightPosition,
    },
}

// Setup mutable states (from inspector)
modelm.lightPosition.onChange = (v) => {
    v = v.target;
    inspectorItems.light.setState({
        direction: {
            x: v.x,
            y: v.y,
            z: v.z,
        },
    }, false);
}
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
// cameras.perspective.cam.parent.rotation.onChange = (v) => {
//     v = v.target;
//     inspectorItems.camera.setState({
//         rotationX: v.x,
//         rotationY: v.y,
//         rotationZ: v.z,
//     }, false);
// }
inspectorItems.scene.setState({
    background: webgl.clearColor.hex,
});
inspectorItems.light.setState({
    color: modelm.ambientColor.hex,
});

const tf = 1000 / 60;
let dt = 0, lt = 0;
function render(ts) {
    controls[inspectorItems.camera.state.mode].update();
    webgl.render(scene, app.camera);
    dt = (ts - lt) / tf;
    lt = ts;
    if (animation.isPlaying) {
        model.rotation.set(
            (model.rotation.x + dt * TRI.DEG2RAD * anim.speed) % 360,
            (model.rotation.y + dt * TRI.DEG2RAD * anim.speed) % 360,
            model.rotation.z
        );
    }
    requestAnimationFrame(render);
}

render();
