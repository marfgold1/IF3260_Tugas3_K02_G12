import { Object3D } from "../core/index.js";
import { BufferGeometry, DeserializeBufferGeometry } from "../geometry/index.js";
import { BasicMaterial, DeserializeMaterial, PhongMaterial, ShaderMaterial } from "../materials/index.js";

export class Mesh extends Object3D {
    /** @type {BufferGeometry} */
    geometry
    /** @type {ShaderMaterial|PhongMaterial|BasicMaterial} */
    material

    /**
     * Creates an instance of Model.
     * @param {ShaderMaterial|PhongMaterial|BasicMaterial} material
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

    toJSON() {
        return { 
            ...super.toJSON(),
            geometry: this.geometry.toJSON(),
            material: this.material.toJSON(),
            type: this.type,
        };
    }

    static fromJSON(json, obj=null) {
        if (!obj) obj = new Mesh();
        super.fromJSON(json, obj);
        obj.geometry = DeserializeBufferGeometry(json.geometry);
        obj.material = DeserializeMaterial(json.material);
        return obj;
    }
}
