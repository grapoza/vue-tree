export default [
  {
    id: 'node1',
    label: 'My First Node',
    children: [],
    treeNodeSpec: {
      expandable: true,
      selectable: true,
      input: {
        type: 'checkbox',
        name: 'checkbox1'
      },
      state: {
        expanded: false,
        selected: false,
        input: {
          value: false,
          disabled: false
        }
      }
    }
  },
  {
    id: 'node2',
    label: 'My Second Node',
    children: [
      {
        id: 'subnode1',
        label: 'This is a subnode',
        children: [],
        treeNodeSpec: {
          title: 'You can add a title to a text node.',
          expandable: true,
          selectable: true,
          state: {
            expanded: false,
            selected: false
          }
        }
      },
      {
        id: 'subnode2',
        label: 'This is a checkable, checked subnode',
        children: [
          {
            id: 'subsubnode1',
            label: 'An even deeper node',
            children: [],
            treeNodeSpec: {
              expandable: true,
              selectable: true,
              state: {
                expanded: false,
                selected: false
              }
            }
          }
        ],
        treeNodeSpec: {
          expandable: true,
          selectable: true,
          input: {
            type: 'checkbox',
            name: 'checkbox3'
          },
          state: {
            expanded: false,
            selected: false,
            input: {
              value: true,
              disabled: true
            }
          }
        }
      }
    ],
    treeNodeSpec: {
      title: 'You can add a title to an input node.',
      expandable: true,
      selectable: true,
      input: {
        type: 'checkbox',
        name: 'checkbox2'
      },
      state: {
        expanded: true,
        selected: false,
        input: {
          value: false,
          disabled: false
        }
      }
    }
  }
];