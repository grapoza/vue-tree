export const treeData = [
  {
    id: 'slots-node1',
    label: 'Checkbox Node',
    children: [],
  },
  {
    id: 'slots-node2',
    label: 'Radiobutton Node',
  },
  {
    id: 'slots-node3',
    label: 'Text Node',
    children: [
      {
        id: 'slots-subnode1',
        label: 'Checkbox Subnode',
        children: []
      }
    ]
  },
  {
    id: 'slots-node4',
    label: 'Text Node with Async Children',
    children: [],
  }
];

export function modelDefaults(node) {
  switch (node.id) {
    case 'slots-node1':
      return {
        input: {
          type: "checkbox",
          name: "checkbox1",
        },
        state: {
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'slots-node2':
      return {
        input: {
          type: "radio",
          name: "radiobutton1",
        },
        state: {
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'slots-node3':
      return {};
    case 'slots-subnode1':
      return {
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'slots-node4':
      return {
        expandable: true,
        loadChildrenAsync: (m) => new Promise(() => {}), // Never resolve so the demo node stays up.
      };
    default:
      return {};
  }
}