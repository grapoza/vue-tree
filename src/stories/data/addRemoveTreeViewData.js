export const treeData = [
  {
    id: 'addremove-rootNode',
    label: 'Root Node',
  }
];

export function modelDefaults(node) {
  const baseNodeSpec = {
    addChildCallback,
    deleteNodeCallback,
    state: {
      expanded: true,
    },
  };

  switch (node.id) {
    case 'addremove-rootNode':
      return baseNodeSpec;
    default:
      return Object.assign(baseNodeSpec, { deletable: true });
  }
};

let addRemoveChildCounter = 0;
function addChildCallback(parentModel) {
  addRemoveChildCounter++;
  return Promise.resolve({
    id: `child-node${addRemoveChildCounter}`,
    label: `Added Child ${addRemoveChildCounter} from parent ${parentModel.data.id}`,
  });
}
function deleteNodeCallback(model) {
  return Promise.resolve(window.confirm(`Delete node ${model.data.id}?`));
}