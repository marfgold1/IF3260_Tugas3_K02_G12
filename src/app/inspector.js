import { Inspector } from "../lib/Inspector.js";
import inspitms from "./inspector/index.js";

export const inspector = new Inspector(document.getElementById("insp"));
export const inspectorItems = inspitms;

globalThis.inspector = inspector;
globalThis.inspectorItems = inspectorItems;

Object.keys(inspectorItems).forEach((v) => { inspector.register(inspectorItems[v]); });
// inspector.show("scene", "animation", "phongMat", "light", "camera", "model", "componentTree");
inspector.show("animation", "scene", "camera");