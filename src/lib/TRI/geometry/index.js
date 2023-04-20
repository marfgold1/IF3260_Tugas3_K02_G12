import { BufferGeometry } from './BufferGeometry.js';
import { BufferAttribute } from './BufferAttribute.js';
import { BoxGeometry } from './BoxGeometry.js';

const DeserializeBufferGeometry = (json) => {
    switch (json.type) {
        case "BoxGeometry":
            return BoxGeometry.fromJSON(json);
        default:
            return BufferGeometry.fromJSON(json);
    }
};

export {
    BufferAttribute,
    BufferGeometry,
    BoxGeometry,
    DeserializeBufferGeometry,
};
