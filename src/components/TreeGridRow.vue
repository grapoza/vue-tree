<template>
  <tr>
    <slot />
  </tr>
  <tree-grid-row v-for="childModel in initialModel.children" :key="childModel.id" :depth="depth+1" :initial-model="childModel" />
</template>

<script setup>
import { provide } from 'vue';

// PROPS

const props = defineProps({
  depth: {
    type: Number,
    required: true,
  },
  initialModel: {
    type: Object,
    required: true,
  },
});

provide('initialModel', props.initialModel);
</script>