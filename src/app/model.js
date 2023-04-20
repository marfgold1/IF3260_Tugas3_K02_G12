import TRI from "../lib/TRI/TRI.js";
// import modelDef from "./models/golem.js";
import modelDef from "./models/fox.js";

const model = TRI.ArticulatedModel.fromModelDefinition(modelDef);
model.scale.mul(20);

export default model;
