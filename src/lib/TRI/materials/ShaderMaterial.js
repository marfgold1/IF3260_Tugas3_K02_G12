import { Color } from "../core/index.js";
import { Vector3 } from "../math/index.js";

export class ShaderMaterial {
    static #idCounter = 0;

    /** @type {string} Name of the material */
    name
    /** @type {string} Object ID */
    #id = "M" + (ShaderMaterial.#idCounter++).toString();
    /** @type {string} Vertex shader */
    #vertexShader
    /** @type {string} Fragment shader */
    #fragmentShader
    /** @type {{[key: string]: any}} Uniforms */
    #uniforms = {}

    /**
     * Create new instance of shader material.
     * @param {{name: string, vertexShader: string, fragmentShader: string, uniforms: object}} options 
     */
    constructor(options={}) {
        const {name, vertexShader, fragmentShader, uniforms} = options;
        this.name = name || this.type;
        this.#vertexShader = vertexShader;
        this.#fragmentShader = fragmentShader;
        this.#uniforms = uniforms;
    }

    get id() {
        return this.#id;
    }

    get vertexShader() {
        return this.#vertexShader;
    }

    get fragmentShader() {
        return this.#fragmentShader;
    }

    get uniforms() {
        return this.#uniforms;
    }

    get type() {
        return 'ShaderMaterial';
    }

    toJSON() {
        const uniformsData = {};
        for (const key in this.uniforms) {
            const uniform = this.uniforms[key];
            if (uniform instanceof Color) {
                uniformsData[key] = ['Color', uniform.toJSON()];
            } else if (uniform instanceof Vector3) {
                uniformsData[key] = ['Vector3', uniform.toJSON()];
            } else {
                uniformsData[key] = uniform;
            }
        }
        return {
            name: this.name,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            uniforms: uniformsData,
            type: this.type,
        };
    }

    static fromJSON(json, obj=null) {
        const uniforms = {};
        for (const key in json.uniforms) {
            const uniform = json.uniforms[key];
            if (uniform[0] == 'Color') {
                uniforms[key] = Color.fromJSON(uniform[1]);
            } else if (uniform[0] == 'Vector3') {
                uniforms[key] = Vector3.fromJSON(uniform[1]);
            } else {
                uniforms[key] = uniform;
            }
        }
        json.uniforms = uniforms;
        if (!obj) obj = new ShaderMaterial(json);
        else obj.#uniforms = json.uniforms;
        return obj;
    }

    equals(material) {
        return this.#id == material.#id;
    }
}