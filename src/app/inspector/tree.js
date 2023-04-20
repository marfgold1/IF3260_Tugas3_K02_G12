import { InspectorSection, state } from "../../lib/Inspector.js";

const createComponentButton = (rigs, depth = 0) => {
    let buttons = {};

    Object.keys(rigs).forEach((rigId) => {
        const rig = rigs[rigId];
        buttons[rigId] = state.button(rigId, () => {
            app.updateRig(rigId);
        }, `margin-left: ${depth * 20}px;`);
        buttons = {
            ...buttons,
            ...createComponentButton(rig.children, depth + 1),
        }
    });
    return buttons;
};

let componentTree = null;
const updateComponentTree = (rigs) => {
    const buttons = {};
    if (componentTree) inspector.unregister(componentTree);
    componentTree = new InspectorSection(
        "compTree",
        "Component Tree",
        createComponentButton(rigs),
    );
    globalThis.componentTree = componentTree;
    inspector.register(componentTree);
    inspector.show("compTree");
    inspector.order("compTree", 0);
};

export default {
    update: updateComponentTree,
};