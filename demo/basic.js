export default [
  {
    id: 'node1',
    label: 'My First Node',
    children: [],
    expandable: true,
    checkable: true,
    selectable: true,
    state: {
      checked: false,
      expanded: false,
      selected: false
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
        expandable: true,
        checkable: false,
        selectable: true,
        state: {
          checked: false,
          expanded: false,
          selected: false
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
            expandable: true,
            checkable: false,
            selectable: true,
            state: {
              checked: false,
              expanded: false,
              selected: false
            }
          }
        ],
        expandable: true,
        checkable: true,
        selectable: true,
        state: {
          checked: true,
          expanded: false,
          selected: false
        }
      }
    ],
    expandable: true,
    checkable: true,
    selectable: true,
    state: {
      checked: false,
      expanded: false,
      selected: false
    }
  }
];