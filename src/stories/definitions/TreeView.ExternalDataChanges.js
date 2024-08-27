import TreeView from "../../components/TreeView.vue";
import { treeData, modelDefaults } from "../data/externalDataChangesTreeViewData";

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
  },
});

export const ExternalDataChanges = Template.bind({});
ExternalDataChanges.args = {
  modelValue: treeData,
  modelDefaults,
};

const docsSourceCode = `
<template>
  <TreeView v-model="tvModel" :model-defaults="modelDefaults" />
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import { treeData, modelDefaults } from "../data/basicTreeViewData";

const tvModel = ref(treeData);
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
