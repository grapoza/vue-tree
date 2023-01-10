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
    <tree-grid-column header-text="Item" value-property="description"></tree-grid-column>
    <tree-grid-column header-text="Price" value-property="price"></tree-grid-column>
  </tree-grid>`
});

export const Basic = Template.bind({});
Basic.args = {
  expanderColumnIndex: 1,
  initialModel: TreeGridData
};

// const docsSourceCode = `
// <template>
//   <tree-view :initial-model="tvModel"></tree-view>
// </template>
// <script setup>
// import { ref } from "vue";
// import { TreeGrid } from "@grapoza/vue-tree";
// import TreeGridData from "../data/basicTreeGridData";

// const tvModel = ref(TreeGridData);
// </script>`;

// Basic.parameters = {
//   docs: {
//     source: {
//       code: docsSourceCode,
//       language: "html",
//       type: "auto",
//     },
//   },
// };