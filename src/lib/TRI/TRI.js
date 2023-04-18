import * as Cameras from "./cameras/index.js";
import * as OrbitControls from "./controls/index.js";
import * as Core from "./core/index.js";
import * as Geometry from "./geometry/index.js";
import * as Material from "./materials/index.js";
import * as Maths from "./math/index.js";
import * as Objects from "./objects/index.js";

globalThis.TRI = {
    ...Cameras,
    ...OrbitControls,
    ...Core,
    ...Geometry,
    ...Material,
    ...Objects,
    ...Maths,
}

export default globalThis.TRI;
