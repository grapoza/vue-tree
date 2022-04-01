import TreeView from '../../components/TreeView.vue';
import treeViewData from '../data/basicTreeViewData';

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: `<tree-view v-bind="args" ref="treeViewRef"></tree-view>
<section class="checked-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked (checkboxes and radiobuttons)?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.id }}</li>
  </ul>
</section>`,
  data() {
    return {
      checkedTvNodes: []
    }
  },
  methods: {
    refreshCheckedTvList() {
      this.checkedTvNodes = [...this.$refs.treeViewRef.getCheckedCheckboxes(), ...this.$refs.treeViewRef.getCheckedRadioButtons()];
    }
  }
});

export const Basic = Template.bind({});
Basic.args = {
  initialModel: treeViewData
};

const docsSourceCode = `
<template>
  <tree-view :initial-model="tvModel"></tree-view>
</template>
<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";
import treeViewData from "../data/basicTreeViewData";

const tvModel = ref(treeViewData);
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