<template>
  <tr class="grtgr" :aria-expanded="ariaExpanded" v-bind="$attrs" v-show="isParentExpanded">
    <slot />
  </tr>
  <tree-grid-row v-for="childModel in model.children"
      :key="childModel.id"
      :depth="depth+1"
      :initial-model="childModel"
      :model-defaults="modelDefaults"
      :aria-hidden="!isExpanded"
      :is-parent-expanded="isExpanded">
    <slot />
  </tree-grid-row>
</template>

<script setup>
import { computed, provide, ref, toRef } from 'vue';
import { useTreeGridNodeDataNormalizer } from '../composables/normalization/treeGridNodeDataNormalizer.js';
import { useTreeNodeExpansion } from '../composables/expansion/treeNodeExpansion.js';
import { useTreeNodeChildren } from '../composables/children/treeNodeChildren.js';
import { useTreeNodeFilter } from '../composables/filter/treeNodeFilter.js';
import TreeEvent from '../enums/event.js';

defineOptions({
  inheritAttrs: false
})

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
  isParentExpanded: {
    type: Boolean,
    required: true,
  }
});

// EMITS

const emit = defineEmits([
  TreeEvent.ExpandedChange,
  TreeEvent.RequestFirstFocus,
]);

// DATA

const model = ref(props.initialModel);

// COMPOSABLES

const { normalizeTreeGridNodeData } = useTreeGridNodeDataNormalizer(model, props.modelDefaults);

normalizeTreeGridNodeData();

const {
  ariaExpanded,
  canExpand,
  isNodeExpanded,
  toggleNodeExpanded,
} = useTreeNodeExpansion(model, emit);

// PROVIDE

provide('model', model);
provide('depth', toRef(props, "depth"));

// If mutating provided data, it is recommended to also provider mutator function controlled at the provider level.
// I'm also including canExpand because it emits.
// https://vuejs.org/guide/components/provide-inject.html#working-with-reactivity
provide('mutators', { canExpand, toggleNodeExpanded });

// COMPUTED

const isExpanded = computed(() => isNodeExpanded());

</script>

<style>
.grtg-wrapper.grtg-default-skin tr.grtgr:nth-child(even) {
  background: lightblue;
}
</style>