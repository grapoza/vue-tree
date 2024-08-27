import TreeView from '../../components/TreeView.vue';
import { treeData, modelDefaults } from "../data/selectionTreeViewData";

const selectionTemplateHtml = `<span>
<label for="modeSelect">Selection Mode</label>
<select v-model="selectionMode" id="modeSelect" style="margin: 0 0 2rem 1rem;">
  <option value="single">Single</option>
  <option value="selectionFollowsFocus">Selection Follows Focus</option>
  <option value="multiple">Multiple</option>
  <option value="">No Selection</option>
</select>
<TreeView v-bind="argsWithoutValue" v-model="modelValue" :selection-mode="normalizedSelectionMode" ref="treeViewRef" />
<section class="selected-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshSelectedList">What's selected?</button>
  <ul id="selectedList">
    <li v-for="selectedNode in selectedNodes">{{ selectedNode.data.id }}</li>
  </ul>
</section>
</span>`;

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: selectionTemplateHtml,
  data() {
    let { modelValue, ...rest } = args;
    return {
      argsWithoutValue: rest,
      modelValue,
      selectionMode: "single",
      selectedNodes: [],
    };
  },
  computed: {
    normalizedSelectionMode() {
      return this.selectionMode === "" ? null : this.selectionMode;
    },
  },
  methods: {
    refreshSelectedList() {
      this.selectedNodes = this.$refs.treeViewRef.getSelected();
    },
  },
});

export const Selection = Template.bind({});
Selection.args = {
  modelValue: treeData,
  modelDefaults,
  selectionMode: "single",
};

const docSourceCode = `
<template>
  <TreeView v-model="tvModel" :model-defaults="modelDefaults" selection-mode="single" />
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import { treeData, modelDefaults } from "../data/selectionTreeViewData";

const tvModel = ref(treeData);
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