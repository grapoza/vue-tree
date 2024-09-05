import TreeView from '../../components/TreeView.vue';

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  data() {
    return { modelValue: [] }
  },
  template: '<TreeView v-bind="args" v-model="modelValue" />'
});

export const Async = Template.bind({});
Async.args = {
  loadNodesAsync: loadNodesCallback,
  modelDefaults: () => ({ loadChildrenAsync: loadChildrenCallback }),
};
let asyncChildCounter = 0;
async function loadNodesCallback() {
  return new Promise(resolve => setTimeout(resolve.bind(null, [{ id: 'async-rootNode', label: 'Root Node', children: [] }]), 1000));
}
async function loadChildrenCallback(parentModel) {
  asyncChildCounter++;
  let currentCounter = asyncChildCounter;
  return new Promise(resolve => setTimeout(resolve.bind(null, [{ id: `async-child-node${currentCounter}`, label: `Child ${currentCounter} from parent ${parentModel.data.id}`, children: [] }]), 1000));
}

const docSourceCode = `
<template>
  <TreeView v-model="modelValue" :load-nodes-async=""loadNodesCallback" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const modelValue = [];
const modelDefaults = () => ({ loadChildrenAsync: loadChildrenCallback });

let asyncChildCounter = 0;
async function loadNodesCallback() {
  return new Promise(resolve => setTimeout(resolve.bind(null, [{ id: 'async-rootNode', label: 'Root Node', children: [] }]), 1000));
}
async function loadChildrenCallback(parentModel) {
  asyncChildCounter++;
  let currentCounter = asyncChildCounter;
  return new Promise(resolve => setTimeout(resolve.bind(null, [{ id: \`async-child-node\${currentCounter}\`, label: \`Child \${currentCounter} from parent \${parentModel.data.id}\`, children: [] }]), 1000));
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