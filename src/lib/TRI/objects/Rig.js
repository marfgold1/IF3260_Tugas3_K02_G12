import { Object3D } from "../core/index.js";

export class Rig extends Object3D {
    /** @type {string} */
    #id

    constructor(id) {
        super();
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    get type() {
        return "Rig";
    }

    toJSON() {
        return { 
            ...super.toJSON(),
            type: this.type,
            id: this.#id,
        };
    }

    static fromJSON(json, obj=null) {
        if (!obj) obj = new Rig(json.id);
        super.fromJSON(json, obj);
        return obj;
    }
};