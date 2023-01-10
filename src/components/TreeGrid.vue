<template>
  <table class="grtg-table" :class="skinClass">
    <thead v-if="columnHeaders.length > 0">
      <tr>
        <th v-for="headerText in columnHeaders" scope="col">
          {{ headerText }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tree-grid-row v-for="rowModel in initialModel" :key="rowModel.id" :depth="0" :initialModel="rowModel">
        <slot>
          <td>Add TreeGridColumn component slot content in the TreeGrid component tags.</td>
        </slot>
      </tree-grid-row>
    </tbody>
  </table>
</template>

<script setup>
import { computed, provide, useSlots } from 'vue';
import TreeGridRow from './TreeGridRow.vue';

// USE SLOTS FOR INSPECTING COLUMNS

const slots = useSlots();
const columnHeaders = computed(() => {
  let headers = [];
  if (slots.default) {
    slots.default().forEach((vNode) => {
      console.debug("GR", vNode);
      if (vNode.type["__name"] === "TreeGridColumn") {
        headers.push(vNode.props["header-text"]);
      }
    });
  }

  return headers;
});

// PROPS

const props = defineProps({
  expanderColumnIndex: {
    type: Number,
    required: true,
  },
  initialModel: {
    type: Array,
    required: false,
    default: function () { return []; }
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

provide('expanderColumnIndex', props.expanderColumnIndex);
</script>

<style>
.grtg-table {
  border: 1px black solid;
}
</style>