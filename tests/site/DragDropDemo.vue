<template>
<div class="container">
    <h1>Add/Remove Tree View Demo</h1>
    <div id="tree-view">
      <h2>Tree 1</h2>
      <tree-view id="customtreeview" :initial-model="tvModel1" :model-defaults="modelDefaults" ref="treeViewRef1"></tree-view>
      <h2>Tree 2</h2>
      <tree-view id="customtreeview" :initial-model="tvModel2" :model-defaults="modelDefaults" ref="treeViewRef2"></tree-view>
      <h2>Text Drop Target</h2>
      <textarea class="drop-text-area" rows="10"></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";
import treeViewData from './dragDropTreeViewData.js';

const tvModel1 = ref(treeViewData.tree1Data);
const tvModel2 = ref(treeViewData.tree2Data);
const modelDefaults = ref({
  expanderTitle: 'Expand this node',
  draggable: true,
  allowDrop: true,
  state: {
    expanded: true
  }
});

</script>

<style>
.drop-text-area {
  width: 90%;
}
</style>