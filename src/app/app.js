import TRI from "../lib/TRI/TRI.js";

import { tools } from "./toolbar.js";
import model from "./model.js";
import { inspector, inspectorItems, inspectorItems as state } from "./inspector.js";
import { cameraCreator } from "./cameras.js";
import ComponentTree from "./inspector/tree.js";

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
ComponentTree.update(model.rigsTree);

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
    scene,
    animation,
    camera,
    rig: null,
    renderer: webgl,
    updateRig: (rigId) => {
        if (app.rig)
            document.getElementById(`insp-compTree-${app.rig.id}`).classList.remove("selected");
        if (!(rigId in app.model.rigs) || rigId === app.rig?.id) {
            app.rig = null;
            inspector.hide("componentController");
        } else {
            app.rig = app.model.rigs[rigId];
            document.getElementById(`insp-compTree-${app.rig.id}`).classList.add("selected");
            inspector.show("componentController");
            inspectorItems.componentController.setState({
                name: rigId,
                position: app.rig.position.toDict(),
                rotation: app.rig.rotation.toDict(),
                scale: app.rig.scale.toDict(),
            });
        }
    }
}

// Setup mutable states (from inspector)
const tf = 1000 / 60;
let dt = 0, lt = 0;
function render(ts) {
    controls[inspectorItems.camera.state.mode].update();
    webgl.render(scene, app.camera);
    dt = (ts - lt) / tf;
    lt = ts;
    if (animation.isPlaying) {
        if (animation.isReverse){
            // Frame 9 -> 8 -> 7 -> ... -> 0
        } else {
            // Frame 0 -> 1 -> 2 -> 3 -> 4 -> ... -> 9
        }

    }
    requestAnimationFrame(render);
}

render();
