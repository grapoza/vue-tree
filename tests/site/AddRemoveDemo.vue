<template>
<div class="container">
    <h1>Add/Remove Tree View Demo</h1>
    <div id="tree-view">
      <tree-view id="customtreeview" :initial-model="tvModel" :model-defaults="modelDefaults" ref="treeViewRef"></tree-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";
import treeViewData from './addRemoveTreeViewData.js';

const tvModel = ref(treeViewData);
const modelDefaults = ref({
    addChildCallback: addChildCallback
});
const childCounter = ref(0);

function addChildCallback (parentModel) {
  childCounter.value++;
  return Promise.resolve({ id: `child-node${childCounter.value}`, label: `Added Child ${childCounter.value}`, treeNodeSpec: { deletable: true } });
}

</script>