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
    currentFrame: state.number(0, null, {disabled: true}),
    fps: state.range(10,
        (v) => {
            app.animation.fps = v;
        },
        { min: 0, max: 60, step: 1 }),
    loop: state.toggle(false),
    reverse: state.toggle(false),
});

export default {
    scene,
    animation,
};