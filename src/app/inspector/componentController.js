import { InspectorSection, state } from "../../lib/Inspector.js";


const componentController = new InspectorSection("componentController", "Component Controller", {

    position : state.group("Position", {
        x: state.slider(
            0,
            (v) => {console.log("x", v);},
            { min: -500, max: 500, step: 5 }
        ),
        y: state.slider(
            0,
            (v) => {console.log("y", v);},
            { min: -500, max: 500, step: 5 }
        ),
        z: state.slider(
            0,
            (v) => {console.log("z", v);},
            { min: -500, max: 500, step: 5 }
        ),
    }),
    angle: state.group("Angle", {
        x: state.slider(
            0,
            (v) => {console.log("angleX", v);},
            { min: -360, max: 360, step: 5 }
        ),
        y: state.slider(
            0,
            (v) => {console.log("angleY", v);},
            { min: -360, max: 360, step: 5 }
        ),
        z: state.slider(
            0,
            (v) => {console.log("angleZ", v);},
            { min: -360, max: 360, step: 5 }
        ),
    }),

    scale: state.group("Scale", {
        x: state.slider(
            1,
            (v) => {console.log("scaleX", v);},
            { min: 0, max: 5, step: 0.1 }
        ),
        y: state.slider(
            1,
            (v) => {console.log("scaleY", v);},
            { min: 0, max: 5, step: 0.1 }
        ),
        z: state.slider(
            1,
            (v) => {console.log("scaleZ", v);},
            { min: 0, max: 5, step: 0.1 }
        ),
    }),

    positionS : state.group("Position-S", {
        x: state.slider(
            0,
            (v) => {console.log("x", v);},
            { min: -500, max: 500, step: 5 }
        ),
        y: state.slider(
            0,
            (v) => {console.log("y", v);},
            { min: -500, max: 500, step: 5 }
        ),
        z: state.slider(
            0,
            (v) => {console.log("z", v);},
            { min: -500, max: 500, step: 5 }
        ),
    }),
    angleS: state.group("Angle-S", {
        x: state.slider(
            0,
            (v) => {console.log("angleX", v);},
            { min: -360, max: 360, step: 5 }
        ),
        y: state.slider(
            0,
            (v) => {console.log("angleY", v);},
            { min: -360, max: 360, step: 5 }
        ),
        z: state.slider(
            0,
            (v) => {console.log("angleZ", v);},
            { min: -360, max: 360, step: 5 }
        ),
    }),

    scaleS: state.group("Scale-S", {
        x: state.slider(
            1,
            (v) => {console.log("scaleX", v);},
            { min: 0, max: 5, step: 0.1 }
        ),
        y: state.slider(
            1,
            (v) => {console.log("scaleY", v);},
            { min: 0, max: 5, step: 0.1 }
        ),
        z: state.slider(
            1,
            (v) => {console.log("scaleZ", v);},
            { min: 0, max: 5, step: 0.1 }
        ),
    }),
});


export default {
    componentController,
};