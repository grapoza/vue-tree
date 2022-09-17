import TreeView from '../../components/TreeView.vue';
import checkboxTreeData from "../data/checkboxesTreeViewData";

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: `<span>
<tree-view v-bind="args" ref="treeViewRef"></tree-view>
<section class="checked-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.id }}</li>
  </ul>
</section>
</span>`,
  data() {
    return {
      checkedTvNodes: []
    }
  },
  methods: {
    refreshCheckedTvList() {
      this.checkedTvNodes = this.$refs.treeViewRef.getCheckedCheckboxes();
    }
  }
});

export const Checkboxes = Template.bind({});
Checkboxes.args = {
  initialModel: checkboxTreeData,
  modelDefaults: {
    addChildTitle: 'Add a new child node',
    deleteTitle: 'Delete this node',
    expanderTitle: 'Expand this node'
  }
};

const docSourceCode = `
<template>
  <tree-view :initial-model="tvModel" :model-defaults="modelDefaults"></tree-view>
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import treeViewData from "../data/checkboxesTreeViewData";

const modelDefaults = ref({
  addChildTitle: 'Add a new child node',
  deleteTitle: 'Delete this node',
  expanderTitle: 'Expand this node'
});

const tvModel = ref(treeViewData);
</script>`;

Checkboxes.parameters = {
  docs: {
    source: {
      code: docSourceCode,
      language: "html",
      type: "auto",
    },
  },
};