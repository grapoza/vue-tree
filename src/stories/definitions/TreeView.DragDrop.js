import TreeView from '../../components/TreeView.vue';
import dragDropTreeData from "../data/dragDropTreeViewData";

const dragDropTemplateHtml =
`<h2>Tree 1</h2>
<tree-view :initial-model="args.initialModel.tree1Data" :model-defaults="args.modelDefaults"></tree-view>
<h2>Tree 2</h2>
<tree-view :initial-model="args.initialModel.tree2Data" :model-defaults="args.modelDefaults"></tree-view>
<h2>Text Drop Target</h2>
<textarea style="width: 90%" rows="10"></textarea>`;

const Template = (args) => ({
    components: { TreeView },
    setup() {
        return { args };
    },
    template: dragDropTemplateHtml
});

export const DragDrop = Template.bind({});
DragDrop.args = {
  initialModel: dragDropTreeData,
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
  <tree-view :initial-model="tvModel.tree1Data" :model-defaults="modelDefaults"></tree-view>
  <h2>Tree 2</h2>
  <tree-view :initial-model="tvModel.tree2Data" :model-defaults="modelDefaults"></tree-view>
  <h2>Text Drop Target</h2>
  <textarea style="width: 90%" rows="10"></textarea>
</template>
<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";
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