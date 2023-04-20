import { Color } from "../core/index.js";
import { ShaderMaterial } from "./index.js";
import basicFrag from "./shaders/basic.frag.js";
import basicVert from "./shaders/basic.vert.js";

export class BasicMaterial extends ShaderMaterial {
    /** @type {Color} */
    #color

    /**
     * Creates an instance of BasicMaterial.
     * @param {{name: string, color: Color}} options
     * @memberof BasicMaterial
     */
    constructor(options) {
        const {name, color} = options || {};
        super({
            name: name,
            vertexShader: basicVert,
            fragmentShader: basicFrag,
            uniforms: {
                color: color || Color.white(),
            },
        });
        this.#color = this.uniforms['color'];
    }

    get id() {
        return "Basic";
    }

    get color() {
        return this.#color;
    }

    get type() {
        return 'BasicMaterial';
    }

    toJSON() {
        const { vertexShader, fragmentShader, ...other } = super.toJSON();
        return {
            ...other,
            type: this.type,
        };
    }

    static fromJSON(json) {
        const obj = new BasicMaterial(json);
        ShaderMaterial.fromJSON(json, obj);
        return obj;
    }
}
