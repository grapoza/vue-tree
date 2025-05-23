export const treeData = [
  {
    id: "customization-skin-rootNode",
    label: "Root Node",
    children: [
      {
        id: "customization-skin-subNode",
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
        treeViewNodeSelfExpander: "action-button",
        treeViewNodeSelfExpandedIndicator: "fas fa-chevron-right",
        treeViewNodeSelfAction: "action-button",
        treeViewNodeSelfAddChildIcon: "fas fa-plus-circle",
        treeViewNodeSelfDeleteIcon: "fas fa-minus-circle",
      },
    },
  };

  if (node.id !== "customization-skin-rootNode") {
    defaults.deletable = true;
  }

  return defaults;
}

let skinChildCounter = 0;
async function addChildCallback(parentModel) {
  skinChildCounter++;
  return Promise.resolve({
    id: `customization-skin-child-node${this.childCounter}`,
    label: `Added Child ${this.childCounter} of ${parentModel.data.id}`,
    children: [],
  });
}