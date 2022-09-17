import TreeView from '../../components/TreeView.vue';
import slotsTreeData from "../data/slotsTreeViewData";

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: `<span>
  <tree-view v-bind="args">
  <template v-slot:loading-root>Root loading custom slot (Not used in this demo)</template>
  <template v-slot:checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
    <label :for="inputId" :title="model.treeNodeSpec.title">
      <input :id="inputId"
            type="checkbox"
            :disabled="model.treeNodeSpec.state.input.disabled"
            v-model="model.treeNodeSpec.state.input.value"
            @change="checkboxChangeHandler" />
      <em style="max-width: 6rem">{{ model[model.treeNodeSpec.labelProperty] }}. This is custom slot content.</em>
    </label>
  </template>
  <template v-slot:radio="{ model, customClasses, inputId, radioGroupValues, radioChangeHandler }">
    <label :for="inputId" :title="model.treeNodeSpec.title">
      <input v-if="radioGroupValues"
            :id="inputId"
            type="radio"
            :name="model.treeNodeSpec.input.name"
            :value="model.treeNodeSpec.input.value"
            :disabled="model.treeNodeSpec.state.input.disabled"
            v-model="radioGroupValues[model.treeNodeSpec.input.name]"
            @change="radioChangeHandler" />
      <span style="font-weight: bolder">{{ model[model.treeNodeSpec.labelProperty] }}. This is custom slot content.</span>
    </label>
  </template>
  <template v-slot:text="{ model, customClasses }"><span>{{ model[model.treeNodeSpec.labelProperty] }}. This is custom slot content.</span></template>
  <template v-slot:loading="{ model, customClasses }">
    <span class="grtvn-loading">
      LOADING PLACHOLDER FOR CHILDREN OF {{ model[model.treeNodeSpec.labelProperty] }}. This is custom slot content.
    </span>
  </template>
</tree-view>
</span>`
});

export const Slots = Template.bind({});
Slots.args = {
  initialModel: slotsTreeData,
};

const docsSourceCode = `
<template>
  <tree-view :initial-model="tvModel">
    <template v-slot:loading-root>Root loading custom slot (Not used in this demo)</template>
    <template v-slot:checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
      <label :for="inputId" :title="model.treeNodeSpec.title">
        <input :id="inputId"
              type="checkbox"
              :disabled="model.treeNodeSpec.state.input.disabled"
              v-model="model.treeNodeSpec.state.input.value"
              @change="checkboxChangeHandler" />
        <em style="max-width: 6rem">{{ model[model.treeNodeSpec.labelProperty] }}. This is custom slot content.</em>
      </label>
    </template>
    <template v-slot:radio="{ model, customClasses, inputId, radioGroupValues, radioChangeHandler }">
      <label :for="inputId" :title="model.treeNodeSpec.title">
        <input v-if="radioGroupValues"
              :id="inputId"
              type="radio"
              :name="model.treeNodeSpec.input.name"
              :value="model.treeNodeSpec.input.value"
              :disabled="model.treeNodeSpec.state.input.disabled"
              v-model="radioGroupValues[model.treeNodeSpec.input.name]"
              @change="radioChangeHandler" />
        <span style="font-weight: bolder">{{ model[model.treeNodeSpec.labelProperty] }}. This is custom slot content.</span>
      </label>
    </template>
    <template v-slot:text="{ model, customClasses }"><span>{{ model[model.treeNodeSpec.labelProperty] }}. This is custom slot content.</span></template>
    <template v-slot:loading="{ model, customClasses }">
      <span class="grtvn-loading">
        LOADING PLACHOLDER FOR CHILDREN OF {{ model[model.treeNodeSpec.labelProperty] }}. This is custom slot content.
      </span>
    </template>
  </tree-view>
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";
import treeViewData from "../data/basicTreeViewData";

const tvModel = ref(treeViewData);
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