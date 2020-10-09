export default {
  tree1Data: [
    {
      id: 'node1',
      label: 'Node One',
      children: [],
      treeNodeSpec: {
        addChildCallback: function () { return Promise.resolve({ id: '' + Math.random(), label: 'Added' }); }
      }
    },
    {
      id: 'node2',
      label: 'Node Two',
      children: [
        {
          id: 'subnode1',
          label: 'Subnode One',
          children: []
        },
        {
          id: 'subnode2',
          label: 'Subnode Two',
          children: [
            {
              id: 'subsubnode1',
              label: 'Sub-Subnode 1',
              children: []
            },
            {
              id: 'subsubnode2',
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
      id: 'node1',
      label: 'Node One',
      children: [],
      treeNodeSpec: {
        addChildCallback: function () { return Promise.resolve({ id: '' + Math.random(), label: 'Added' }); }
      }
    },
    {
      id: 'node2',
      label: 'Node Two',
      children: [
        {
          id: 'subnode1',
          label: 'Subnode One',
          children: []
        },
        {
          id: 'subnode2',
          label: 'Subnode Two',
          children: [
            {
              id: 'subsubnode1',
              label: 'Sub-Subnode 1',
              children: []
            },
            {
              id: 'subsubnode2',
              label: 'Sub-Subnode 2',
              children: []
            }
          ]
        }
      ]
    }
  ]
};