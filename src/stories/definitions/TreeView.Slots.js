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
  <template v-slot:loading-root>Root loading custom slot (Not used in this demo)</template>
  <template v-slot:checkbox="{ metaModel, customClasses, inputId, checkboxChangeHandler }">
    <label :for="inputId" :title="metaModel.title">
      <input :id="inputId"
            type="checkbox"
            :disabled="metaModel.state.input.disabled"
            v-model="metaModel.state.input.value"
            @change="checkboxChangeHandler" />
      <em style="max-width: 6rem">{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</em>
    </label>
  </template>
  <template v-slot:radio="{ metaModel, customClasses, inputId, radioGroupValues, radioChangeHandler }">
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
  <template v-slot:text="{ metaModel, customClasses }"><span>{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</span></template>
  <template v-slot:loading="{ metaModel, customClasses }">
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
    <template v-slot:loading-root>Root loading custom slot (Not used in this demo)</template>
    <template v-slot:checkbox="{ metaModel, customClasses, inputId, checkboxChangeHandler }">
      <label :for="inputId" :title="metaModel.title">
        <input :id="inputId"
              type="checkbox"
              :disabled="metaModel.state.input.disabled"
              v-model="metaModel.state.input.value"
              @change="checkboxChangeHandler" />
        <em style="max-width: 6rem">{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</em>
      </label>
    </template>
    <template v-slot:radio="{ metaModel, customClasses, inputId, radioGroupValues, radioChangeHandler }">
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
    <template v-slot:text="{ metaModel, customClasses }"><span>{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</span></template>
    <template v-slot:loading="{ metaModel, customClasses }">
      <span class="grtvn-loading">
        LOADING PLACHOLDER FOR CHILDREN OF {{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.
      </span>
    </template>
  </TreeView>
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import { treeData, modelDefaults } from "../data/slotsTreeViewData";

const tvModel = ref(treeData);
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