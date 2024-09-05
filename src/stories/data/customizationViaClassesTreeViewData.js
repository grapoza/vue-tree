export const treeData = [
  {
    id: "customization-class-rootNode",
    label: "Root Node",
    children: [
      {
        id: "customization-class-subNode",
        label: "Subnode",
        children: [],
      },
    ],
  },
];

export function modelDefaults(node) {
  const defaults = {
    addChildCallback,
    customizations: {
      classes: {
        treeViewNodeSelf: "large-line",
        treeViewNodeSelfText: "big-text",
      },
    },
  };

  if (node.id !== "customization-class-rootNode") {
    defaults.deletable = true;
  }

  return defaults;
}

let classChildCounter = 0;
async function addChildCallback(parentModel) {
  classChildCounter++;
  return Promise.resolve({
    id: `customization-class-child-node${classChildCounter}`,
    label: `Added Child ${classChildCounter} of ${parentModel.data.id}`,
    children: [],
  });
}