import { Toolbar, ToolItem } from "../lib/Toolbar.js";

import { inspector as insp, inspectorItems as inspd } from "./inspector.js";

export const tools = new Toolbar(document.getElementById("toolbar"));

export const toolitem = {
    file: new ToolItem("file", {
        onToggle() { insp.toggle("import"); insp.toggle("export"); insp.toggle("animImport"); insp.toggle("animExport"); },
    }),
}
Object.keys(toolitem).forEach((v) => { tools.add(toolitem[v]); });

globalThis.app = {
    ...globalThis.app,
    toolbar: {
        instance: tools,
        tools: toolitem,
    }
};
