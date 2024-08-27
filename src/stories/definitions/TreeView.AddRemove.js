import TreeView from '../../components/TreeView.vue';
import { treeData, modelDefaults } from "../data/addRemoveTreeViewData";

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
  <TreeView v-model="tvModel" :model-defaults="modelDefaults" />
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import { treeData, modelDefaults } from "../data/addRemoveTreeViewData";

const tvModel = ref(treeData);

let addRemoveChildCounter = 0;
function addChildCallback(parentModel) {
  addRemoveChildCounter++;
  return Promise.resolve({
    id: \`child-node\${addRemoveChildCounter}\`,
    label: \`Added Child \${addRemoveChildCounter} from parent \${parentModel.data.id}\`,
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