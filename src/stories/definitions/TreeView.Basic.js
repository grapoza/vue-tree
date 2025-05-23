import TreeView from '../../components/TreeView.vue';
import { treeData, modelDefaults } from '../assets/data/basicTreeViewData';

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
      checkedTvNodes: [],
    };
  },
  template: `<span>
<TreeView v-bind="argsWithoutValue" v-model="modelValue" ref="treeViewRef" />
<section class="checked-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked (checkboxes and radiobuttons)?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.data.id }}</li>
  </ul>
</section>
</span>`,
  methods: {
    refreshCheckedTvList() {
      this.checkedTvNodes = [
        ...this.$refs.treeViewRef.getCheckedCheckboxes(),
        ...this.$refs.treeViewRef.getCheckedRadioButtons(),
      ];
    },
  },
});

export const Basic = Template.bind({});
Basic.args = {
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
    id: 'basic-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'basic-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'basic-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'basic-subnode2',
        label: 'Another Subnode',
        children: [],
      },
      {
        id: 'basic-subnode3',
        label: 'This is a disabled, checked subnode',
        children: [
          {
            id: 'basic-subsubnode1',
            label: 'An even deeper node',
            children: []
          }
        ]
      }
    ]
  }
];

function modelDefaults(node) {
  switch (node.id) {
    case 'basic-node1':
      return {};
    case 'basic-node2':
      return {
        title: "My node, and its fantastic title",
        input: {
          type: "checkbox",
          name: "checkbox1",
        },
        state: {
          expanded: true,
        },
      };
    case 'basic-subnode1':
      return {
        input: {
          type: "radio",
          name: "radio1",
          isInitialRadioGroupValue: true,
        },
      };
    case 'basic-subnode2':
      return {
        input: {
          type: "radio",
          name: "radio1",
        },
      };
    case 'basic-subnode3':
      return {
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          input: {
            value: true,
            disabled: true,
          },
        },
      };
    case 'basic-subsubnode1':
      return {};
  }
};
</script>`;

Basic.parameters = {
  docs: {
    source: {
      code: docsSourceCode,
      language: "html",
      type: "auto",
    },
  },
};