<template>
<div class="container">
    <h1>Radiobuttons Tree View Demo</h1>
    <div id="tree-view">
      <tree-view id="customtreeview" :initial-model="tvModel" ref="treeViewRef"></tree-view>
      <section class="checked-nodes">
        <button type="button" @click="refreshCheckedTvList">What's been checked?</button>
        <ul id="checkedList">
          <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.id }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";
import treeViewData from './radiobuttonsTreeViewData.js';

const tvModel = ref(treeViewData);
const checkedTvNodes = ref([]);
const treeViewRef = ref(null);

function refreshCheckedTvList() {
  checkedTvNodes.value = treeViewRef.value.getCheckedRadioButtons();
}

</script>

<style>
.checked-nodes {
  margin: 30px 0;
}
</style>