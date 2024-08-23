import TreeView from '../../components/TreeView.vue';
import radiobuttonsTreeData from "../data/radiobuttonsTreeViewData";

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
<tree-view v-bind="args" ref="treeViewRef"></tree-view>
<section class="checked-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.id }}</li>
  </ul>
</section>
</span>`,
  methods: {
    refreshCheckedTvList() {
      this.checkedTvNodes = this.$refs.treeViewRef.getCheckedRadioButtons();
    },
  },
});

export const Radiobuttons = Template.bind({});
Radiobuttons.args = {
  modelValue: radiobuttonsTreeData,
  modelDefaults: {
    addChildTitle: 'Add a new child node',
    deleteTitle: 'Delete this node',
    expanderTitle: 'Expand this node'
  }
};

const docSourceCode = `
<template>
  <tree-view v-model="tvModel" :model-defaults="modelDefaults"></tree-view>
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import treeViewData from "../data/radiobuttonsTreeViewData";

const modelDefaults = ref({
  addChildTitle: 'Add a new child node',
  deleteTitle: 'Delete this node',
  expanderTitle: 'Expand this node'
});

const tvModel = ref(treeViewData);
</script>`;

Radiobuttons.parameters = {
  docs: {
    source: {
      code: docSourceCode,
      language: "html",
      type: "auto",
    },
  },
};