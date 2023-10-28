<template>
  <div class="grtg-wrapper" :class="skinClass">
    <table class="grtg" role="treegrid">
      <thead v-if="columnHeaders.length > 0">
        <tr>
          <th v-for="headerText in columnHeaders" scope="col" class="grtgc">
            {{ headerText }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tree-grid-row v-for="rowModel in initialModel" :key="rowModel.id" :depth="0" :initial-model="rowModel" :model-defaults="modelDefaults">
          <slot>
            <td role="gridcell">Add TreeGridColumn components into the TreeGrid component's default slot.</td>
          </slot>
        </tree-grid-row>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, provide, useAttrs, useSlots } from 'vue';
import TreeGridRow from './TreeGridRow.vue';
import { useIdGeneration } from '../composables/dom/idGeneration.js';

const attrs = useAttrs();

// USE SLOTS FOR INSPECTING COLUMNS

const slots = useSlots();
const columnHeaders = computed(() => {
  let headers = [];
  if (slots.default) {
    slots.default().forEach((vNode) => {
      if (vNode.type["__name"] === "TreeGridColumn") {
        headers.push(vNode.props["header-text"]);
      }
    });
  }

  return headers;
});

// PROPS

const props = defineProps({
  initialModel: {
    type: Array,
    required: false,
    default: function () { return []; }
  },
  modelDefaults: {
    type: Object,
    required: false,
    default: function () { return {}; }
  },
  skinClass: {
    type: String,
    required: false,
    default: 'grtg-default-skin',
    validator: function (value) {
      return value === null || !value.match(/\s/);
    }
  },
});

// COMPOSABLES

const { generateUniqueId } = useIdGeneration();

// COMPUTED

const uniqueId = computed(() => attrs.id ?? generateUniqueId());

// PROVIDE

provide('treeId', uniqueId);

</script>

<style>
.grtg-wrapper.grtg-default-skin .grtg {
  border: 1px black solid;
  border-collapse: collapse;
}
</style>