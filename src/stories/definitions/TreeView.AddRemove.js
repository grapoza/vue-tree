import TreeView from '../../components/TreeView.vue';
import addRemoveTreeData from "../data/addRemoveTreeViewData";

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: '<tree-view v-bind="args" />'
});

export const AddRemove = Template.bind({});

AddRemove.args = {
  initialModel: addRemoveTreeData,
  modelDefaults: { addChildCallback: addChildCallback },
};
let addRemoveChildCounter = 0;
function addChildCallback(parentModel) {
  addRemoveChildCounter++;
  return Promise.resolve({ id: `child-node${addRemoveChildCounter}`, label: `Added Child ${addRemoveChildCounter} from parent ${parentModel.id}`, treeNodeSpec: { deletable: true, state: { expanded: true } } });
}

const docSourceCode = `
<template>
  <tree-view :initial-model="tvModel" :model-defaults="modelDefaults"></tree-view>
</template>
<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";
import addRemoveTreeData from "../data/addRemoveTreeViewData";

const modelDefaults = ref({ addChildCallback: addChildCallback });

const tvModel = ref(addRemoveTreeData);

let addRemoveChildCounter = 0;
function addChildCallback(parentModel) {
  addRemoveChildCounter++;
  return Promise.resolve({
    id: \`child- node\${ addRemoveChildCounter }\`,
    label: \`Added Child \${ addRemoveChildCounter } from parent \${ parentModel.id }\`,
    treeNodeSpec: { deletable: true, state: { expanded: true } }
  });
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