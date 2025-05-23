import TreeView from '../../components/TreeView.vue';
import { treeData, modelDefaults } from "../assets/data/radiobuttonsTreeViewData";

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
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.data.id }}</li>
  </ul>
</section>
</span>`,
  methods: {
    refreshCheckedTvList() {
      this.checkedTvNodes = this.$refs.treeViewRef.getCheckedRadioButtons();
    },
  },
});

export const Radiobuttons = Template.bind({});
Radiobuttons.args = {
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
    id: 'radiobuttons-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'radiobuttons-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'radiobuttons-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'radiobuttons-subnode2',
        label: 'This is a checkable, checked subnode',
        children: [],
      }
    ],
  }
];

function modelDefaults(node) {

  const baseDefaults = {
    addChildTitle: "Add a new child node",
    deleteTitle: "Delete this node",
    expanderTitle: "Expand this node",
  };

  switch (node.id) {
    case 'radiobuttons-node1':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "radio",
          name: "radio1",
          value: "aValueToSubmit",
          isInitialRadioGroupValue: true,
        },
        state: {
          expanded: false,
          selected: false,
        },
      });
    case 'radiobuttons-node2':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "radio",
          name: "radio1",
        },
        state: {
          expanded: true,
          selected: false,
        },
      });
    case 'radiobuttons-subnode1':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "radio",
          name: "radio2",
          isInitialRadioGroupValue: true,
        },
        state: {
          expanded: false,
          selected: false,
        },
      });
    case 'radiobuttons-subnode2':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "radio",
          name: "radio2",
        },
        state: {
          expanded: false,
          selected: false,
        },
      });
    default:
      return baseDefaults;
  }
}
</script>`;

Radiobuttons.parameters = {
  docs: {
    source: {
      code: docSourceCode,
      language: "html",
      type: "auto",
    },
  },
};