<template>
  <tr class="grtgr" :aria-expanded="ariaExpanded">
    <slot />
  </tr>
  <template v-if="isExpanded">
    <tree-grid-row v-for="childModel in model.children" :key="childModel.id" :depth="depth+1" :initial-model="childModel" :model-defaults="modelDefaults">
      <slot />
    </tree-grid-row>
  </template>
</template>

<script setup>
import { computed, provide, ref, toRef } from 'vue';
import { useTreeGridNodeDataNormalizer } from '../composables/treeGridNodeDataNormalizer.js';
import { useTreeNodeExpansion } from '../composables/expansion/treeNodeExpansion.js';
import TreeEvent from '../enums/event.js';

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
  modelDefaults: {
    type: Object,
    required: true,
  },
});

// EMITS

const emit = defineEmits([
  TreeEvent.RequestFirstFocus,
]);

// DATA

const model = ref(props.initialModel);

// COMPOSABLES

const { normalizeNodeData } = useTreeGridNodeDataNormalizer(model, props.modelDefaults, {});

normalizeNodeData();

const {
  ariaExpanded,
} = useTreeNodeExpansion(model, emit);

// METHODS

// TODO This can possibly reuse treeViewNodeExpansion
function toggleNodeExpanded() {
  model.value.treeNodeSpec.state.expanded = !model.value.treeNodeSpec.state.expanded;
}

// PROVIDE

provide('model', model);
provide('depth', toRef(props, "depth"));

// If mutating provided data, it is recommended to also provider mutator function controlled at the provider level.
// https://vuejs.org/guide/components/provide-inject.html#working-with-reactivity
provide('mutators', { toggleNodeExpanded });

// COMPUTED

// TODO Replace with expansion composable
const isExpanded = computed(() => model.value.treeNodeSpec.state.expanded);

</script>

<style>
.grtg-wrapper.grtg-default-skin tr.grtgr:nth-child(even) {
  background: lightblue;
}
</style>