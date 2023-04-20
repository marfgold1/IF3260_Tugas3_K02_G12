import { InspectorSection, state } from "../../lib/Inspector.js";

const createComponentButton = (tree, depth = 0) => {
    let buttons = {};
    Object.keys(tree).forEach((compName) => {
        const comp = tree[compName];
        buttons[compName] = state.button(compName, () => {
            app.updateComponent(comp)
        }, `margin-left: ${depth * 20}px;`);
        buttons = {
            ...buttons,
            ...createComponentButton(comp.children, depth + 1),
        }
    });
    return buttons;
};

let componentTree = null;
const updateComponentTree = (tree) => {
    if (componentTree) inspector.unregister(componentTree);
    componentTree = new InspectorSection(
        "compTree",
        "Component Tree",
        createComponentButton(tree),
    );
    globalThis.tree = tree;
    globalThis.componentTree = componentTree;
    inspector.register(componentTree);
    inspector.show("compTree");
    inspector.order("compTree", 0);
};

export default {
    update: updateComponentTree,
};