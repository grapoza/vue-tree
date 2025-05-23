import TreeView from "../../components/TreeView.vue";
import { treeData, modelDefaults } from "../assets/data/customizationViaSkinTreeViewData";

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
  <TreeView v-model="treeData" :model-defaults="modelDefaults" :skin-class="skinClass" />
</template>
<script setup>
import TreeView from "../../src/components/TreeView.vue";

const skinClass = "grayscale";

const treeData = [
  {
    id: "customization-skin-rootNode",
    label: "Root Node",
    children: [
      {
        id: "customization-skin-subNode",
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
        treeViewNodeSelfExpander: "action-button",
        treeViewNodeSelfExpandedIndicator: "fas fa-chevron-right",
        treeViewNodeSelfAction: "action-button",
        treeViewNodeSelfAddChildIcon: "fas fa-plus-circle",
        treeViewNodeSelfDeleteIcon: "fas fa-minus-circle",
      },
    },
  };

  if (node.id !== "customization-skin-rootNode") {
    defaults.deletable = true;
  }

  return defaults;
}

let skinChildCounter = 0;
async function addChildCallback(parentModel) {
  skinChildCounter++;
  return Promise.resolve({
    id: \`customization-skin-child-node\${this.childCounter}\`,
    label: \`Added Child \${this.childCounter} of \${parentModel.data.id}\`,
    children: [],
  });
}
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
