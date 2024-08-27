import TreeView from '../../components/TreeView.vue';
import { treeData, modelDefaults } from '../data/basicTreeViewData';

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
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked (checkboxes and radiobuttons)?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.data.id }}</li>
  </ul>
</section>
</span>`,
  methods: {
    refreshCheckedTvList() {
      this.checkedTvNodes = [
        ...this.$refs.treeViewRef.getCheckedCheckboxes(),
        ...this.$refs.treeViewRef.getCheckedRadioButtons(),
      ];
    },
  },
});

export const Basic = Template.bind({});
Basic.args = {
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

Basic.parameters = {
  docs: {
    source: {
      code: docsSourceCode,
      language: "html",
      type: "auto",
    },
  },
};