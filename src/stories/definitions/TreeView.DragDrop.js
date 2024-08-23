import TreeView from '../../components/TreeView.vue';
import dragDropTreeData from "../data/dragDropTreeViewData";

const dragDropTemplateHtml = `<span>
<h2>Tree 1</h2>
<tree-view v-model="modelValue1" :model-defaults="args.modelDefaults"></tree-view>
<h2>Tree 2</h2>
<tree-view v-model="modelValue2" :model-defaults="args.modelDefaults"></tree-view>
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
  modelValue1: dragDropTreeData.tree1Data,
  modelValue2: dragDropTreeData.tree2Data,
  modelDefaults: {
    expanderTitle: 'Expand this node',
    draggable: true,
    allowDrop: true,
    state: {
      expanded: true
    }
  }
};

const docSourceCode = `
<template>
  <h2>Tree 1</h2>
  <tree-view v-model="tvModel.tree1Data" :model-defaults="modelDefaults"></tree-view>
  <h2>Tree 2</h2>
  <tree-view v-model="tvModel.tree2Data" :model-defaults="modelDefaults"></tree-view>
  <h2>Text Drop Target</h2>
  <textarea style="width: 90%" rows="10"></textarea>
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import treeViewData from "../data/checkboxesTreeViewData";

const modelDefaults = ref({
  expanderTitle: 'Expand this node',
  draggable: true,
  allowDrop: true,
  state: {
    expanded: true
  }
});

const tvModel = ref(treeViewData);
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