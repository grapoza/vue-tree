import TreeView from '../../components/TreeView.vue';
import { treeData, modelDefaults } from '../data/staticTreeViewData';

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

export const Static = Template.bind({});
Static.args = {
  modelValue: treeData,
  modelDefaults,
};

const docsSourceCode = `
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: 'static-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'static-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'static-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'static-subnode2',
        label: 'This is another subnode',
        children: [
          {
            id: 'static-subsubnode1',
            label: 'An even deeper node',
            children: [],
          }
        ],
      }
    ],
  }
];

function modelDefaults() {
  return {
    expandable: false,
    state: {
      expanded: true,
    },
  };
}
</script>`;

Static.parameters = {
  docs: {
    source: {
      code: docsSourceCode,
      language: "html",
      type: "auto",
    },
  },
};