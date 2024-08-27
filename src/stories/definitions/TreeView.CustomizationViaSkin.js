import TreeView from "../../components/TreeView.vue";
import { treeData, modelDefaults } from "../data/customizationViaSkinTreeViewData";

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
    };
  },
  template: '<TreeView v-bind="argsWithoutValue" v-model="modelValue" />',
});

export const CustomizationViaSkin = Template.bind({});
CustomizationViaSkin.args = {
  modelValue: treeData,
  skinClass: "grayscale",
  modelDefaults,
};

const docSkinSourceCode = `
<template>
  <TreeView v-model="tvModel" :model-defaults="modelDefaults" :skin-class="skinClass" />
</template>
<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";
import { treeData, modelDefaults } from "../data/customizationViaSkinTreeViewData";

const tvModel = ref(treeData);
const skinClass - ref("grayscale");
</script>`;

CustomizationViaSkin.parameters = {
  docs: {
    source: {
      code: docSkinSourceCode,
      language: "html",
      type: "auto",
    },
  },
};
