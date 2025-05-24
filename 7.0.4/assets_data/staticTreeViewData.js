export const treeData = [
  {
    id: 'static-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'static-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'static-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'static-subnode2',
        label: 'This is another subnode',
        children: [
          {
            id: 'static-subsubnode1',
            label: 'An even deeper node',
            children: [],
          }
        ],
      }
    ],
  }
];

export function modelDefaults() {
  return {
    expandable: false,
    state: {
      expanded: true,
    },
  };
}