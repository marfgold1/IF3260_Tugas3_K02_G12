import { Object3D } from "../core/index.js";
import { DeserializeMaterial } from "../materials/index.js";
import { Mesh } from "./Mesh.js";
import { Rig } from "./Rig.js";

/** @typedef {{ options: { [k: string]: any }, children: {[k: string]: ModelDefinition} }} ModelDefinition */

export class ArticulatedModel extends Object3D {
    /** @type {{[k: string]: Rig}} */
    #rigs={}
    #materials={}

    /**
     * Add rig to the model.
     * @param {Rig[]} rig Rig to add to the model.
     */
    addRig(...rig) {
        if (rig.length > 1) {
            rig.forEach((rig) => {
                this.addRig(rig);
            });
            return this;
        }
        if (rig.length === 0) return this;
        
        const curRig = rig[0];
        if (curRig.id in this.#rigs) {
            throw new Error(`Rig with name ${curRig.name} already exists in model.`);
        }
        this.#rigs[curRig.id] = curRig;
        return this;
    }

    /**
     * Remove rig from the model.
     * @param {Rig} rig Rig to remove from the model.
     */
    removeRig(rig) {
        if (rig.id in this.#rigs) {
            delete this.#rigs[rig.id];
        }
    }

    get type() {
        return "ArticulatedModel";
    }

    get rigs() {
        return this.#rigs;
    }

    get materials() {
        return this.#materials;
    }

    get tree() {
        function getCompTree(childrens) {
            const comp = {};
            childrens.forEach((child) => {
                if (child instanceof Rig || child instanceof Mesh) {
                    comp[child.name] = {};
                    comp[child.name].children = getCompTree(child.children);
                    comp[child.name].component = child;
                }
            });
            return comp;
        }
        return getCompTree(this.children);
    }

    toJSON() {
        const data = super.toJSON();
        function trimMat(d) {
            if (d.type === "Mesh") {
                delete d.material;
            }
            d.children.forEach((child) => {
                trimMat(child);
            });
        }
        trimMat(data);

        return {
            ...data,
            rigs: Object.keys(this.#rigs),
            materials: this.#materials,
            type: this.type,
        };
    }

    static getRigs(obj) {
        let rigs = {};
        obj.children.forEach((child) => {
            rigs = {
                ...rigs,
                ...this.getRigs(child),
            }
            if (child instanceof Rig) {
                if (child.id in rigs) throw new Error(`Rig with id ${child.id} already exists in model.`);
                rigs[child.id] = child;
            }
        });
        return rigs;
    }

    static fromJSON(json, obj=null) {
        if (!obj) obj = new ArticulatedModel();
        super.fromJSON(json, obj);
        const rigsTemp = this.getRigs(obj);
        json.rigs.forEach((rigId) => {
            if (!(rigId in rigsTemp)) throw new Error(`Rig with id ${rigId} not found in model.`);
            obj.addRig(rigsTemp[rigId]);
        });
        Object.keys(json.materials).forEach((matName) => {
            obj.#materials[matName] = json.materials[matName].map(
                (mat) => DeserializeMaterial(mat)
            );
        });
        function attachMat(d) {
            if (d.type === "Mesh") {
                d.material = obj.#materials[d.name][0];
            }
            d.children.forEach((child) => {
                attachMat(child);
            });
        }
        attachMat(obj);
        return obj;
    }

    /**
     * Create articulated model from model definition.
     * @param {{[k: string]: ModelDefinition}} modelDefinition
     * @return {ArticulatedModel} 
     */
    static fromModelDefinition(modelDefinition, model=null, parent=null) {
        if(!model) model = new ArticulatedModel();
        Object.keys(modelDefinition).forEach((objName) => {
            let child = null;
            const md = modelDefinition[objName];
            if (objName[0] == "R") {
                child = new Rig(objName.substring(1));
                model.addRig(child);
            } else if (objName[0] == "P") {
                model.#materials[objName] = [
                    new TRI.PhongMaterial(),
                    new TRI.BasicMaterial(),
                ];
                child = new Mesh(
                    new TRI.BoxGeometry(1, 1, 1),
                    model.#materials[objName][0],
                );
            } else {
                throw new Error(`Invalid object name ${objName}`);
            }
            child.name = objName;
            if (parent) parent.add(child);
            else model.add(child);
            if (md.options)
                Object.keys(md.options).forEach((optionName) => {
                    child[optionName].set(...md.options[optionName]);
                });
            if (md.children)
                this.fromModelDefinition(md.children, model, child);
        });
        return model;
    }
};