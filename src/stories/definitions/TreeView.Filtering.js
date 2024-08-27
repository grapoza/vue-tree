import TreeView from '../../components/TreeView.vue';
import { treeData, modelDefaults } from '../data/filteringTreeViewData';

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
      filterText: "",
      filterMethod: null,
    };
  },
  template: `<span>
<TreeView v-bind="argsWithoutValue" v-model="modelValue" :filter-method="filterMethod" ref="treeViewRef" />
<section style="margin: 10px 0">
  <input v-model="filterText" type='text' id="filter" placeholder="Filter by label text" style="margin-right: 4px" /><button @click="applyFilter">Apply Filter</button>
</section>
<section class="checked-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked (checkboxes and radiobuttons)?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.data.id }}</li>
  </ul>
</section>
</span>`,
  methods: {
    applyFilter() {
      if (this.filterText === "") {
        this.filterMethod = null;
      } else {
        const lowercaseFilter = this.filterText.toLowerCase();
        this.filterMethod = (n) => n.data.label.toLowerCase().includes(lowercaseFilter);
      }
    },
    refreshCheckedTvList() {
      this.checkedTvNodes = [
        ...this.$refs.treeViewRef.getCheckedCheckboxes(),
        ...this.$refs.treeViewRef.getCheckedRadioButtons(),
      ];
    },
  },
});

export const Filtering = Template.bind({});
Filtering.args = {
  modelValue: treeData,
  modelDefaults,
};

const docsSourceCode = `
<template>
  <span>
    <TreeView v-model="tvModel" :model-defaults="modelDefaults" :filter-method="filterMethod" />
    <section style="margin: 10px 0">
      <input v-model="filterText" type='text' id="filter" placeholder="Filter by label text" style="margin-right: 4px" /><button @click="applyFilter">Apply Filter</button>
    </section>
  </span>
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import { treeData, modelDefaults } from '../data/filteringTreeViewData';

const tvModel = ref(treeData);
const filterText = ref("");
const filterMethod = ref(null);

const applyFilter = () => {
  if (filterText.value === "") {
    filterMethod.value = null;
  }
  else {
    const lowercaseFilter = filterText.value.toLowerCase();
    filterMethod.value = (n) => n.data.label.toLowerCase().includes(lowercaseFilter);
  }
}
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