export default [
  {
    id: 'node1',
    label: 'My First Node',
    expandable: true,
    checkable: true,
    selectable: true,
    state: {
      checked: false,
      expanded: false,
      selected: false
    },
    children: []
  },
  {
    id: 'node2',
    label: 'My Second Node',
    expandable: true,
    checkable: true,
    selectable: true,
    state: {
      checked: false,
      expanded: true,
      selected: false
    },
    children: [
      {
        id: 'subnode1',
        label: 'This is a subnode',
        expandable: true,
        checkable: false,
        selectable: true,
        state: {
          checked: false,
          expanded: false,
          selected: false
        },
        children: []
      },
      {
        id: 'subnode2',
        label: 'This is a checkable, checked subnode',
        expandable: true,
        checkable: true,
        selectable: true,
        state: {
          checked: true,
          expanded: false,
          selected: false
        },
        children: [
          {
            id: 'subsubnode1',
            label: 'An even deeper node',
            children: [],
            expandable: true,
            checkable: false,
            selectable: true,
            state: {
              checked: false,
              expanded: false,
              selected: false
            }
          }
        ]
      }
    ]
  }
];