<template>
<div class="container">
    <h1>Async Tree View Demo</h1>
    <div id="tree-view">
      <tree-view id="customtreeview" :load-nodes-async="loadNodesAsync" :model-defaults="modelDefaults" ref="treeViewRef"></tree-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";
import treeViewData from './addRemoveTreeViewData.js';

const tvModel = ref(treeViewData);
const modelDefaults = ref({
  loadChildrenAsync: loadChildrenCallback,
  deletable: true
});
const childCounter = ref(0);

async function loadNodesAsync() {
  return new Promise(resolve => setTimeout(resolve.bind(null, [{ id: 'rootNode', label: 'Root Node', treeNodeSpec: { deletable: false } } ]), 1000));
}

async function loadChildrenCallback(parentModel) {
  childCounter.value++;
  let currentCounter = childCounter.value;
  return new Promise(resolve => setTimeout(resolve.bind(null, [{ id: `child-node${currentCounter}`, label: `Child ${currentCounter}` }]), 1000));
}

</script>