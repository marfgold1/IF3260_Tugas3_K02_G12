import { Object3D } from './index.js';

export class Scene extends Object3D {
    get type() {
        return "Scene";
    }

    toJSON() {
        return { 
            ...super.toJSON(),
            type: this.type,
        };
    }

    static fromJSON(json, obj=null) {
        if (!obj) obj = new Scene();
        super.fromJSON(json, obj);
        return obj;
    }
}
