import { InspectorSection, state } from "../../lib/Inspector.js";
import ComponentTree from"./tree.js";
import foxModel from "../models/fox.js";
import golemModel from "../models/golem.js";
import creeperModel from "../models/creeper.js";
import squidModel from "../models/squid.js";
import foxAnim from "../models/foxAnimation.js";
// import golemAnim from "../models/golemAnimation.js";
import creeperAnim from "../models/creeperAnimation.js";
import squidAnim from "../models/squidAnimation.js";

const download = document.createElement("a");

const modelChange = new InspectorSection("modelChange", "Select Model", {
    model: state.select("Model", "Fox", {
        Fox: "Fox",
        Golem : "Golem",
        Creeper: "Creeper",
        Squid: "Squid",
    }, (v) => {
        app.model.removeFromParent();
        switch (v) {
            case "Fox":
                app.model = TRI.ArticulatedModel.fromModelDefinition(foxModel);
                app.animation.def = foxAnim;
                break;
            case "Golem":
                app.model = TRI.ArticulatedModel.fromModelDefinition(golemModel);
                // app.animation.def = golemAnim;
                break;
            case "Creeper":
                app.model = TRI.ArticulatedModel.fromModelDefinition(creeperModel);
                app.animation.def = creeperAnim;
                break;
            case "Squid":
                app.model = TRI.ArticulatedModel.fromModelDefinition(squidModel);
                app.animation.def = squidAnim;
                break;
        }
        app.model.scale.mul(100);
        app.scene.add(app.model);
        ComponentTree.update(app.model.rigsTree);
        app.updateRig();
    }),
});


const modelImport = new InspectorSection("import", "Import", {
    file: state.file((v) => {
        console.log(v);
    }),
    import: state.button("Import", (v) => {
        const file = modelImport.state.file;
        const data = JSON.parse(file);
        app.model.removeFromParent();
        app.model = TRI.DeserializeObject(data);
        app.scene.add(app.model);
        ComponentTree.update(app.model.tree);
        app.updateComponent();
        app.updateMaterial();
    }),
});

const modelExport = new InspectorSection("export", "Export", {
    fileName: state.text("model.json"),
    export: state.button("Export", () => {
        const data = JSON.stringify(app.model);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        download.href = url;
        download.download = modelExport.state.fileName;
        download.click();
    }),
});

export default {
    modelChange,
    modelImport,
    modelExport,
};