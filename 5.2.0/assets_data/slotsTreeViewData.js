export default [
  {
    id: 'slots-node1',
    label: 'Checkbox Node',
    children: [],
    treeNodeSpec: {
      input: {
        type: 'checkbox',
        name: 'checkbox1'
      },
      state: {
        input: {
          value: false,
          disabled: false
        }
      }
    }
  },
  {
    id: 'slots-node2',
    label: 'Radiobutton Node',
    treeNodeSpec: {
      input: {
        type: 'radio',
        name: 'radiobutton1'
      },
      state: {
        input: {
          value: false,
          disabled: false
        }
      }
    }
  },
  {
    id: 'slots-node3',
    label: 'Text Node',
    children: [
      {
        id: 'slots-subnode1',
        label: 'Checkbox Subnode',
        treeNodeSpec: {
          input: {
            type: 'checkbox',
            name: 'checkbox2'
          },
          state: {
            input: {
              value: false,
              disabled: false
            }
          },
          children: []
        }
      }
    ]
  },
  {
    id: 'slots-node4',
    label: 'Text Node with Async Children',
    children: [],
    treeNodeSpec: {
      expandable: true,
      loadChildrenAsync: (m) => new Promise(() => { }), // Never resolve so the demo node stays up.
    }
  }
];