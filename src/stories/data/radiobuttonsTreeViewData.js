export const treeData = [
  {
    id: 'radiobuttons-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'radiobuttons-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'radiobuttons-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'radiobuttons-subnode2',
        label: 'This is a checkable, checked subnode',
        children: [],
      }
    ],
  }
];

export function modelDefaults(node) {

  const baseDefaults = {
    addChildTitle: "Add a new child node",
    deleteTitle: "Delete this node",
    expanderTitle: "Expand this node",
  };

  switch (node.id) {
    case 'radiobuttons-node1':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "radio",
          name: "radio1",
          value: "aValueToSubmit",
          isInitialRadioGroupValue: true,
        },
        state: {
          expanded: false,
          selected: false,
        },
      });
    case 'radiobuttons-node2':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "radio",
          name: "radio1",
        },
        state: {
          expanded: true,
          selected: false,
        },
      });
    case 'radiobuttons-subnode1':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "radio",
          name: "radio2",
          isInitialRadioGroupValue: true,
        },
        state: {
          expanded: false,
          selected: false,
        },
      });
    case 'radiobuttons-subnode2':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "radio",
          name: "radio2",
        },
        state: {
          expanded: false,
          selected: false,
        },
      });
    default:
      return baseDefaults;
  }
}