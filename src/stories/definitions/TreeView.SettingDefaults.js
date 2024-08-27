import TreeView from '../../components/TreeView.vue';

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

export const SettingDefaults = Template.bind({});
SettingDefaults.args = {
  modelValue: [
    {
      identifier: "node1",
      description: "Node with no children"
    },
    {
      identifier: "node2",
      description: "Node with a child",
      children: [
        {
          identifier: "childNode1",
          description: "A child node"
        }
      ]
    }
  ],
  modelDefaults: () => ({
    idProperty: 'identifier',
    labelProperty: 'description',
    state: {
      expanded: true
    }
  }),
};

const docSourceCode = `
<template>
  <TreeView v-model="tvModel" :model-defaults="modelDefaults" />
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";

const modelDefaults = () => ({
  idProperty: 'identifier',
  labelProperty: 'description',
  state: {
    expanded: true
  }
});

const tvModel = ref([
  {
    identifier: "node1",
    description: "Node with no children"
  },
  {
    identifier: "node2",
    description: "Node with a child",
    children: [
      {
        identifier: "childNode1",
        description: "A child node"
      }
    ]
  }
]);
</script>`;

SettingDefaults.parameters = {
  docs: {
    source: {
      code: docSourceCode,
      language: "html",
      type: "auto",
    },
  },
};