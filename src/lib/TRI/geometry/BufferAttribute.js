import { WebGLType } from "../core/index.js";

export class BufferAttribute {
    /** @type {Float32Array} */
    #data;
    /** @type {number} */
    #size;
    /** @type {number} */
    #dtype=WebGLType.FLOAT;
    /** @type {boolean} */
    normalize=false;
    /** @type {number} */
    stride=0;
    /** @type {number} */
    offset=0;

    /**
     * Creates an instance of BufferAttribute.
     * @param {Float32Array} data Typed array data.
     * @param {number} size Size of each element in the buffer.
     * @param {{dtype?: number, normalize?: boolean, stride?: number, offset?: number}} options Options for attribute.
     * @memberof BufferAttribute
     */
    constructor(data, size, options={}) {
        this.#data = data;
        this.#size = size;
        this.#dtype = options.dtype || this.#dtype;
        this.normalize = options.normalize || this.normalize;
        this.stride = options.stride || this.stride;
        this.offset = options.offset || this.offset;
    }

    get data() {
        return this.#data;
    }

    get dtype() {
        return this.#dtype;
    }

    /**
     * Size of each element in the buffer.
     *
     * @readonly
     * @memberof BufferAttribute
     */
    get size() {
        return this.#size;
    }

    /**
     * Number of elements in the buffer.
     *
     * @readonly
     * @memberof BufferAttribute
     */
    get count() {
        return this.data.length / this.size;
    }

    /**
     * Length of the buffer (elements * size).
     *
     * @readonly
     * @memberof BufferAttribute
     */
    get length() {
        return this.data.length;
    }

    set(index, data) {
        index *= this.size;
        for (let i = 0; i < data.length; i++) {
            this.data[index + i] = data[i];
        }
    }

    get(index, size=null) {
        index *= this.size;
        if (size === null) size = this.size;
        const data = [];
        for (let i = 0; i < size; i++) {
            data.push(this.data[index + i]);
        }
        return data;
    }

    get type() {
        return "BufferAttribute";
    }

    toJSON() {
        const opts = {};
        if (this.dtype !== WebGLType.FLOAT) opts.dtype = this.dtype;
        if (this.normalize) opts.normalize = this.normalize;
        if (this.stride) opts.stride = this.stride;
        if (this.offset) opts.offset = this.offset;
        return {
            type: this.type,
            data: Array.from(this.data),
            size: this.size,
            options: opts,
        };
    }

    static fromJSON(json, obj=null) {
        if(!obj) obj = new BufferAttribute(new Float32Array(json.data), json.size, json.options);
        return obj;
    }
}