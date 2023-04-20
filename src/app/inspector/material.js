import { InspectorSection, state } from "../../lib/Inspector.js";

const basicMat = new InspectorSection("basicMat", "Basic Material", {
    color: state.color("#ffffff", (v) => {
        app.materials.basic.color.setHex(v);
    }),
});

const phongMat = new InspectorSection("phongMat", "Phong Material", {
    diffuseColor: state.color("#ffffff", (v) => {
        app.materials.phong.diffuseColor.setHex(v);
    }),
    specularColor: state.color("#ffffff", (v) => {
        app.materials.phong.specularColor.setHex(v);
    }),
    shininess: state.number(80, (v) => {
        app.materials.phong.shininess = v;
    }),
});

const light = new InspectorSection("light", "Light", {
    color: state.color("#ffffff", (v) => {
        app.light.color.setHex(v);
    }),
    direction: state.vector3("Light Direction", (i,v) => {
        app.light.direction[i] = v;
    },{},{step:0.1}),
});

export default {
    // basicMat,
    // phongMat,
    // light,
}