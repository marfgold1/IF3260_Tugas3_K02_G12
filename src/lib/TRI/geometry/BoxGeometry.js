import { BufferAttribute, BufferGeometry } from "./index.js";

export class BoxGeometry extends BufferGeometry {
    constructor(width=1, height=1, depth=1) {
        super();
        const hw = width/2, hh = height/2, hd = depth/2;
        this.vertices = new Float32Array([
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
        this.setAttribute('position', new BufferAttribute(this.vertices, 3));
        this.calculateNormals();
    }
}