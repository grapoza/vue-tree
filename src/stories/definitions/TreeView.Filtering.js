import TreeView from '../../components/TreeView.vue';
import treeViewData from '../data/filteringTreeViewData';

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: `<span>
<tree-view v-bind="args" :filter-method="filterMethod" ref="treeViewRef"></tree-view>
<section style="margin: 10px 0">
  <input v-model="filterText" type='text' id="filter" placeholder="Filter by label text" style="margin-right: 4px" /><button @click="applyFilter">Apply Filter</button>
</section>
<section class="checked-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked (checkboxes and radiobuttons)?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.id }}</li>
  </ul>
</section>
</span>`,
  data() {
    return {
      checkedTvNodes: [],
      filterText: "",
      filterMethod: null
    }
  },
  methods: {
    applyFilter() {
      if (this.filterText === "") {
        this.filterMethod = null;
      }
      else {
        const lowercaseFilter = this.filterText.toLowerCase();
        this.filterMethod = (n) => n.label.toLowerCase().includes(lowercaseFilter);
      }
    },
    refreshCheckedTvList() {
      this.checkedTvNodes = [...this.$refs.treeViewRef.getCheckedCheckboxes(), ...this.$refs.treeViewRef.getCheckedRadioButtons()];
    }
  }
});

export const Filtering = Template.bind({});
Filtering.args = {
  initialModel: treeViewData,
};

const docsSourceCode = `
<template>
  <tree-view :initial-model="tvModel"></tree-view>
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import treeViewData from "../data/basicTreeViewData";

const tvModel = ref(treeViewData);
</script>`;

Filtering.parameters = {
  docs: {
    source: {
      code: docsSourceCode,
      language: "html",
      type: "auto",
    },
  },
};