import TreeView from '../../components/TreeView.vue';
import { SelectionMode } from '../../types/selectionMode';
import { treeData, modelDefaults } from "../assets/data/selectionTreeViewData";

const selectionTemplateHtml = `<span>
<label for="modeSelect">Selection Mode</label>
<select v-model="selectionMode" id="modeSelect" style="margin: 0 0 2rem 1rem;">
  <option value="single">Single</option>
  <option value="selectionFollowsFocus">Selection Follows Focus</option>
  <option value="multiple">Multiple</option>
  <option value="none">No Selection</option>
</select>
<TreeView v-bind="argsWithoutValue" v-model="modelValue" :selection-mode="selectionMode" ref="treeViewRef" />
<section class="selected-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshSelectedList">What's selected?</button>
  <ul id="selectedList">
    <li v-for="selectedNode in selectedNodes">{{ selectedNode.data.id }}</li>
  </ul>
</section>
</span>`;

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: selectionTemplateHtml,
  data() {
    let { modelValue, ...rest } = args;
    return {
      argsWithoutValue: rest,
      modelValue,
      selectionMode: SelectionMode.Single,
      selectedNodes: [],
    };
  },
  methods: {
    refreshSelectedList() {
      this.selectedNodes = this.$refs.treeViewRef.getSelected();
    },
  },
});

export const Selection = Template.bind({});
Selection.args = {
  modelValue: treeData,
  modelDefaults,
  selectionMode: SelectionMode.Single,
};

const docSourceCode = `
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" selection-mode="single" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: 'selection-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'selection-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'selection-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'selection-subnode2',
        label: 'This is a checkable, checked subnode',
        children: [
          {
            id: 'subsubnode1',
            label: 'An even deeper node',
            children: [],
          }
        ],
      }
    ],
  },
  {
    id: 'selection-node3',
    label: 'My Third Node',
    children: [
      {
        id: 'subnode31',
        label: 'This is an expanded subnode',
        children: [],
      }
    ],
  }
];

function modelDefaults(node) {
  switch (node.id) {
    case 'selection-node1':
      return {
        expandable: true,
        selectable: true,
        deletable: true,
        input: {
          type: "checkbox",
          name: "checkbox1",
        },
        state: {
          expanded: false,
          selected: false,
          input: {
            value: false,
            disabled: false,
          },
        },
        addChildCallback: function () {
          const entry = prompt("Give it a string.", "");
          return Promise.resolve(
            entry ? { id: entry, label: entry, deletable: true, selectable: true } : null
          );
        },
      };
    case 'selection-node2':
      return {
        title: "My second node, and its fantastic title",
        expandable: true,
        selectable: true,
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          expanded: true,
          selected: false,
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'selection-subnode1':
      return {
        title: "Even non-input nodes should get a title.",
        expandable: true,
        selectable: true,
        deletable: true,
        state: {
          expanded: false,
          selected: false,
        },
      };
    case 'selection-subnode2':
      return {
        expandable: true,
        selectable: true,
        input: {
          type: "checkbox",
          name: "checkbox3",
        },
        state: {
          expanded: false,
          selected: false,
          input: {
            value: true,
            disabled: true,
          },
        },
      };
    case 'subsubnode1':
      return {
        expandable: true,
        selectable: true,
        state: {
          expanded: false,
          selected: false,
        },
        addChildCallback: function () {
          const entry = prompt("Give it a string.", "");
          return Promise.resolve(
            entry ? { id: entry, label: entry, deletable: true, selectable: true } : null
          );
        },
      };
    case 'selection-node3':
      return {
        expandable: false,
        selectable: true,
        deletable: true,
        state: {
          expanded: true,
          selected: false,
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'subnode31':
      return {
        expandable: false,
        selectable: true,
        deletable: true,
        state: {
          expanded: false,
          selected: false,
        },
      };
  }
};
</script>`;

Selection.parameters = {
  docs: {
    source: {
      code: docSourceCode,
      language: "html",
      type: "auto",
    },
  },
};