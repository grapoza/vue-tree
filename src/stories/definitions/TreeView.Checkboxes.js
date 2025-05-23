import TreeView from '../../components/TreeView.vue';
import { treeData, modelDefaults } from "../assets/data/checkboxesTreeViewData";

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
      this.checkedTvNodes = this.$refs.treeViewRef.getCheckedCheckboxes();
    },
  },
});

export const Checkboxes = Template.bind({});
Checkboxes.args = {
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
    id: 'checkboxes-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'checkboxes-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'checkboxes-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'checkboxes-subnode2',
        label: 'This is a disabled, checked subnode',
        children: [
          {
            id: 'checkboxes-subsubnode1',
            label: 'An even deeper node',
            children: [],
          }
        ],
      }
    ],
  }
];

function modelDefaults(node) {

  const baseDefaults = {
    addChildTitle: 'Add a new child node',
    deleteTitle: 'Delete this node',
    expanderTitle: 'Expand this node',
  };

  switch (node.id) {
    case 'checkboxes-node1':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        deletable: true,
        input: {
          type: 'checkbox',
          name: 'checkbox1'
        },
        state: {
          expanded: false,
          selected: false,
          input: {
            value: false,
            disabled: false
          }
        }
      });
    case 'checkboxes-node2':
      return Object.assign(baseDefaults, {
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
      });
    case 'checkboxes-subnode1':
      return Object.assign(baseDefaults, {
        title: "Even non-input nodes should get a title.",
        expandable: true,
        selectable: true,
        deletable: true,
        state: {
          expanded: false,
          selected: false,
        },
      });
    case 'checkboxes-subnode2':
      return Object.assign(baseDefaults, {
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
      });
    case 'checkboxes-subsubnode1':
      return Object.assign(baseDefaults, {
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
      });
    default:
      return baseDefaults;
  }
}
</script>`;

Checkboxes.parameters = {
  docs: {
    source: {
      code: docSourceCode,
      language: "html",
      type: "auto",
    },
  },
};