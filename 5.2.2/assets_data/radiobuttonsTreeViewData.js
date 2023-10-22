export default [
  {
    id: 'radiobuttons-node1',
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
    id: 'radiobuttons-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'radiobuttons-subnode1',
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
        id: 'radiobuttons-subnode2',
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