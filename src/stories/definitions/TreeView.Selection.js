import TreeView from '../../components/TreeView.vue';
import selectionTreeData from "../data/selectionTreeViewData";

const selectionTemplateHtml =
`<label for="modeSelect">Selection Mode</label>
<select v-model="selectionMode" id="modeSelect" style="margin: 0 0 2rem 1rem;">
  <option value="single">Single</option>
  <option value="selectionFollowsFocus">Selection Follows Focus</option>
  <option value="multiple">Multiple</option>
  <option value="">No Selection</option>
</select>
<tree-view v-bind="args" :selection-mode="normalizedSelectionMode" ref="treeViewRef"></tree-view>
<section class="selected-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshSelectedList">What's selected?</button>
  <ul id="selectedList">
    <li v-for="selectedNode in selectedNodes">{{ selectedNode.id }}</li>
  </ul>
</section>`;

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: selectionTemplateHtml,
  data() {
    return {
      selectionMode: 'single',
      selectedNodes: []
    }
  },
  computed: {
    normalizedSelectionMode() {
      return this.selectionMode === '' ? null : this.selectionMode;
    }
  },
  methods: {
    refreshSelectedList() {
      this.selectedNodes = this.$refs.treeViewRef.getSelected();
    }
  }
});

export const Selection = Template.bind({});
Selection.args = {
  initialModel: selectionTreeData,
  selectionMode: "single",
};

const docSourceCode = `
<template>
  <tree-view :initial-model="tvModel" :selection-mode="single"></tree-view>
</template>
<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";
import treeViewData from "../data/selectionTreeViewData";

const tvModel = ref(treeViewData);
</script>`;

Selection.parameters = {
  docs: {
    source: {
      code: docSourceCode,
      language: "html",
      type: "auto",
    },
  },
};