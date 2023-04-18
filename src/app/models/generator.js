import TRI from "../../lib/TRI/TRI.js";
import { Vector3 } from "../../lib/TRI/math/Vector3.js";
import { M4 } from "../../lib/TRI/math/index.js";

const outerRadius =  100;
const innerRadius =  90;
const segments =  4;
const depth = 10;
const hd = depth / 2;

const geom = new TRI.BufferGeometry();
geom.setAttribute('position', new TRI.BufferAttribute(
    new Float32Array(Array(segments).fill([]).map((_, i) => {
        const t1 = i / segments * Math.PI * 2;
        const t2 = ((i + 1) % segments) / segments * Math.PI * 2;
        const xo1 = Math.cos(t1) * outerRadius, yo1 = Math.sin(t1) * outerRadius;
        const xo2 = Math.cos(t2) * outerRadius, yo2 = Math.sin(t2) * outerRadius;
        const xi1 = Math.cos(t1) * innerRadius, yi1 = Math.sin(t1) * innerRadius;
        const xi2 = Math.cos(t2) * innerRadius, yi2 = Math.sin(t2) * innerRadius;
        const datas = [];
        const buf = new TRI.BufferAttribute([
            // front
            xo2, yo2, -hd,
            xo1, yo1, -hd,
            xi2, yi2, -hd,
            xo1, yo1, -hd,
            xi1, yi1, -hd,
            xi2, yi2, -hd,
            // back
            xo2, yo2, hd,
            xi2, yi2, hd,
            xo1, yo1, hd,
            xi1, yi1, hd,
            xo1, yo1, hd,
            xi2, yi2, hd,
            // up (prnghubung front dan back bagian luar)
            xo2, yo2, -hd,
            xo2, yo2, hd,
            xo1, yo1, -hd,
            xo1, yo1, -hd,
            xo2, yo2, hd,
            xo1, yo1, hd,
            // down (prnghubung front dan back bagian dalam)
            xi2, yi2, -hd,
            xi1, yi1, -hd,
            xi2, yi2, hd,
            xi1, yi1, -hd,
            xi1, yi1, hd,
            xi2, yi2, hd,
        ], 3);
        const offset = 65, off2 = offset;
        const v1 = new Vector3(), v2 = new Vector3(), v3 = new Vector3();
        const rots = [
            M4.transform([0,0,-offset],[0,0,45],[1,1,1]),
            M4.transform([0,0,offset],[0,0,45],[1,1,1]),
            M4.transform([0,-28,0],[0,0,0],[0.3,0.5,1]).premul(
                M4.transform([0,0,offset],[0,0,45],[1,1,1])
            ),
            M4.premul(
                M4.rotation3d(90,45,0),
                M4.translation3d(0,0,offset),
            ),
            M4.premul(
                M4.rotation3d(90,45,50),
                M4.translation3d(35,35,-offset*1.5),
            ),
            M4.premul(
                M4.rotation3d(90,45,-50),
                M4.translation3d(-35,-35,-offset*1.5),
            ),
            // 7 segments
            // M4.transform([0,0,0],[0,0,30],[0.875,0.875,1]),
            // M4.transform([0,0,0],[0,0,60],[0.75,0.75,1]),
            // M4.transform([0,0,0],[0,0,90],[0.625,0.625,1]),
            // M4.transform([0,0,0],[0,0,120],[0.5,0.5,1]),
        ]
        for(let n = 0; n < rots.length; n++) {
            for(let i = 0; i < buf.length; i += 3) {
                v1.fromBufferAttribute(buf, i);
                v2.fromBufferAttribute(buf, i + 1);
                v3.fromBufferAttribute(buf, i + 2);
                datas.push(
                    ...Vector3.mulMat(v1, rots[n]).toArray(),
                    ...Vector3.mulMat(v2, rots[n]).toArray(),
                    ...Vector3.mulMat(v3, rots[n]).toArray(),
                );
            }
        }
        return datas;
    }).flat()),
    3
));
geom.calculateNormals();

export default geom;
