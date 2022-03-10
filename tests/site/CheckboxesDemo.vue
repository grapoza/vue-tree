<template>
<div class="container">
    <h1>Checkboxes Tree View Demo</h1>
    <div id="tree-view">
      <tree-view id="customtreeview" :initial-model="tvModel" :model-defaults="modelDefaults" ref="treeViewRef"></tree-view>
      <section class="checked-nodes">
        <button type="button" @click="refreshCheckedTvList">What's been checked?</button>
        <ul id="checkedList">
          <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.id }}</li>
        </ul>
      </section>
    </div>

    <h1>Checkboxes Tree Grid Demo</h1>
    <div id="tree-grid">
      <tree-grid id="customtreegrid" :initial-model="tgModel" :model-defaults="modelDefaults" :columns="columns" :input-column-index="inputColumnIndex" ref="treeGridRef"></tree-grid>
      <section class="checked-nodes">
        <button type="button" @click="refreshCheckedTgList">What's been checked?</button>
        <ul id="checkedList">
          <li v-for="checkedNode in checkedTgNodes">{{ checkedNode.id }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Tree View Imports
import TreeView from "../../src/components/TreeView.vue";
import treeViewData from './checkboxesTreeViewData.js';

// Tree Grid Imports
import TreeGrid from "../../src/components/TreeGrid.vue";
import treeGridData from './checkboxesTreeGridData.js';

// Shared Data
const modelDefaults = ref({
  addChildTitle: 'Add a new child node',
  deleteTitle: 'Delete this node',
  expanderTitle: 'Expand this node'
});

// Tree View Data
const tvModel = ref(treeViewData);
const checkedTvNodes = ref([]);
const treeViewRef = ref(null);

function refreshCheckedTvList() {
  checkedTvNodes.value = treeViewRef.value.getCheckedCheckboxes();
}

// Tree Grid Data
const tgModel = ref(treeGridData);
const checkedTgNodes = ref([]);
const treeGridRef = ref(null);
const columns = ref([
  { id: 1, field: 'id', header: 'Node Id' },
  { id: 2, field: 'label', header: 'Node Label' },
]);
const inputColumnIndex = ref(1);

function refreshCheckedTgList() {
  checkedTgNodes.value = treeGridRef.value.getCheckedCheckboxes();
}

</script>

<style>
.checked-nodes {
  margin: 30px 0;
}
</style>