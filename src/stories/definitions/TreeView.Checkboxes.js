import TreeView from '../../components/TreeView.vue';
import { treeData, modelDefaults } from "../data/checkboxesTreeViewData";

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
<section class="checked-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.data.id }}</li>
  </ul>
</section>
</span>`,
  methods: {
    refreshCheckedTvList() {
      this.checkedTvNodes = this.$refs.treeViewRef.getCheckedCheckboxes();
    },
  },
});

export const Checkboxes = Template.bind({});
Checkboxes.args = {
  modelValue: treeData,
  modelDefaults,
};

const docSourceCode = `
<template>
  <TreeView v-model="tvModel" :model-defaults="modelDefaults" />
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import { treeData, modeLDefaults } from "../data/checkboxesTreeViewData";

const tvModel = ref(treeData);
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