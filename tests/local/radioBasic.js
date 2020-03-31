export default [
  {
    id: 'node1',
    label: 'My First Node',
    children: [],
    treeNodeSpec: {
      expandable: true,
      selectable: true,
      input: {
        type: 'radio',
        name: 'radio1',
        value: 'aValueToSubmit',
        isInitialRadioGroupValue: true
      },
      state: {
        expanded: false,
        selected: false
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
          expandable: true,
          selectable: true,
          input: {
            type: 'radio',
            name: 'radio2',
            isInitialRadioGroupValue: true
          },
          state: {
            expanded: false,
            selected: false
          }
        }
      },
      {
        id: 'subnode2',
        label: 'This is a checkable, checked subnode',
        children: [],
        treeNodeSpec: {
          expandable: true,
          selectable: true,
          input: {
            type: 'radio',
            name: 'radio2'
          },
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
        type: 'radio',
        name: 'radio1'
      },
      state: {
        expanded: true,
        selected: false
      }
    }
  }
];