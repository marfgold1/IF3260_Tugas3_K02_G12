/**
 * @typedef {T[keyof T]} valueOf<T>
 * @template T
 */
/**
 * @typedef {(v: number|number[])=>void} UniformSetters
 * @typedef {(v: BufferAttribute)=>void} AttribSetters
 * @typedef {{program: WebGLProgram, uniformSetters: {}, attribSetters: {}}} ProgramInfo
 */
import { ShaderMaterial } from '../materials/index.js';
import { Color, EventDispatcher, Object3D, Scene, SetterWebGLType, ShaderType } from './index.js';
import { Camera } from '../cameras/index.js';
import { Mesh } from '../objects/index.js';
import { BufferAttribute } from '../geometry/index.js';
import { M4, Vector3 } from '../math/index.js';

export class WebGL extends EventDispatcher {
    /** @type {WebGLRenderingContext?} */
    #gl
    /** @type {HTMLCanvasElement} */
    #canvas
    /** @type {Color} */
    #clearColor
    /** @type {Object<string, ProgramInfo>} */
    #shaderCache={}
    /** @type {ProgramInfo} */
    #currentProgram=null

    /**
     * Creates an instance of WebGL.
     * @param {(String|HTMLCanvasElement)} [canvas=null] Canvas element or its ID
     * @memberof WebGL
     */
    constructor(canvas=null) {
        super();
        this.#canvas = canvas;
        if (typeof canvas === 'string' || canvas instanceof String)
            this.#canvas = document.querySelector(canvas);
        this.#gl = this.#canvas.getContext('webgl');
        if (!this.#gl) {
            alert('Unable to initialize WebGL.');
        }
        this.#clearColor = new Color(0, 0, 0, 1);
        this.setViewport(0, 0, this.#canvas.clientWidth, this.#canvas.clientHeight);
        this.#adjustCanvas();
        const ro = new ResizeObserver(this.#adjustCanvas.bind(this));
        ro.observe(this.#canvas, {box: 'content-box'});
    }

    get clearColor() {
        return this.#clearColor;
    }

    /**
     * Check if WebGL is available.
     *
     * @return {boolean} Is WebGL available?
     * @memberof WebGL
     */
    isAvailable() {
        return !!this.#gl;
    }

    /**
     * Set the viewport of renderer.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @memberof WebGL
     */
    setViewport(x, y, width, height) {
        this.#gl.viewport(x, y, width, height);
    }

    #setProgramInfo(info) {
        if (this.#currentProgram !== info) {
            this.#gl.useProgram(info.program);
            this.#currentProgram = info;
        }
    }

    #adjustCanvas() {
        const canvas = this.#canvas;
        const dw = canvas.clientWidth;
        const dh = canvas.clientHeight;
        if (canvas.width !== dw || canvas.height !== dh) {
            this.dispatchEvent({type: 'resize', width: dw, height: dh});
            canvas.width = dw;
            canvas.height = dh;
            this.setViewport(0, 0, dw, dh);
        }
    }

    /**
     * Create uniform setters from the program. 
     * @param {WebGLProgram} program WebGL Program.
     * @returns {UniformSetters} Uniform setter.
     */
    #createUniformSetters(program) {
        let gl = this.#gl;

        function createUniformSetter(info) {
            const loc = gl.getUniformLocation(program, info.name);
            const isArray = (info.size > 1 && info.name.substr(-3) === '[0]');
            const type = SetterWebGLType[info.type];
            return (v) => {
                if (typeof v === 'object' && 'toArray' in v) v = v.toArray();
                if (isArray) {
                    gl[`uniform${type}v`](loc, v);
                } else {
                    if (type.substr(0, 6) === 'Matrix')
                        gl[`uniform${type}`](loc, false, v);
                    else {
                        if (Array.isArray(v))
                            gl[`uniform${type}`](loc, ...v);
                        else
                            gl[`uniform${type}`](loc, v);
                    }
                }
            };
        }

        const uniformSetters = {};
        const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniforms; i++) {
            const info = gl.getActiveUniform(program, i);
            if (!info) break;
            let name = (info.name.substr(-3) === '[0]') ? info.name.substr(0, info.name.length - 3) : info.name;
            uniformSetters[name] = createUniformSetter(info);
        }
        return uniformSetters;
    }

    /**
     * Create attribute setters for the program.
     * @param {WebGLProgram} program WebGL Program
     * @returns {AttribSetters}
     */
    #createAttribSetters(program) {
        let gl = this.#gl;

        /**
         * Create attribute setter.
         * @param {WebGLProgram} program WebGL Program.
         * @param {ProgramInfo} info Program info.
         * @returns {AttribSetters}
         */
        function createAttribSetter(info) {
            const loc = gl.getAttribLocation(program, info.name);
            const buf = gl.createBuffer();
            return (v) => {
                gl.bindBuffer(gl.ARRAY_BUFFER, buf);
                gl.enableVertexAttribArray(loc);
                gl.bufferData(gl.ARRAY_BUFFER, v.data, gl.STATIC_DRAW);
                gl.vertexAttribPointer(loc, v.size, v.dtype, v.normalize, v.stride, v.offset);
            }
        }

        const attribSetters = {};
        const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttribs; i++) {
            const info = gl.getActiveAttrib(program, i);
            if (!info) break;
            attribSetters[info.name] = createAttribSetter(info);
        }
        return attribSetters;
    }

    #setAttribs(attribs) {
        const setters = this.#currentProgram.attribSetters;
        for (let attrName in attribs) {
            const shaderName = `a_${attrName}`;
            if (shaderName in setters)
                setters[shaderName](attribs[attrName]);
        }
    }

    #setUniforms(uniforms) {
        const setters = this.#currentProgram.uniformSetters;
        for (let uniformName in uniforms) {
            const shaderName = `u_${uniformName}`;
            if (shaderName in setters)
                setters[shaderName](uniforms[uniformName]);
        }
    }

    /**
     * Create a new shader from source.
     *
     * @param {string} source String code of the shader.
     * @param {valueOf<ShaderType>} type Type of the shader.
     * @return {WebGLShader?} 
     * @memberof WebGL
     */
    #createShader(source, type) {
        let gl = this.#gl;
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            return shader;
        
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    /**
     * Create a new program from two shaders.
     *
     * @param {WebGLShader} vertexShader The vertex shader.
     * @param {WebGLShader} fragmentShader The fragment shader.
     * @return {ProgramInfo?}
     * @memberof WebGL
     */
    #createProgram(vertexShader, fragmentShader) {
        let gl = this.#gl;
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS))
            return {
                program,
                uniformSetters: this.#createUniformSetters(program),
                attribSetters: this.#createAttribSetters(program)
            };
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    /**
     * Create material to use.
     * @param {ShaderMaterial} material Material to create.
     * @returns {ProgramInfo}
     */
    #createOrGetMaterial(material) {
        if (material instanceof ShaderMaterial) {
            const progId = material.id;
            if (!(progId in this.#shaderCache)) {
                this.#shaderCache[progId] = this.#createProgram(
                    this.#createShader(material.vertexShader, ShaderType.VERTEX),
                    this.#createShader(material.fragmentShader, ShaderType.FRAGMENT)
                );
            }
            return this.#shaderCache[progId];
        } else {
            throw new Error('Unsupported material type.');
        }
    }

    /**
     * Render the scene.
     *
     * @param {Scene} scene The scene to render.
     * @param {Camera} camera The camera to render.
     * @memberof WebGL
     */
    render(scene, camera) {
        let gl = this.#gl;
        gl.clearColor(...this.#clearColor.toArray());
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        const defaultUniform = {
            cameraPosition: camera.worldPosition,
            viewMatrix: camera.viewProjectionMatrix,
        }

        this.#renderObject(scene, defaultUniform);
    }

    /**
     * Render object recursively.
     * 
     * @param {Object3D} object Object to render.
     * @param {{resolution: [number, number], time: number, viewMatrix: M4}} uniforms Default uniforms for every object to use.
     */
    #renderObject(object, uniforms) {
        if (!object.visible) return;
        object.updateWorldMatrix(false, true);
        if (object instanceof Mesh) {
            /** @type {ShaderMaterial} */
            const material = object.material;
            /** @type {ProgramInfo} */
            const info = this.#createOrGetMaterial(material);
            this.#setProgramInfo(info);
            this.#setAttribs(object.geometry.attributes);
            this.#setUniforms({
                ...object.material.uniforms,
                ...uniforms,
                worldMatrix: object.worldMatrix,
                useVertexColor: object.geometry.useVertexColors,
            });
            this.#gl.drawArrays(this.#gl.TRIANGLES, 0, object.geometry.attributes.position.count);
        }
        for (let key in object.children) {
            this.#renderObject(object.children[key], uniforms);
        }
    }
}
