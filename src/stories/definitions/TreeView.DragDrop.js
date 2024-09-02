import TreeView from '../../components/TreeView.vue';
import { tree1Data, tree2Data, modelDefaults } from "../data/dragDropTreeViewData";

const dragDropTemplateHtml = `<span>
<h2>Tree 1</h2>
<TreeView v-model="modelValue1" :model-defaults="args.modelDefaults" />
<h2>Tree 2</h2>
<TreeView v-model="modelValue2" :model-defaults="args.modelDefaults" />
<h2>Text Drop Target</h2>
<textarea style="width: 90%" rows="10"></textarea>
</span>`;

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: dragDropTemplateHtml,
  data() {
    return {
      modelValue1: args.modelValue1,
      modelValue2: args.modelValue2,
    };
  },
});

export const DragDrop = Template.bind({});
DragDrop.args = {
  modelValue1: tree1Data,
  modelValue2: tree2Data,
  modelDefaults,
};

const docSourceCode = `
<template>
  <h2>Tree 1</h2>
  <TreeView v-model="tree1Data" :model-defaults="modelDefaults" />
  <h2>Tree 2</h2>
  <TreeView v-model="tree2Data" :model-defaults="modelDefaults" />
  <h2>Text Drop Target</h2>
  <textarea style="width: 90%" rows="10"></textarea>
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const tree1Data = [
  {
    id: 'dragdrop1-node1',
    label: 'Node One',
    children: [],
  },
  {
    id: 'dragdrop1-node2',
    label: 'Node Two',
    children: [
      {
        id: 'dragdrop1-subnode1',
        label: 'Subnode One',
        children: []
      },
      {
        id: 'dragdrop1-subnode2',
        label: 'Subnode Two',
        children: [
          {
            id: 'dragdrop1-subsubnode1',
            label: 'Sub-Subnode 1',
            children: []
          },
          {
            id: 'dragdrop1-subsubnode2',
            label: 'Sub-Subnode 2',
            children: []
          }
        ]
      }
    ]
  }
];

const tree2Data = [
  {
    id: 'dragdrop2-node1',
    label: 'Node One',
    children: [],
  },
  {
    id: 'dragdrop2-node2',
    label: 'Node Two',
    children: [
      {
        id: 'dragdrop2-subnode1',
        label: 'Subnode One',
        children: []
      },
      {
        id: 'dragdrop2-subnode2',
        label: 'Subnode Two',
        children: [
          {
            id: 'dragdrop2-subsubnode1',
            label: 'Sub-Subnode 1',
            children: []
          },
          {
            id: 'dragdrop2-subsubnode2',
            label: 'Sub-Subnode 2',
            children: []
          }
        ]
      }
    ]
  }
];

function modelDefaults(node) {

  const baseDefaults = {
    expanderTitle: "Expand this node",
    draggable: true,
    allowDrop: true,
    state: {
      expanded: true,
    },
  };

  if (node.id === 'dragdrop1-node1' || node.id === 'dragdrop2-node1') {
    baseDefaults.addChildCallback = function () { return Promise.resolve({ id: '' + Math.random(), label: 'Added' }); }
  }

  return baseDefaults;
};
</script>`;

DragDrop.parameters = {
  docs: {
    source: {
      code: docSourceCode,
      language: "html",
      type: "auto",
    },
  },
};