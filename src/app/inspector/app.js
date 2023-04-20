import { InspectorSection, state } from "../../lib/Inspector.js";

const scene = new InspectorSection("scene", "Scene", {
    background: state.color("#000000", (v) => {
        app.renderer.clearColor.setHex(v);
    }),
    shading: state.toggle(true, (v) => {
        app.updateMaterial(v);
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
    fps: state.range(10,
        (v) => {
            app.animation.fps = v;
        },
        { min: 0, max: 60, step: 1 }),
    loop: state.toggle(false, () => {
        app.animation.isLoop = !app.animation.isLoop;
    }),
    reverse: state.toggle(false, () => {
        app.animation.isReverse = !app.animation.isReverse;
    })
});

export default {
    scene,
    animation,
};