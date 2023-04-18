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
        return {
            name: this.name,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            uniforms: this.uniforms,
            type: this.type,
        };
    }

    static fromJSON(json) {
        return new ShaderMaterial(json);
    }

    equals(material) {
        return this.#id == material.#id;
    }
}