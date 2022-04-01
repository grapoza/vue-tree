import TreeView from '../../components/TreeView.vue';

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: '<tree-view v-bind="args" />'
});

export const SettingDefaults = Template.bind({});
SettingDefaults.args = {
  initialModel: [
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
  modelDefaults: {
    idProperty: 'identifier',
    labelProperty: 'description',
    state: {
      expanded: true
    }
  }
};

const docSourceCode = `
<template>
  <tree-view :initial-model="tvModel" :model-defaults="modelDefaults"></tree-view>
</template>
<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";

const modelDefaults = ref({
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