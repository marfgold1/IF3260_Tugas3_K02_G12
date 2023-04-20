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
        console.log('isPlaying', app.animation.isPlaying);
        console.log('isReverse', app.animation.isReverse);
        console.log('isLoop', app.animation.isLoop);
        console.log('curFrame', app.animation.curFrame);

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