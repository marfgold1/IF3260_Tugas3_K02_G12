import { InspectorSection, state } from "../../lib/Inspector.js";
const scaleOpts = { step: 0.1 };
const download = document.createElement("a");

const model = new InspectorSection("model", "Model", {
    pos: state.vector3("Position", (i, v) => {
        app.model.position[i] = v;
    }),
    rot: state.vector3("Rotation", (i, v) => {
        app.model.rotation[i] = v;
    }),
    scale: state.vector3("Scale", (i, v) => {
        app.model.scale[i] = v;
    }, {x:1, y:1, z:1}),
});

const modelImport = new InspectorSection("import", "Import", {
    file: state.file((v) => {
        console.log(v);
    }),
    import: state.button("Import", (v) => {
        const file = modelImport.state.file;
        const data = JSON.parse(file);
        app.model.geometry.setAttribute('position', new TRI.BufferAttribute(new Float32Array(
            data.position.flat()
        ), 3));
        app.model.geometry.calculateNormals(true);
        inspectorItems.model.setState({
            pos: {x: 0, y: 0, z: 0},
            rot: {x: 0, y: 0, z: 0},
            scale: {x: 1, y: 1, z: 1},
        })
        if (data.color)
            app.model.geometry.setAttribute('color', new TRI.BufferAttribute(new Float32Array(data.color), 3));
    }),
});

const modelExport = new InspectorSection("export", "Export", {
    fileName: state.text("model.json"),
    export: state.button("Export", () => {
        const pos = app.model.geometry.getAttribute('position');
        // transform pos to world space
        const v = new TRI.Vector3();
        const posData = [];
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            v.mulMat(app.model.worldMatrix);
            posData.push([v.x, v.y, v.z]);
        }

        const data = JSON.stringify({
            position: posData,
            color: Array.from(app.model.geometry.getAttribute('color')?.data || []),
        }, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        download.href = url;
        
        download.download = modelExport.state.fileName;
        download.click();
    }),
});

export default {
    model,
    modelImport,
    modelExport,
};