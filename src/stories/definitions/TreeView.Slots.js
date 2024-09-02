import TreeView from '../../components/TreeView.vue';
import { treeData, modelDefaults } from "../data/slotsTreeViewData";

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
  template: `<span>
<TreeView v-bind="argsWithoutValue" v-model="modelValue">
  <template #loading-root>Root loading custom slot (Not used in this demo)</template>
  <template #expander="{ metaModel, customClasses, expanderId, canExpand, toggleNodeExpanded }">
    <button :id="expanderId"
            type="button"
            v-if="canExpand"
            aria-hidden="true"
            tabindex="-1"
            :title="metaModel.expanderTitle"
            class="grtvn-self-expander"
            :class="[customClasses.treeViewNodeSelfExpander,
            metaModel.state.expanded ? 'grtvn-self-expanded' : '',
            metaModel.state.expanded ? customClasses.treeViewNodeSelfExpanded : '']"
            @click="toggleNodeExpanded">
      {{ metaModel.state.expanded ? 'v' : '>' }}
    </button>
    <span v-else
          class="grtvn-self-spacer"
          :class="customClasses.treeViewNodeSelfSpacer"></span>
  </template>
  <template #checkbox="{ metaModel, customClasses, inputId, checkboxChangeHandler }">
    <label :for="inputId" :title="metaModel.title">
      <input :id="inputId"
            type="checkbox"
            :disabled="metaModel.state.input.disabled"
            v-model="metaModel.state.input.value"
            @change="checkboxChangeHandler" />
      <em style="max-width: 6rem">{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</em>
    </label>
  </template>
  <template #radio="{ metaModel, customClasses, inputId, radioGroupValues, radioChangeHandler }">
    <label :for="inputId" :title="metaModel.title">
      <input v-if="radioGroupValues"
            :id="inputId"
            type="radio"
            :name="metaModel.input.name"
            :value="metaModel.input.value"
            :disabled="metaModel.state.input.disabled"
            v-model="radioGroupValues[metaModel.input.name]"
            @change="radioChangeHandler" />
      <span style="font-weight: bolder">{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</span>
    </label>
  </template>
  <template #text="{ metaModel, customClasses }"><span>{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</span></template>
  <template #loading="{ metaModel, customClasses }">
    <span class="grtvn-loading">
      LOADING PLACHOLDER FOR CHILDREN OF {{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.
    </span>
  </template>
</TreeView>
</span>`,
});

export const Slots = Template.bind({});
Slots.args = {
  modelValue: treeData,
  modelDefaults,
};

const docsSourceCode = `
<template>
  <TreeView v-bind="argsWithoutValue" v-model="modelValue">
    <template #loading-root>Root loading custom slot (Not used in this demo)</template>
    <template #expander="{ metaModel, customClasses, expanderId, canExpand, toggleNodeExpanded }">
      <button :id="expanderId"
              type="button"
              v-if="canExpand"
              aria-hidden="true"
              tabindex="-1"
              :title="metaModel.expanderTitle"
              class="grtvn-self-expander"
              :class="[customClasses.treeViewNodeSelfExpander,
              metaModel.state.expanded ? 'grtvn-self-expanded' : '',
              metaModel.state.expanded ? customClasses.treeViewNodeSelfExpanded : '']"
              @click="toggleNodeExpanded">
        {{ metaModel.state.expanded ? 'v' : '>' }}
      </button>
      <span v-else
            class="grtvn-self-spacer"
            :class="customClasses.treeViewNodeSelfSpacer"></span>
    </template>
    <template #checkbox="{ metaModel, customClasses, inputId, checkboxChangeHandler }">
      <label :for="inputId" :title="metaModel.title">
        <input :id="inputId"
              type="checkbox"
              :disabled="metaModel.state.input.disabled"
              v-model="metaModel.state.input.value"
              @change="checkboxChangeHandler" />
        <em style="max-width: 6rem">{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</em>
      </label>
    </template>
    <template #radio="{ metaModel, customClasses, inputId, radioGroupValues, radioChangeHandler }">
      <label :for="inputId" :title="metaModel.title">
        <input v-if="radioGroupValues"
              :id="inputId"
              type="radio"
              :name="metaModel.input.name"
              :value="metaModel.input.value"
              :disabled="metaModel.state.input.disabled"
              v-model="radioGroupValues[metaModel.input.name]"
              @change="radioChangeHandler" />
        <span style="font-weight: bolder">{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</span>
      </label>
    </template>
    <template #text="{ metaModel, customClasses }"><span>{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</span></template>
    <template #loading="{ metaModel, customClasses }">
      <span class="grtvn-loading">
        LOADING PLACHOLDER FOR CHILDREN OF {{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.
      </span>
    </template>
  </TreeView>
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: 'slots-node1',
    label: 'Checkbox Node',
    children: [],
  },
  {
    id: 'slots-node2',
    label: 'Radiobutton Node',
  },
  {
    id: 'slots-node3',
    label: 'Text Node',
    children: [
      {
        id: 'slots-subnode1',
        label: 'Checkbox Subnode',
        children: []
      }
    ]
  },
  {
    id: 'slots-node4',
    label: 'Text Node with Async Children',
    children: [],
  }
];

function modelDefaults(node) {
  switch (node.id) {
    case 'slots-node1':
      return {
        input: {
          type: "checkbox",
          name: "checkbox1",
        },
        state: {
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'slots-node2':
      return {
        input: {
          type: "radio",
          name: "radiobutton1",
        },
        state: {
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'slots-node3':
      return {};
    case 'slots-subnode1':
      return {
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'slots-node4':
      return {
        expandable: true,
        loadChildrenAsync: (m) => new Promise(() => {}), // Never resolve so the demo node stays up.
      };
    default:
      return {};
  }
}
</script>`;

Slots.parameters = {
  docs: {
    source: {
      code: docsSourceCode,
      language: "html",
      type: "auto",
    },
  },
};