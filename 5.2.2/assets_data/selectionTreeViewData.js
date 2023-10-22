export default [
  {
    id: 'selection-node1',
    label: 'My First Node',
    children: [],
    treeNodeSpec: {
      expandable: true,
      selectable: true,
      deletable: true,
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
      },
      addChildCallback: function () {
        var entry = prompt("Give it a string.", "");
        return Promise.resolve(entry ? { id: entry, label: entry, deletable: true, selectable: true } : null);
      }
    }
  },
  {
    id: 'selection-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'selection-subnode1',
        label: 'This is a subnode',
        children: [],
        treeNodeSpec: {
          title: 'Even non-input nodes should get a title.',
          expandable: true,
          selectable: true,
          deletable: true,
          state: {
            expanded: false,
            selected: false
          }
        }
      },
      {
        id: 'selection-subnode2',
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
              },
              addChildCallback: function () {
                var entry = prompt("Give it a string.", "");
                return Promise.resolve(entry ? { id: entry, label: entry, deletable: true, selectable: true } : null);
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
      title: 'My second node, and its fantastic title',
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
  },
  {
    id: 'selection-node3',
    label: 'My Third Node',
    children: [
      {
        id: 'subnode31',
        label: 'This is an expanded subnode',
        children: [],
        treeNodeSpec: {
          expandable: false,
          selectable: true,
          deletable: true,
          state: {
            expanded: false,
            selected: false
          }
        }
      }
    ],
    treeNodeSpec: {
      expandable: false,
      selectable: true,
      deletable: true,
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