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
  <TreeView v-model="treeData" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: "customization-class-rootNode",
    label: "Root Node",
    children: [
      {
        id: "customization-class-subNode",
        label: "Subnode",
        children: [],
      },
    ],
  },
];

function modelDefaults(node) {
  const defaults = {
    addChildCallback,
    customizations: {
      classes: {
        treeViewNodeSelf: "large-line",
        treeViewNodeSelfText: "big-text",
      },
    },
  };

  if (node.id !== "customization-class-rootNode") {
    defaults.deletable = true;
  }

  return defaults;
}

let classChildCounter = 0;
async function addChildCallback(parentModel) {
  classChildCounter++;
  return Promise.resolve({
    id: \`customization-class-child-node\${classChildCounter}\`,
    label: \`Added Child \${classChildCounter} of \${parentModel.data.id}\`,
    children: [],
  });
}
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
