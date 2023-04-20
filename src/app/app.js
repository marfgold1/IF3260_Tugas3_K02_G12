import TRI from "../lib/TRI/TRI.js";

import { tools } from "./toolbar.js";
import model from "./model.js";
import { inspector, inspectorItems, inspectorItems as state } from "./inspector.js";
import { cameraCreator } from "./cameras.js";
import ComponentTree from "./inspector/tree.js";
import animationDef from "./models/foxAnimation.js";
import { DEG2RAD } from "../lib/TRI/math/index.js";

const v = new TRI.Vector3();
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
    isLoop: false,
    curFrame: 0,
    fps: 10,
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
            componentTree.getEl(app.rig.id)?.classList.remove("selected");
        if (!(rigId in app.model.rigs) || rigId === app.rig?.id) {
            app.rig = null;
            inspector.hide("componentController");
        } else {
            app.rig = app.model.rigs[rigId];
            componentTree.getEl(app.rig.id).classList.add("selected");
            inspector.show("componentController");
            inspectorItems.componentController.setState({
                name: rigId,
                position: app.rig.position.toDict(),
                rotation: v.set(...app.rig.rotation).mul(TRI.RAD2DEG).toDict(),
                scale: app.rig.scale.toDict(),
            });
        }
    }
}

// Setup mutable states (from inspector)
let dt = 0, lt = 0;
function render(ts) {
    let tf = 1000 / animation.fps;
    controls[inspectorItems.camera.state.mode].update();
    webgl.render(scene, app.camera);
    if (!ts) ts = 0;
    let curFrame = animation.curFrame;
    if (animation.isPlaying) {
        dt += (ts - lt) / tf;
        const frame = animationDef['frames'][curFrame];
        Object.keys(frame).forEach((rigId) => {
            const rigFrame = frame[rigId];
            const rig = app.model.rigs[rigId.substring(1)];
            if (!rig) {
                console.error(`Rig ${rigId} not found`);
                return;
            }
            if (rigFrame.position)
                rig.position.set(...frame[rigId].position);
            if (rigFrame.rotation)
                rig.rotation.set(...frame[rigId].rotation.map((v) => v * DEG2RAD));
            if (app.rig?.id === rigId.substring(1)) {
                inspectorItems.componentController.setState({
                    position: rig.position.toDict(),
                    rotation: v.set(...rig.rotation).mul(TRI.RAD2DEG).toDict(),
                });
            }
        });
        if (animation.isReverse){
            // Frame 9 -> 8 -> 7 -> ... -> 0
            if (dt > 0.95) {
                animation.curFrame = (curFrame - 1 + animationDef['frames'].length) % animationDef['frames'].length;
                dt = 0;
            }
            if (!animation.curFrame && !animation.isLoop) {
                animation.isPlaying = false;
            } else {
                animation.isPlaying = true;
            }
        } else {
            // Frame 0 -> 1 -> 2 -> 3 -> 4 -> ... -> 9
            if (dt > 0.95) {
                animation.curFrame = (curFrame + 1) % animationDef['frames'].length;
                dt = 0;
            }
            if (animation.curFrame === animationDef['frames'].length - 1 && !animation.isLoop) {
                animation.isPlaying = false;
            } else {
                animation.isPlaying = true;
            }
        }
    }
    lt = ts;
    requestAnimationFrame(render);
}

render();
