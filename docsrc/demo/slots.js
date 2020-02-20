export default [
  {
    id: 'node1',
    label: 'Checkbox Node',
    children: [],
    treeNodeSpec: {
      customizations: {
        classes: {
          treeViewNode: 'beep'
        }
      },
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
    treeNodeSpec: {
      customizations: {
        classes: {
          treeViewNode: 'boop'
        }
      },
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
    id: 'node3',
    label: 'Text Node',
    children: [],
    treeNodeSpec: {
      customizations: {
        classes: {
          treeViewNode: 'plop'
        }
      },
    }
  }
];