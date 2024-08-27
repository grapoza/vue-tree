export const tree1Data = [
  {
    id: 'dragdrop1-node1',
    label: 'Node One',
    children: [],
  },
  {
    id: 'dragdrop1-node2',
    label: 'Node Two',
    children: [
      {
        id: 'dragdrop1-subnode1',
        label: 'Subnode One',
        children: []
      },
      {
        id: 'dragdrop1-subnode2',
        label: 'Subnode Two',
        children: [
          {
            id: 'dragdrop1-subsubnode1',
            label: 'Sub-Subnode 1',
            children: []
          },
          {
            id: 'dragdrop1-subsubnode2',
            label: 'Sub-Subnode 2',
            children: []
          }
        ]
      }
    ]
  }
];

export const tree2Data = [
  {
    id: 'dragdrop2-node1',
    label: 'Node One',
    children: [],
  },
  {
    id: 'dragdrop2-node2',
    label: 'Node Two',
    children: [
      {
        id: 'dragdrop2-subnode1',
        label: 'Subnode One',
        children: []
      },
      {
        id: 'dragdrop2-subnode2',
        label: 'Subnode Two',
        children: [
          {
            id: 'dragdrop2-subsubnode1',
            label: 'Sub-Subnode 1',
            children: []
          },
          {
            id: 'dragdrop2-subsubnode2',
            label: 'Sub-Subnode 2',
            children: []
          }
        ]
      }
    ]
  }
];

export function modelDefaults(node) {

  const baseDefaults = {
    expanderTitle: "Expand this node",
    draggable: true,
    allowDrop: true,
    state: {
      expanded: true,
    },
  };

  if (node.id === 'dragdrop1-node1' || node.id === 'dragdrop2-node1') {
    baseDefaults.addChildCallback = function () { return Promise.resolve({ id: '' + Math.random(), label: 'Added' }); }
  }

  return baseDefaults;
};


