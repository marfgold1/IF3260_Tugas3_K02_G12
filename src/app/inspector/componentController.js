import { InspectorSection, state } from "../../lib/Inspector.js";
import { Color } from "../../lib/TRI/core/Color.js";
import { DEG2RAD } from "../../lib/TRI/math/index.js";


const componentController = new InspectorSection("componentController", "Component Controller", {
    name: state.text("Component Name", null, {disabled: true}),
    position: state.vector3("Position", (i, v) => {
        app.comp.position[i] = v;
    }, {}),
    rotation: state.vector3("Rotation", (i, v) => {
        app.comp.rotation[i] = v * DEG2RAD;
    }, {}, {step: 1}),
    scale: state.vector3("Scale", (i, v) => {
        app.comp.scale[i] = v;
    }, {x: 1, y: 1, z: 1}, {step: 0.1}),
});

const componentPhongMat = new InspectorSection("componentPhongMat", "Component Phong Material", {
    name: state.text("Component Name", null, {disabled: true}),
    ambientColor: state.color("#ffffff", (v) => {
        app.comp.material.ambientColor.setHex(v);
    }),
    diffuseColor: state.color("#ffffff", (v) => {
        app.comp.material.diffuseColor.setHex(v);
    }),
    specularColor: state.color("#ffffff", (v) => {
        app.comp.material.specularColor.setHex(v);
    }),
    shininess: state.number(60, (v) => {
        app.comp.material.shininess = v;
    }),
});

const componentBasicMat = new InspectorSection("componentBasicMat", "Component Basic Material", {
    name: state.text("Component Name", null, {disabled: true}),
    color: state.color("#ffffff", (v) => {
        app.comp.material.color.setHex(v);
    }),
});


export default {
    componentController,
    componentBasicMat,
    componentPhongMat,
};