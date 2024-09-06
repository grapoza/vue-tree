export const treeData = [
  {
    id: 'selection-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'selection-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'selection-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'selection-subnode2',
        label: 'This is a checkable, checked subnode',
        children: [
          {
            id: 'subsubnode1',
            label: 'An even deeper node',
            children: [],
          }
        ],
      }
    ],
  },
  {
    id: 'selection-node3',
    label: 'My Third Node',
    children: [
      {
        id: 'subnode31',
        label: 'This is an expanded subnode',
        children: [],
      }
    ],
  }
];

export function modelDefaults(node) {
  switch (node.id) {
    case 'selection-node1':
      return {
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
        addChildCallback: function () {
          var entry = prompt("Give it a string.", "");
          return Promise.resolve(
            entry ? { id: entry, label: entry, deletable: true, selectable: true } : null
          );
        },
      };
    case 'selection-node2':
      return {
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
      };
    case 'selection-subnode1':
      return {
        title: "Even non-input nodes should get a title.",
        expandable: true,
        selectable: true,
        deletable: true,
        state: {
          expanded: false,
          selected: false,
        },
      };
    case 'selection-subnode2':
      return {
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
      };
    case 'subsubnode1':
      return {
        expandable: true,
        selectable: true,
        state: {
          expanded: false,
          selected: false,
        },
        addChildCallback: function () {
          var entry = prompt("Give it a string.", "");
          return Promise.resolve(
            entry ? { id: entry, label: entry, deletable: true, selectable: true } : null
          );
        },
      };
    case 'selection-node3':
      return {
        expandable: false,
        selectable: true,
        deletable: true,
        state: {
          expanded: true,
          selected: false,
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'subnode31':
      return {
        expandable: false,
        selectable: true,
        deletable: true,
        state: {
          expanded: false,
          selected: false,
        },
      };
  }
};