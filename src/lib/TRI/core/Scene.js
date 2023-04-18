import { Object3D } from './index.js';

export class Scene extends Object3D {
    constructor() {
        super();
    }

    get type() {
        return "Scene";
    }
}
