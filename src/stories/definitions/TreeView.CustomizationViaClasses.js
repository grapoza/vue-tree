import TreeView from "../../components/TreeView.vue";
import { treeData, modelDefaults } from "../data/customizationViaClassesTreeViewData";

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

export const CustomizationViaClasses = Template.bind({});
CustomizationViaClasses.args = {
  modelValue: treeData,
  modelDefaults,
};

const docClassSourceCode = `
<template>
  <TreeView v-model="tvModel" :model-defaults="modelDefaults" />
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import { treeData, modeLDefaults } from "../data/customizationViaClassesTreeViewData";

const tvModel = ref(treeData);
</script>`;

CustomizationViaClasses.parameters = {
  docs: {
    source: {
      code: docClassSourceCode,
      language: "html",
      type: "auto",
    },
  },
};
