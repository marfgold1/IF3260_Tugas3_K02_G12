import { Color } from "../core/index.js";
import { Vector3 } from "../math/index.js";
import { ShaderMaterial } from "./index.js";
import phongFrag from "./shaders/phong.frag.js";
import phongVert from "./shaders/phong.vert.js";

export class PhongMaterial extends ShaderMaterial {
    /** @type {Color} */
    #ambientColor
    /** @type {Color} */
    #diffuseColor
    /** @type {Color} */
    #specularColor
    /** @type {Vector3} */
    #lightPosition

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
                lightPosition: lightPosition || new Vector3(0, 0, 1),
            },
        });
        this.#ambientColor = this.uniforms['ambientColor'];
        this.#diffuseColor = this.uniforms['diffuseColor'];
        this.#specularColor = this.uniforms['specularColor'];
        this.#lightPosition = this.uniforms['lightPosition'];
    }

    get id() {
        return "Phong";
    }

    get ambientColor() {
        return this.#ambientColor;
    }

    get diffuseColor() {
        return this.#diffuseColor;
    }

    get specularColor() {
        return this.#specularColor;
    }

    get lightPosition() {
        return this.#lightPosition;
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
}
