import { ShaderMaterial } from "./ShaderMaterial.js";
import { PhongMaterial } from "./PhongMaterial.js";
import { BasicMaterial } from "./BasicMaterial.js";

const DeserializeMaterial = (json) => {
    switch (json.type) {
        case "ShaderMaterial":
            return ShaderMaterial.fromJSON(json);
        case "PhongMaterial":
            return PhongMaterial.fromJSON(json);
        case "BasicMaterial":
            return BasicMaterial.fromJSON(json);
        default:
            return null;
    }
}

export {
    ShaderMaterial,
    PhongMaterial,
    BasicMaterial,
    DeserializeMaterial,
}