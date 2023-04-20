import { InspectorSection, state } from "../../lib/Inspector.js";
import ComponentTree from"./tree.js";
const download = document.createElement("a");

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
        ComponentTree.update(app.model.rigsTree);
        app.updateRig();
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
    modelImport,
    modelExport,
};