export const treeData = [
  {
    id: "external-changes-node1",
    label: "My First Node",
    children: [],
  },
  {
    id: "external-changes-node2",
    label: "My Second Node",
    children: [
      {
        id: "external-changes-subnode1",
        label: "This is a subnode",
        children: [],
      },
      {
        id: "external-changes-subnode2",
        label: "Another Subnode",
        children: [],
      },
      {
        id: "external-changes-subnode3",
        label: "This is a disabled, checked subnode",
        children: [
          {
            id: "external-changes-subsubnode1",
            label: "An even deeper node",
            children: [],
          },
        ],
      },
    ],
  },
];

export function modelDefaults(node) {
  switch (node.id) {
    case "external-changes-node1":
      return {};
    case "external-changes-node2":
      return {
        title: "My node, and its fantastic title",
        input: {
          type: "checkbox",
          name: "checkbox1",
        },
        state: {
          expanded: true,
        },
      };
    case "external-changes-subnode1":
      return {
        input: {
          type: "radio",
          name: "radio1",
          isInitialRadioGroupValue: true,
        },
      };
    case "external-changes-subnode2":
      return {
        input: {
          type: "radio",
          name: "radio1",
        },
      };
    case "external-changes-subnode3":
      return {
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          input: {
            value: true,
            disabled: true,
          },
        },
      };
    case "external-changes-subsubnode1":
      return {};
    default:
      return {
        input: {
          type: "checkbox",
          name: "checkbox" + crypto.randomUUID(),
        },
        state: {
          input: {
            value: false,
          },
        },
      };
  }
}
