export const treeData = [
  {
    id: 'checkboxes-tg-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'checkboxes-tg-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'checkboxes-tg-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'checkboxes-tg-subnode2',
        label: 'This is a disabled, checked subnode',
        children: [
          {
            id: 'checkboxes-tg-subsubnode1',
            label: 'An even deeper node',
            children: [],
          }
        ],
      }
    ],
  }
];

export function modelDefaults(node) {

  const baseDefaults = {
    addChildTitle: 'Add a new child node',
    deleteTitle: 'Delete this node',
    expanderTitle: 'Expand this node',
  };

  switch (node.id) {
    case 'checkboxes-tg-node1':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        deletable: true,
        input: {
          type: "checkbox",
          name: "checkbox1",
        },
        state: {
          expanded: false,
          selected: false,
          input: {
            value: false,
            disabled: false,
          },
        },
      });
    case 'checkboxes-tg-node2':
      return Object.assign(baseDefaults, {
        title: "My second node, and its fantastic title",
        expandable: true,
        selectable: true,
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          expanded: true,
          selected: false,
          input: {
            value: false,
            disabled: false,
          },
        },
      });
    case 'checkboxes-tg-subnode1':
      return Object.assign(baseDefaults, {
        title: "Even non-input nodes should get a title.",
        expandable: true,
        selectable: true,
        deletable: true,
        state: {
          expanded: false,
          selected: false,
        },
      });
    case 'checkboxes-tg-subnode2':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "checkbox",
          name: "checkbox3",
        },
        state: {
          expanded: false,
          selected: false,
          input: {
            value: true,
            disabled: true,
          },
        },
      });
    case 'checkboxes-tg-subsubnode1':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        state: {
          expanded: false,
          selected: false,
        },
        addChildCallback: function () {
          var entry = prompt("Give it a string.", "");
          return Promise.resolve(
            entry
              ? { id: "checkboxes-tg-c-" + entry, label: entry, deletable: true, selectable: true }
              : null
          );
        },
      });
    default:
      return baseDefaults;
  }
};