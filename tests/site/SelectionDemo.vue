<template>
<div class="container">
    <h1>Selection Tree View Demo</h1>
    <div id="tree-view">
      <label for="modeSelect">Selection Mode</label>
      <select v-model="selectionMode" id="modeSelect" style="margin-bottom: 2rem;">
        <option value="single">Single</option>
        <option value="selectionFollowsFocus">Selection Follows Focus</option>
        <option value="multiple">Multiple</option>
        <option value="">No Selection</option>
      </select>
      <tree-view id="customtreeview" :initial-model="tvModel" :model-defaults="modelDefaults" :selection-mode="normalizedSelectionMode" ref="treeViewRef"></tree-view>
      <section class="selected-nodes">
        <button type="button" @click="refreshSelectedList">What's selected?</button>
        <ul id="selectedList">
          <li v-for="selectedNode in selectedNodes">{{ selectedNode.id }}</li>
        </ul>
    </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TreeView from "../../src/components/TreeView.vue";
import treeViewData from './selectionTreeViewData.js';

const tvModel = ref(treeViewData);
const modelDefaults = ref({
  addChildTitle: 'Add a new child node',
  deleteTitle: 'Delete this node',
  expanderTitle: 'Expand this node'
});
const selectionMode = ref('single');
const selectedNodes = ref([]);
const normalizedSelectionMode = computed(() => selectionMode.value === '' ? null : selectionMode.value);
const treeViewRef = ref(null);

function refreshSelectedList() {
  selectedNodes.value = treeViewRef.value.getSelected();
}

</script>

<style>
#modeSelect {
  margin-left: 1rem;
}

.selected-nodes {
  margin: 30px 0;
}
</style>