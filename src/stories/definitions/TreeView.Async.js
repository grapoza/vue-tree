import TreeView from '../../components/TreeView.vue';

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: '<tree-view v-bind="args" />'
});

export const Async = Template.bind({});
Async.args = {
  loadNodesAsync: loadNodesCallback,
  modelDefaults: { loadChildrenAsync: loadChildrenCallback },
};
let asyncChildCounter = 0;
async function loadNodesCallback() {
  return new Promise(resolve => setTimeout(resolve.bind(null, [{ id: 'async-rootNode', label: 'Root Node' }]), 1000));
}
async function loadChildrenCallback(parentModel) {
  asyncChildCounter++;
  let currentCounter = asyncChildCounter;
  return new Promise(resolve => setTimeout(resolve.bind(null, [{ id: `async-child-node${currentCounter}`, label: `Child ${currentCounter} from parent ${parentModel.id}` }]), 1000));
}

const docSourceCode = `
<template>
  <tree-view :load-nodes-async=""loadNodesCallback" :model-defaults="modelDefaults"></tree-view>
</template>
<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";

const modelDefaults = ref({ loadChildrenAsync: loadChildrenCallback });

let asyncChildCounter = 0;
async function loadNodesCallback() {
  return new Promise(resolve => setTimeout(resolve.bind(null, [{ id: 'async-rootNode', label: 'Root Node' }]), 1000));
}
async function loadChildrenCallback(parentModel) {
  asyncChildCounter++;
  let currentCounter = asyncChildCounter;
  return new Promise(resolve => setTimeout(resolve.bind(null, [{ id: \`async-child-node\${ currentCounter } \`, label: \`Child \${ currentCounter } from parent \${ parentModel.id }\` }]), 1000));
}

</script>`;

Async.parameters = {
  docs: {
    source: {
      code: docSourceCode,
      language: "html",
      type: "auto",
    },
  },
};