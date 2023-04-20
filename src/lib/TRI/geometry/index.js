import { BufferGeometry } from './BufferGeometry.js';
import { BufferAttribute } from './BufferAttribute.js';
import { BoxGeometry } from './BoxGeometry.js';
import { PlaneGeometry } from './PlaneGeometry.js';

const DeserializeBufferGeometry = (json) => {
    switch (json.type) {
        case "BoxGeometry":
            return BoxGeometry.fromJSON(json);
        case "PlaneGeometry":
            return PlaneGeometry.fromJSON(json);
        default:
            return BufferGeometry.fromJSON(json);
    }
};

export {
    BufferAttribute,
    BufferGeometry,
    BoxGeometry,
    PlaneGeometry,
    DeserializeBufferGeometry,
};
