export const treeData = [
  {
    id: 'basic-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'basic-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'basic-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'basic-subnode2',
        label: 'Another Subnode',
        children: [],
      },
      {
        id: 'basic-subnode3',
        label: 'This is a disabled, checked subnode',
        children: [
          {
            id: 'basic-subsubnode1',
            label: 'An even deeper node',
            children: []
          }
        ]
      }
    ]
  }
];

export function modelDefaults(node) {
  switch (node.id) {
    case 'basic-node1':
      return {};
    case 'basic-node2':
      return {
        title: "My node, and its fantastic title",
        input: {
          type: "checkbox",
          name: "checkbox1",
        },
        state: {
          expanded: true,
        },
      };
    case 'basic-subnode1':
      return {
        input: {
          type: "radio",
          name: "radio1",
          isInitialRadioGroupValue: true,
        },
      };
    case 'basic-subnode2':
      return {
        input: {
          type: "radio",
          name: "radio1",
        },
      };
    case 'basic-subnode3':
      return {
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          input: {
            value: true,
            disabled: true,
          },
        },
      };
    case 'basic-subsubnode1':
      return {};
  }
};