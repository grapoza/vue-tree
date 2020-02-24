export default [
  {
    id: 'node1',
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
    id: 'node2',
    label: 'Radiobutton Node',
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
  },
  {
    id: 'node3',
    label: 'Text Node',
    children: [
      {
        id: 'subnode1',
        label: 'Checkbox Subnode',
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
    ]
  }
];