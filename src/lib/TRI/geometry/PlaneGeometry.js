import { BufferAttribute, BufferGeometry } from "./index.js";

export class PlaneGeometry extends BufferGeometry {
    constructor(width=1, height=1) {
        super();
        this.width = width;
        this.height = height;
        const hw = width/2, hh = height/2;
        const vertices = new Float32Array([
            -hw, 0, -hh,
            hw,  0, -hh,
            hw,  0, hh,
            -hw, 0, hh,
            -hw, 0, -hh,
            hw,  0, hh,
        ]);
        this.setAttribute('position', new BufferAttribute(vertices, 3));
        this.calculateNormals();
    }

    get type() {
        return "PlaneGeometry";
    }

    toJSON() {
        const data = super.toJSON();
        delete data.attributes.position;
        return {
            ...data,
            width: this.width,
            height: this.height,
            type: this.type,
        };
    }

    static fromJSON(json, geom) {
        if(!geom) geom = new PlaneGeometry(json.width, json.height);
        BufferGeometry.fromJSON(json, geom);
        return geom;
    }
}