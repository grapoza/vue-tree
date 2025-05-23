import TreeView from '../../components/TreeView.vue';
import { treeData, modelDefaults } from "../assets/data/addRemoveTreeViewData";

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

export const AddRemove = Template.bind({});

AddRemove.args = {
  modelValue: treeData,
  modelDefaults,
};

const docSourceCode = `
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: 'addremove-rootNode',
    label: 'Root Node',
    children: [],
  }
];

function modelDefaults(node) {
  const baseNodeSpec = {
    addChildCallback,
    deleteNodeCallback,
    state: {
      expanded: true,
    },
  };

  switch (node.id) {
    case 'addremove-rootNode':
      return baseNodeSpec;
    default:
      return Object.assign(baseNodeSpec, { deletable: true });
  }
};

let addRemoveChildCounter = 0;
function addChildCallback(parentModel) {
  addRemoveChildCounter++;
  return Promise.resolve({
    id: \`child-node\${addRemoveChildCounter}\`,
    label: \`Added Child \${addRemoveChildCounter} from parent \${parentModel.data.id}\`,
    children: [],
  });
}
function deleteNodeCallback(model) {
  return Promise.resolve(window.confirm(\`Delete node \${model.data.id}?\`));
}
</script>`;

AddRemove.parameters = {
  docs: {
    source: {
      code: docSourceCode,
      language: "html",
      type: "auto",
    },
  },
};