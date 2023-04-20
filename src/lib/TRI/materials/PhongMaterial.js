import { Color } from "../core/index.js";
import { Vector3 } from "../math/index.js";
import { ShaderMaterial } from "./index.js";
import phongFrag from "./shaders/phong.frag.js";
import phongVert from "./shaders/phong.vert.js";

export class PhongMaterial extends ShaderMaterial {
    /**
     * Creates an instance of PhongMaterial.
     * @param {{name: string, ambientColor: Color, diffuseColor: Color, specularColor: Color, shininess: number, lightPosition: Vector3}} options
     * @memberof PhongMaterial
     */
    constructor(options={}) {
        const {name, ambientColor, diffuseColor, specularColor, shininess, lightPosition} = options;
        super({
            name,
            vertexShader: phongVert,
            fragmentShader: phongFrag,
            uniforms: {
                ambientColor: ambientColor || Color.white(),
                diffuseColor: diffuseColor || Color.white(),
                specularColor: specularColor || Color.white(),
                shininess: shininess || 1,
                lightPosition: lightPosition || new Vector3(5, 0, 5),
            },
        });
    }

    get id() {
        return "Phong";
    }

    /** @type {Color} */
    get ambientColor() {
        return this.uniforms['ambientColor'];
    }

    /** @type {Color} */
    get diffuseColor() {
        return this.uniforms['diffuseColor'];
    }

    /** @type {Color} */
    get specularColor() {
        return this.uniforms['specularColor'];
    }

    /** @type {Vector3} */
    get lightPosition() {
        return this.uniforms['lightPosition'];
    }

    /** @type {number} */
    get shininess() {
        return this.uniforms['shininess'];
    }

    set shininess(val) {
        this.uniforms['shininess'] = val;
    }

    get type() {
        return 'PhongMaterial';
    }

    toJSON() {
        const { vertexShader, fragmentShader, ...other } = super.toJSON();
        return {
            ...other,
            type: this.type,
        };
    }

    static fromJSON(json) {
        const obj = new PhongMaterial(json);
        ShaderMaterial.fromJSON(json, obj);
        return obj;
    }
}
