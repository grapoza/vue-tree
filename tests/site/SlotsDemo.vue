<template>
<div class="container">
    <h1>Slots Tree View Demo</h1>
    <div id="tree-view">
      <tree-view id="customtreeview" :initial-model="tvModel" ref="treeViewRef">

            <template #text="{ model, customClasses }">
              <span>{{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}</span>
            </template>

            <template #checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
              <label :for="inputId" :title="model.treeNodeSpec.title">

                <input :id="inputId"
                       type="checkbox"
                       :disabled="model.treeNodeSpec.state.input.disabled"
                       v-model="model.treeNodeSpec.state.input.value"
                       @change="checkboxChangeHandler" />

                <em style="max-width: 6rem">{{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}</em>
              </label>
            </template>

            <template #radio="{ model, customClasses, inputId, radioGroupValues, radioChangeHandler }">
              <label :for="inputId" :title="model.treeNodeSpec.title">

                <input v-if="radioGroupValues"
                       :id="inputId"
                       type="radio"
                       :name="model.treeNodeSpec.input.name"
                       :value="model.treeNodeSpec.input.value"
                       :disabled="model.treeNodeSpec.state.input.disabled"
                       v-model="radioGroupValues[model.treeNodeSpec.input.name]"
                       @change="radioChangeHandler" />

                <span style="font-weight: bolder">{{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}</span>
              </label>
            </template>

            <template #loading="{ model, customClasses }">
              <span class="grtvn-loading">
                LOADING PLACHOLDER FOR CHILDREN OF {{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}
              </span>
            </template>

        </tree-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";
import treeViewData from './slotsTreeViewData.js';

const tvModel = ref(treeViewData);

</script>