import TreeView from "../../components/TreeView.vue";
import { treeData, modelDefaults } from "../assets/data/externalDataChangesTreeViewData";

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  data() {
    let { modelValue, ...rest } = args;
    return {
      argsWithoutValue: rest,
      modelValue,
      checkedTvNodes: [],
    };
  },
  template: `<span>
<TreeView v-bind="argsWithoutValue" v-model="modelValue" ref="treeViewRef" />
<section style="display: flex; flex-direction: column; gap: 4px; width: fit-content; margin-top: 16px;">
  <button type="button" @click="addNode">Add a node to the end of the model</button>
  <button type="button" @click="addChildNode" :disabled="modelValue.length === 0">Add a child node to the end of the first node's model</button>
  <button type="button" @click="removeNode" :disabled="modelValue.length === 0">Remove the first node from the model</button>
  <button type="button" @click="removeFocusableNode">Remove the focused node from the model</button>
  <button type="button" @click="swapNodes" :disabled="modelValue.length < 2">Swap the first two nodes in the model</button>
  <button type="button" @click="toggleCheckNode">Toggle the first checkbox in the meta model</button>
</section>
</span>`,
  methods: {
    addNode() {
      const newId = crypto.randomUUID();
      this.modelValue.push({
        id: "external-changes-node-" + newId,
        label: "A random node - " + newId,
        children: [],
      });
    },
    addChildNode() {
      const newId = crypto.randomUUID();
      this.modelValue[0].children.push({
        id: "external-changes-subnode-" + newId,
        label: "A random subnode - " + newId,
        children: [],
      });
    },
    removeFocusableNode() {
      const focusedNode = this.$refs.treeViewRef.getMatching((n) => n.focusable)[0];

      if (!focusedNode) {
        return;
      }

      // Remove at the root
      if (this.modelValue.some((n) => focusedNode.data.id === n.id)) {
        this.modelValue.splice(this.modelValue.findIndex((n) => focusedNode.data.id === n.id), 1);
      }
      else {
        // Remove from children
        this.traverseTree((n) => {
          if (n.children.some(n => focusedNode.data.id === n.id)) {
            n.children.splice(n.children.findIndex(n => focusedNode.data.id === n.id), 1);
            return false;
          }
        });
      }
    },
    removeNode() {
      this.modelValue.shift();
    },
    swapNodes() {
      [this.modelValue[0], this.modelValue[1]] = [this.modelValue[1], this.modelValue[0]];
    },
    toggleCheckNode() {
      const checkNode = this.$refs.treeViewRef.metaModel.find((n) => n.input?.type === "checkbox");
      if (checkNode) {
        checkNode.state.input.value = !checkNode.state.input.value;
      }
    },
    traverseTree(nodeActionCallback) {
      let nodeQueue = this.modelValue.slice();
      let continueCallbacks = true;

      while (nodeQueue.length > 0 && continueCallbacks !== false) {
        const current = nodeQueue.shift();
        const children = current.children ?? [];
        nodeQueue = children.concat(nodeQueue);
        continueCallbacks = nodeActionCallback(current) ?? true;
      }
    }
  },
});

export const ExternalDataChanges = Template.bind({});
ExternalDataChanges.args = {
  modelValue: treeData,
  modelDefaults,
};

const docsSourceCode = `
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
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

function modelDefaults(node) {
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
</script>`;

ExternalDataChanges.parameters = {
  docs: {
    source: {
      code: docsSourceCode,
      language: "html",
      type: "auto",
    },
  },
};
