import { BufferAttribute, BufferGeometry } from "./index.js";

export class BoxGeometry extends BufferGeometry {
    constructor(width=1, height=1, depth=1) {
        super();
        this.width = width;
        this.height = height;
        this.depth = depth;
        const hw = width/2, hh = height/2, hd = depth/2;
        const vertices = new Float32Array([
            // Front face
            -hw, hh,  hd,
            -hw, -hh, hd,
            hw,  -hh, hd,
            hw,  hh,  hd,
            -hw, hh, hd,
            hw,  -hh, hd,
            // Back face
            -hw, hh,  -hd,
            hw,  -hh, -hd,
            -hw, -hh, -hd,
            hw,  hh,  -hd,
            hw,  -hh, -hd,
            -hw, hh, -hd,
            // Top face
            -hw, hh,  -hd,
            -hw, hh,  hd,
            hw,  hh,  hd,
            hw,  hh,  -hd,
            -hw, hh, -hd,
            hw,  hh,  hd,
            // Bottom face
            -hw, -hh, -hd,
            hw,  -hh, -hd,
            hw,  -hh, hd,
            -hw, -hh, hd,
            -hw, -hh, -hd,
            hw,  -hh, hd,
            // Right face
            hw,  -hh, -hd,
            hw,  hh,   hd,
            hw,  -hh,  hd,
            hw,  -hh, -hd,
            hw,  hh,   -hd,
            hw,  hh,   hd,
            // Left face
            -hw, -hh, -hd,
            -hw, hh,  hd,
            -hw, hh,  -hd,
            -hw, -hh, -hd,
            -hw, -hh, hd,
            -hw, hh,  hd
        ]);
        this.setAttribute('position', new BufferAttribute(vertices, 3));
        this.calculateNormals();
    }

    get type() {
        return "BoxGeometry";
    }

    toJSON() {
        const data = super.toJSON();
        delete data.attributes.position;
        return {
            ...data,
            width: this.width,
            height: this.height,
            depth: this.depth,
            type: this.type,
        };
    }

    static fromJSON(json, geom) {
        if(!geom) geom = new BoxGeometry(json.width, json.height, json.depth);
        BufferGeometry.fromJSON(json, geom);
        return geom;
    }
}