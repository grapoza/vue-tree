export default [
  {
    id: 'node1',
    label: 'My First Node',
    expandable: true,
    selectable: true,
    input: {
      type: 'radio',
      name: 'radio1',
      value: 'aValueToSubmit'
    },
    state: {
      expanded: false,
      selected: false
    },
    children: []
  },
  {
    id: 'node2',
    label: 'My Second Node',
    expandable: true,
    selectable: true,
    input: {
      type: 'radio',
      name: 'radio1'
    },
    state: {
      expanded: true,
      selected: false
    },
    children: [
      {
        id: 'subnode1',
        label: 'This is a subnode',
        expandable: true,
        selectable: true,
        input: {
          type: 'radio',
          name: 'radio2'
        },
        state: {
          expanded: false,
          selected: false
        },
        children: []
      },
      {
        id: 'subnode2',
        label: 'This is a checkable, checked subnode',
        expandable: true,
        selectable: true,
        input: {
          type: 'radio',
          name: 'radio2'
        },
        state: {
          expanded: false,
          selected: false
        },
        children: []
      }
    ]
  }
];