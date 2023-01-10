<template>
  <td>
    <slot>
      {{ initialModel[valueProperty] }}
    </slot>
  </td>
</template>

<script setup>
import { inject } from 'vue'

// PROPS

const props = defineProps({
  headerText: {
    type: String,
    required: true,
  },
  valueProperty: {
    type: String,
    required: true,
  }
});

const expanderColumnIndex = inject('expanderColumnIndex');
const initialModel = inject('initialModel');
</script>