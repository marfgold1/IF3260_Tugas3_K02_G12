import { Object3D, Scene } from "../core/index.js";
import { Mesh } from "./Mesh.js";
import { Rig } from "./Rig.js";
import { ArticulatedModel } from "./ArticulatedModel.js";

const DeserializeObject = (json) => {
    switch (json.type) {
        case "Object3D":
            return Object3D.fromJSON(json);
        case "Mesh":
            return Mesh.fromJSON(json);
        case "Scene":
            return Scene.fromJSON(json);
        case "Rig":
            return Rig.fromJSON(json);
        case "ArticulatedModel":
            return ArticulatedModel.fromJSON(json);
        default:
            return null;
    }
}

export {
    Mesh,
    Rig,
    ArticulatedModel,
    DeserializeObject,
}
