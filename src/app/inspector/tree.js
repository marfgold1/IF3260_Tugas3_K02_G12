import { InspectorSection, state } from "../../lib/Inspector.js";

const createComponentButton = (node, depth = 0) => {
    const buttons = [];
    const button = state.button(node.name, () => {
        console.log(node.name);
    }, `margin-left: ${depth * 20}px;`);

    // button.style.marginLeft = `${depth * 20}px`;

    buttons.push(button);
  
    for (const child of node.children || []) {
        const childButton = createComponentButton(child, depth + 1);
        buttons.push(...childButton);
    }
  
    return buttons;
};

const model = {
    name: "Body",
    children: [
        {
            name: "Head",
        },
        {
            name: "Left Arm",
        },
        {
            name: "Right Arm",
        },
    ]
}


const componentTree = new InspectorSection("componentTree", "Component Tree", {
    ...createComponentButton(model),
});

export default {
    componentTree,
};