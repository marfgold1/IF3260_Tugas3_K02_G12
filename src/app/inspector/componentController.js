import { InspectorSection, state } from "../../lib/Inspector.js";


const componentController = new InspectorSection("componentController", "Component Controller", {
    name: state.text("Component Name", null, {disabled: true}),
    position: state.vector3("Position", (i, v) => {
        app.rig.position[i] = v;
    }, {}),
    rotation: state.vector3("Rotation", (i, v) => {
        app.rig.rotation[i] = v;
    }, {}, {step: 0.05}),
    scale: state.vector3("Scale", (i, v) => {
        app.rig.scale[i] = v;
    }, {x: 1, y: 1, z: 1}, {step: 0.1}),
});


export default {
    componentController,
};