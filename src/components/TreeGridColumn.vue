<template>
  <td class="grtgc">
    <slot>

      <!-- Expander -->
      <template v-if="props.expander">

        <!-- First add spacers for depth -->
        <template v-for="level in depth">
          <span class="grtgc-spacer" :class="customClasses.treeGridNodeSelfSpacer"></span>
        </template>

        <button :id="expanderId"
                type="button"
                v-if="canExpand"
                aria-hidden="true"
                tabindex="-1"
                :title="tns.expanderTitle"
                class="grtgc-expander"
                :class="[customClasses.treeGridNodeSelfExpander, tns.state?.expanded ? 'grtgc-expanded' : '', tns.state?.expanded ? customClasses.treeGridNodeSelfExpanded : '']"
                @click="toggleNodeExpanded">
          <i class="grtgc-expanded-indicator" :class="customClasses.treeGridNodeSelfExpandedIndicator"></i>
        </button>
        <span v-else class="grtgc-spacer" :class="customClasses.treeGridNodeSelfSpacer"></span>
      </template>

      {{ model[valueProperty] }}
    </slot>
  </td>
</template>

<script setup>
import { computed, inject, ref } from 'vue'

// PROPS

const props = defineProps({
  expander: {
    type: Boolean,
    required: false,
    default: false,
  },
  headerText: {
    type: String,
    required: true,
  },
  valueProperty: {
    type: String,
    required: true,
  }
});

// INJECTED

const model = inject('model');
const depth = inject('depth');
const { toggleNodeExpanded } = inject('mutators');
const treeId = inject('treeId');

// COMPUTED

const canExpand = computed(() => props.expander && model.value.children?.length > 0);

const customClasses = computed(() => tns.value.customizations?.classes ?? {});

const expanderId = computed(() => `${nodeId.value}-exp`);

const id = computed(() => model.value[idPropName.value]);

const idPropName = computed(() => tns.value.idProperty ?? 'id');

const nodeId = computed(() => `${treeId.value}-${id.value}`);

const tns = computed(() => model.value.treeNodeSpec);

</script>

<style>
.grtg-wrapper.grtg-default-skin .grtgc {
  padding: .5rem;
}

/* The expander button and indicator content */
.grtg-wrapper.grtg-default-skin .grtgc-expander {
  padding: 0;
  background: none;
  border: none;
  height: var(--baseHeight);
}

.grtg-wrapper.grtg-default-skin .grtgc-expander i.grtgc-expanded-indicator {
  font-style: normal;
}

.grtg-wrapper.grtg-default-skin .grtgc-expander i.grtgc-expanded-indicator::before {
  content: '+';
}

.grtg-wrapper.grtg-default-skin .grtgc-expander.grtgc-expanded i.grtgc-expanded-indicator::before {
  content: '-';
}

/* The styling for when the node is selected */
.grtg-wrapper.grtg-default-skin .grtgc-selected {
  background-color: #f0f0f8;
}

/* Spacing */.grtg-wrapper.grtg-default-skin .grtgc-expander,
.grtg-wrapper.grtg-default-skin .grtgc-spacer {
  min-width: 1rem;
}

.grtg-wrapper.grtg-default-skin .grtgc-spacer {
  display: inline-block;
}

.grtg-wrapper.grtg-default-skin .grtgc-expander,
.grtg-wrapper.grtg-default-skin .grtgc-spacer {
  margin: 0;
}
</style>