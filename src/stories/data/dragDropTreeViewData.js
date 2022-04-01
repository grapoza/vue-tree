export default {
  tree1Data: [
    {
      id: 'dragdrop1-node1',
      label: 'Node One',
      children: [],
      treeNodeSpec: {
        addChildCallback: function () { return Promise.resolve({ id: '' + Math.random(), label: 'Added' }); }
      }
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
  ],
  tree2Data: [
    {
      id: 'dragdrop2-node1',
      label: 'Node One',
      children: [],
      treeNodeSpec: {
        addChildCallback: function () { return Promise.resolve({ id: '' + Math.random(), label: 'Added' }); }
      }
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
  ]
};