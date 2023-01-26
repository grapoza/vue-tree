import TreeGrid from '../../components/TreeGrid.vue';
import TreeGridColumn from '../../components/TreeGridColumn.vue';
import TreeGridData from '../data/basicTreeGridData';

const Template = (args) => ({
  components: { TreeGrid, TreeGridColumn },
  setup() {
    return { args };
  },
  template: `
  <tree-grid v-bind="args">
    <tree-grid-column header-text="Item" value-property="description" :expander="true" style="width: 10rem"></tree-grid-column>
    <tree-grid-column header-text="Price" value-property="price" style="width: 4rem; text-align: end;"></tree-grid-column>
  </tree-grid>`
});

export const Basic = Template.bind({});
Basic.args = {
  initialModel: TreeGridData
};

const docsSourceCode = `
<template>
  <tree-grid :initial-model="tgModel">
    <tree-grid-column header-text="Item" value-property="description" :expander="true"></tree-grid-column>
    <tree-grid-column header-text="Price" value-property="price"></tree-grid-column>
  </tree-grid>
</template>
<script setup>
import { ref } from "vue";
import { TreeGrid } from "@grapoza/vue-tree";
import TreeGridData from "../data/basicTreeGridData";

const tgModel = ref(TreeGridData);
</script>`;

Basic.parameters = {
  docs: {
    source: {
      code: docsSourceCode,
      language: "html",
      type: "auto",
    },
  },
};