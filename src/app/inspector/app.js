import { InspectorSection, state } from "../../lib/Inspector.js";

const scene = new InspectorSection("scene", "Scene", {
    background: state.color("#000000", (v) => {
        app.renderer.clearColor.setHex(v);
    }),
    shading: state.toggle(true, (v) => {
        inspector.hide("light", "basicMat", "phongMat");
        if (v) {
            inspector.show("light", "phongMat");
            app.model.material = app.materials.phong;
        } else {
            inspector.show("basicMat");
            app.model.material = app.materials.basic;
        }
    }),
    reset: state.button("Reset View", () => {
        inspectorItems.camera.setState({
            mode: "perspective",
            distance: 1,
        });
    }),
});

const animation = new InspectorSection("animation", "Animation", {
    play: state.button("Toggle Play", () => {
        app.animation.isPlaying = !app.animation.isPlaying;
    }),
    speed: state.range(0.2, null, { min: 0.1, max: 2, step: 0.1 }),
    reverse: state.toggle(false, () => {
        app.animation.isReverse = !app.animation.isReverse;
    })
});

export default {
    scene,
    animation,
};