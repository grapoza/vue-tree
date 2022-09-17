import TreeView from '../../components/TreeView.vue';
import treeViewData from '../data/staticTreeViewData';

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: '<tree-view v-bind="args" />'
});

export const Static = Template.bind({});
Static.args = {
  initialModel: treeViewData,
  modelDefaults: {
    expandable: false,
    state: {
      expanded: true,
    }
  }
};

const docsSourceCode = `
<template>
  <tree-view :initial-model="tvModel" :model-defaults="modelDefaults"></tree-view>
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import treeViewData from "../data/staticTreeViewData";

const modelDefaults = ref({
  addChildTitle: 'Add a new child node',
  deleteTitle: 'Delete this node',
  expanderTitle: 'Expand this node'
});

const tvModel = ref(treeViewData);
</script>`;

Static.parameters = {
  docs: {
    source: {
      code: docsSourceCode,
      language: "html",
      type: "auto",
    },
  },
};