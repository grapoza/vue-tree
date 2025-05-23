export const treeData = [
  {
    id: 'checkboxes-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'checkboxes-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'checkboxes-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'checkboxes-subnode2',
        label: 'This is a disabled, checked subnode',
        children: [
          {
            id: 'checkboxes-subsubnode1',
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
    case 'checkboxes-node1':
      return Object.assign(baseDefaults, {
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
        }
      });
    case 'checkboxes-node2':
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
    case 'checkboxes-subnode1':
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
    case 'checkboxes-subnode2':
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
    case 'checkboxes-subsubnode1':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        state: {
          expanded: false,
          selected: false,
        },
        addChildCallback: function () {
          const entry = prompt("Give it a string.", "");
          return Promise.resolve(
            entry ? { id: entry, label: entry, deletable: true, selectable: true } : null
          );
        },
      });
    default:
      return baseDefaults;
  }
}