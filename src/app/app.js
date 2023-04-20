import TRI from "../lib/TRI/TRI.js";

import { tools } from "./toolbar.js";
import model from "./model.js";
import { inspector, inspectorItems, inspectorItems as state } from "./inspector.js";
import { cameraCreator } from "./cameras.js";
import ComponentTree from "./inspector/tree.js";
import foxAnim from "./models/foxAnimation.js";
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
const plane = new TRI.Mesh(
    new TRI.PlaneGeometry(1000, 1000),
    new TRI.BasicMaterial({ color: TRI.Color.white() })
);
plane.position.y = -300;
plane.scale.z = -1;
scene.add(plane);
const light = new TRI.Mesh(
    new TRI.BoxGeometry(50, 50, 50),
    new TRI.BasicMaterial({ color: TRI.Color.red() })
);
light.position.set(400,400,300);
scene.add(light);
ComponentTree.update(model.tree);

const animation = {
    def : foxAnim,
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
    tree: null,
    shading: true,
    comp: null,
    renderer: webgl,
    updateMaterial: (shading=null) => {
        if (shading === null) shading = app.shading;
        // update shading
        app.model.traverse((obj) => {
            if (obj.type === "Mesh") {
                obj.material = app.model.materials[obj.name][shading ? 0 : 1];
            }
        });
        app.shading = shading;

        if (app.comp?.type == "Mesh") {
            inspector.hide("componentBasicMat", "componentPhongMat");
            const mat = app.comp.material;
            if (mat instanceof TRI.BasicMaterial) {
                inspector.show("componentBasicMat");
                inspectorItems.componentBasicMat.setState({
                    name: app.comp.name,
                    color: mat.color.hex,
                });
            } else if (mat instanceof TRI.PhongMaterial) {
                inspector.show("componentPhongMat");
                inspectorItems.componentPhongMat.setState({
                    name: app.comp.name,
                    ambientColor: mat.ambientColor.hex,
                    diffuseColor: mat.diffuseColor.hex,
                    specularColor: mat.specularColor.hex,
                    shininess: mat.shininess,
                });
            }
        }
    },
    updateComponent: (comp) => {
        inspector.hide("componentController", "componentBasicMat", "componentPhongMat");
        if (app.comp)
            componentTree.getEl(app.comp.name)?.classList.remove("selected");
        if (app.comp == comp?.component) {
            app.comp = null;
        } else {
            comp = comp.component;
            app.comp = comp;
            componentTree.getEl(comp.name).classList.add("selected");
            if (comp.type === "Rig") {
                inspector.show("componentController");
                inspectorItems.componentController.setState({
                    name: comp.name,
                    position: comp.position.toDict(),
                    rotation: v.set(...comp.rotation).mul(TRI.RAD2DEG).toDict(),
                    scale: comp.scale.toDict(),
                });
            } else if(comp.type === "Mesh") {
                app.updateMaterial();
            }
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
        const frame = animation.def['frames'][curFrame];
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
            if (app.comp?.id === rigId.substring(1)) {
                inspectorItems.componentController.setState({
                    position: rig.position.toDict(),
                    rotation: v.set(...rig.rotation).mul(TRI.RAD2DEG).toDict(),
                });
            }
        });
        if (animation.isReverse){
            // Frame 9 -> 8 -> 7 -> ... -> 0
            if (dt > 0.95) {
                animation.curFrame = (curFrame - 1 + animation.def['frames'].length) % animation.def['frames'].length;
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
                animation.curFrame = (curFrame + 1) % animation.def['frames'].length;
                dt = 0;
            }
            if (animation.curFrame === animation.def['frames'].length - 1 && !animation.isLoop) {
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
