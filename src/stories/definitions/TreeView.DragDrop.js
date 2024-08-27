import TreeView from '../../components/TreeView.vue';
import { tree1Data, tree2Data, modelDefaults } from "../data/dragDropTreeViewData";

const dragDropTemplateHtml = `<span>
<h2>Tree 1</h2>
<TreeView v-model="modelValue1" :model-defaults="args.modelDefaults" />
<h2>Tree 2</h2>
<TreeView v-model="modelValue2" :model-defaults="args.modelDefaults" />
<h2>Text Drop Target</h2>
<textarea style="width: 90%" rows="10"></textarea>
</span>`;

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: dragDropTemplateHtml,
  data() {
    return {
      modelValue1: args.modelValue1,
      modelValue2: args.modelValue2,
    };
  },
});

export const DragDrop = Template.bind({});
DragDrop.args = {
  modelValue1: tree1Data,
  modelValue2: tree2Data,
  modelDefaults,
};

const docSourceCode = `
<template>
  <h2>Tree 1</h2>
  <TreeView v-model="tv1Model" :model-defaults="modelDefaults" />
  <h2>Tree 2</h2>
  <TreeView v-model="tv2Model" :model-defaults="modelDefaults" />
  <h2>Text Drop Target</h2>
  <textarea style="width: 90%" rows="10"></textarea>
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import { tree1Data, tree2Data, modelDefaults } from "../data/dragDropTreeViewData";

const tv1Model = ref(tree1Data);
const tv2Model = ref(tree2Data);
</script>`;

DragDrop.parameters = {
  docs: {
    source: {
      code: docSourceCode,
      language: "html",
      type: "auto",
    },
  },
};