import { Object3D } from "../core/index.js";
import { BufferGeometry } from "../geometry/index.js";
import { ShaderMaterial } from "../materials/index.js";

export class Mesh extends Object3D {
    /** @type {BufferGeometry} */
    geometry
    /** @type {ShaderMaterial} */
    material

    /**
     * Creates an instance of Model.
     * @param {ShaderMaterial} material
     * @memberof Model
     */
    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
    }

    get type() {
        return "Mesh";
    }
}
