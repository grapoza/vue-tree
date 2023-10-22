export default [
  {
    id: 'basic-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'basic-node2',
    label: 'My Second Node',
    treeNodeSpec: {
      title: 'My node, and its fantastic title',
      input: {
        type: 'checkbox',
        name: 'checkbox1'
      },
      state: {
        expanded: true,
      }
    },
    children: [
      {
        id: 'basic-subnode1',
        label: 'This is a subnode',
        children: [],
        treeNodeSpec: {
          input: {
            type: 'radio',
            name: 'radio1',
            isInitialRadioGroupValue: true
          }
        }
      },
      {
        id: 'basic-subnode2',
        label: 'Another Subnode',
        children: [],
        treeNodeSpec: {
          input: {
            type: 'radio',
            name: 'radio1'
          }
        }
      },
      {
        id: 'basic-subnode3',
        label: 'This is a disabled, checked subnode',
        treeNodeSpec: {
          input: {
            type: 'checkbox',
            name: 'checkbox2'
          },
          state: {
            input: {
              value: true,
              disabled: true
            }
          }
        },
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