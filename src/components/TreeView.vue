<template>
  <div ref="treeElement" class="grtv-wrapper" :class="skinClass">
    <slot v-if="!areNodesLoaded" name="loading-root">

      <span class="grtv-loading">
        ...
      </span>
    </slot>
    <ul class="grtv" role="tree" :aria-multiselectable="ariaMultiselectable" v-if="areNodesLoaded">
      <TreeViewNode v-for="(nodeMetaModel, index) in metaModel"
        :key="nodeMetaModel.data[nodeMetaModel?.idProperty ?? 'id']"
        :aria-key-map="ariaKeyMap"
        :depth="0"
        :model-defaults="modelDefaults"
        v-model="metaModel[index]"
        :selection-mode="selectionMode"
        :tree-id="uniqueId"
        :is-mounted="isMounted"
        :initial-radio-group-values="radioGroupValues"
        @treeNodeClick="(t, e)=>$emit(TreeEvent.Click, t, e)"
        @treeNodeDblclick="(t, e)=>$emit(TreeEvent.DoubleClick, t, e)"
        @treeNodeCheckboxChange="(t, e)=>$emit(TreeEvent.CheckboxChange, t, e)"
        @treeNodeChildCheckboxChange="(t, c, e)=>$emit(TreeEvent.ChildCheckboxChange, t, c, e)"
        @treeNodeRadioChange="(t, e)=>$emit(TreeEvent.RadioChange, t, e)"
        @treeNodeExpandedChange="(t)=>$emit(TreeEvent.ExpandedChange, t)"
        @treeNodeChildrenLoad="(t)=>$emit(TreeEvent.ChildrenLoad, t)"
        @treeNodeSelectedChange="handleNodeSelectedChange"
        @treeNodeAdd="(t, p)=>$emit(TreeEvent.Add, t, p)"
        @treeNodeDelete="handleChildDeletion"
        @treeNodeAriaFocusableChange="handleFocusableChange"
        @treeNodeAriaRequestFirstFocus="(keepCurrentDomFocus) => focusFirst(metaModel, keepCurrentDomFocus)"
        @treeNodeAriaRequestLastFocus="focusLast(metaModel)"
        @treeNodeAriaRequestPreviousFocus="(t) => focusPrevious(metaModel, t)"
        @treeNodeAriaRequestNextFocus="(t, f) => focusNext(metaModel, t, f)"
        @treeNodeDragMove="dragMoveNode"
        @treeNodeDrop="drop">

        <template #expander="{ metaModel, customClasses, expanderId, canExpand, toggleNodeExpanded }">
          <slot name="expander" :metaModel="metaModel" :customClasses="customClasses" :expanderId="expanderId" :canExpand="canExpand" :toggleNodeExpanded="toggleNodeExpanded"></slot>
        </template>
        <template #checkbox="{ metaModel, customClasses, inputId, checkboxChangeHandler }">
          <slot name="checkbox" :metaModel="metaModel" :customClasses="customClasses" :inputId="inputId" :checkboxChangeHandler="checkboxChangeHandler"></slot>
        </template>
        <template #radio="{ metaModel, customClasses, inputId, radioGroupValues, radioChangeHandler }">
          <slot name="radio" :metaModel="metaModel" :customClasses="customClasses" :inputId="inputId" :radioGroupValues="radioGroupValues" :radioChangeHandler="radioChangeHandler"></slot>
        </template>
        <template #text="{ metaModel, customClasses }">
          <slot name="text" :metaModel="metaModel" :customClasses="customClasses"></slot>
        </template>
        <template #loading="{ metaModel, customClasses }">
          <slot name="loading" :metaModel="metaModel" :customClasses="customClasses"></slot>
        </template>
      </TreeViewNode>
    </ul>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, readonly, onMounted, provide, toRef, watch } from 'vue'
import SelectionMode from '../enums/selectionMode.js';
import { useIdGeneration } from '../composables/idGeneration.js'
import { useTreeViewTraversal } from '../composables/treeViewTraversal.js'
import { useFocus } from '../composables/focus/focus.js';
import { useTreeViewFocus } from '../composables/focus/treeViewFocus.js';
import { useSelection } from '../composables/selection/selection.js';
import { useTreeViewFilter } from '../composables/filter/treeViewFilter.js';
import { useTreeViewSelection } from '../composables/selection/treeViewSelection.js';
import { useTreeViewDragAndDrop } from '../composables/dragDrop/treeViewDragAndDrop.js';
import { useTreeViewConvenienceMethods } from '../composables/treeViewConvenienceMethods.js';
import { useTreeViewDataUpdates } from '../composables/treeViewDataUpdates.js';
import { useNodeDataNormalizer } from '../composables/nodeDataNormalizer.js';
import TreeViewNode from './TreeViewNode.vue';
import TreeEvent from '../enums/event.js';

// PROPS

const props = defineProps({
  customAriaKeyMap: {
    type: Object,
    required: false,
    default: function () { return {}; },
    validator: function (value) {
      // All properties must be non-empty arrays of numbers
      for (const prop in value) {
        if (!Array.isArray(value[prop]) || value[prop].some((e) => !Number.isInteger(e))) {
          console.error(`customAriaKeyMap properties must be Arrays of numbers (corresponding to keyCodes); property '${prop}' fails check.`);
          return false;
        }
      }

      return true;
    }
  },
  filterMethod: {
    type: Function,
    required: false,
    default: null
  },
  loadNodesAsync: {
    type: Function,
    required: false,
    default: null
  },
  modelDefaults: {
    type: Function,
    required: false,
    default() { return {}; }
  },
  selectionMode: {
    type: String,
    required: false,
    default: SelectionMode.None,
    validator: function (value) {
      return Object.values(SelectionMode).includes(value);
    }
  },
  skinClass: {
    type: String,
    required: false,
    default: 'grtv-default-skin',
    validator: function (value) {
      return value === null || !value.match(/\s/);
    }
  }
});

const model = defineModel({ type: Array, required: true });

// EMITS

const emit = defineEmits([
  TreeEvent.Add,
  TreeEvent.CheckboxChange,
  TreeEvent.ChildrenLoad,
  TreeEvent.ChildCheckboxChange,
  TreeEvent.Click,
  TreeEvent.Delete,
  TreeEvent.DoubleClick,
  TreeEvent.ExpandedChange,
  TreeEvent.RadioChange,
  TreeEvent.RootNodesLoad,
  TreeEvent.SelectedChange
]);

// CONSTANTS
const defaultAriaKeyMap = readonly({
  activateItem: [32], // Space
  selectItem: [13], // Enter
  focusLastItem: [35], // End
  focusFirstItem: [36], // Home
  collapseFocusedItem: [37], // Left
  expandFocusedItem: [39], // Right
  focusPreviousItem: [38], // Up
  focusNextItem: [40], // Down
  insertItem: [45], // Insert
  deleteItem: [46] // Delete
});

// DATA

const metaModel = ref([]);
const areNodesAsyncLoaded = ref(false);
const isMounted = ref(false);
const radioGroupValues = ref({});
const uniqueId = ref('');
const treeElement = ref(null); // ref in template

const { createMetaModel } = useNodeDataNormalizer();

// Initialize the tree state model with an object for each root node. The nodes
// will do the same for their subnodes during normalization.
model.value.forEach((node) => {
  metaModel.value.push(createMetaModel(node));
});

// COMPOSABLES

const { generateUniqueId } = useIdGeneration();

const { depthFirstTraverse } = useTreeViewTraversal(metaModel);

const {
  focusableNodeMetaModel,
  handleFocusableChange,
} = useTreeViewFocus();

const {
  focus,
  focusFirst,
  focusLast,
  focusNext,
  focusPrevious,
  isFocused,
  unfocus,
} = useFocus();

const {
  ariaMultiselectable,
  enforceSelectionMode,
  handleNodeSelectedChange,
} = useTreeViewSelection(metaModel, toRef(props, "selectionMode"), focusableNodeMetaModel, emit);

const {
  isSelectable,
  isSelected,
  select,
} = useSelection(toRef(props, "selectionMode"));

const {
  findById,
  getCheckedCheckboxes,
  getCheckedRadioButtons,
  getMatching,
  getSelected,
  removeById,
} = useTreeViewConvenienceMethods(model, metaModel, radioGroupValues, toRef(props, "selectionMode"));

const { dragMoveNode, drop } = useTreeViewDragAndDrop(model, metaModel, uniqueId, findById, removeById);

const { spliceNodeList } = useTreeViewDataUpdates(model, metaModel);

useTreeViewFilter(metaModel);

// Watch the model to make sure the metamodel is kept in sync
watch([model, model.value], () => {
  // WARNINGS: For whatever reason, the Storybook stories don't fire this watch when model is updated unless the
  // model.value is also included in the watch. This is a workaround for that issue. I have no idea why this is happening.
  // However, it also (rightly) adds warnings in the console that model.value is not a valid watch source.

  model.value.forEach((node, index) => {
    const metaIndex = metaModel.value.findIndex((m) => m.data[m.idProperty] === node[m.idProperty]);

    // If the indexes match, then the meta node is already in place and we can skip it.
    if (index !== metaIndex) {
      // Otherwise, if the node is not in the meta children, add it.
      if (metaIndex === -1) {
        metaModel.value.splice(index, 0, createMetaModel(node));
      }
      else {
        // If the node is in the meta children, but not in the right place, move it.
        metaModel.value.splice(index, 0, metaModel.value.splice(metaIndex, 1)[0]);
      }
    }
  });

  // If there are more meta children than data children, remove the extra meta children.
  if (metaModel.value.length > model.value.length) {
    metaModel.value.splice(model.value.length);
  }
});

// COMPUTED

const areNodesLoaded = computed(() => {
  return typeof props.loadNodesAsync !== 'function' || areNodesAsyncLoaded.value
});

const ariaKeyMap = computed(() =>
  Object.assign({}, defaultAriaKeyMap, props.customAriaKeyMap));

// HOOKS

onMounted(async () => {
  await performInitialNodeLoad();

  // If tree was unmounted before nodes were loaded, escape out.
  if (!treeElement.value) {
    return;
  }

  if (treeElement.value.id) {
    uniqueId.value = treeElement.value.id;
  }

  if (metaModel.value.length > 0) {
    // Walk the model looking for focusable attributes.
    // If none are found, set to true for the first root, or the first selected node if one exists.
    // If one is found, set any subsequent to false.
    let firstSelectedNode = null;
    depthFirstTraverse((metaNode) => {
      if (isFocused(metaNode)) {
        if (focusableNodeMetaModel.value) {
          unfocus(metaNode);
        }
        else {
          focusableNodeMetaModel.value = metaNode;
        }
      }
      if (props.selectionMode !== SelectionMode.None && firstSelectedNode === null && isSelected(metaNode)) {
        firstSelectedNode = metaNode;
      }
    });
    if (!focusableNodeMetaModel.value) {
      focusableNodeMetaModel.value = firstSelectedNode || metaModel.value[0];
      focus(focusableNodeMetaModel);
    }

    // Also default the selection to the focused node if no selected node was found
    // and the selection mode is selectionFollowsFocus.
    if (firstSelectedNode === null && isSelectable(focusableNodeMetaModel) && props.selectionMode === SelectionMode.SelectionFollowsFocus) {
      select(focusableNodeMetaModel);
    }

    enforceSelectionMode();
  }

  // Set isMounted in a nextTick so the focusable watcher
  // in treeViewNodeSelection.js fires before isMounted is set.
  // Otherwise, it steals focus when the tree is mounted.
  // Also wait to enforce single selection mode in case root
  // nodes load asynchronously so their create hooks fire.
  nextTick(() => {
    if (props.selectionMode === SelectionMode.Single) {
      enforceSelectionMode();
    }

    isMounted.value = true;
  });
});

// METHODS

/**
 * Performs any async loading for the initial (top-level) nodes.
 */
async function performInitialNodeLoad() {
  // If nodes need to be loaded asynchronously, load them.
  if (!areNodesLoaded.value) {
    var nodesResult = await props.loadNodesAsync();

    if (nodesResult) {
      areNodesAsyncLoaded.value = true;
      spliceNodeList(0, model.value.length, ...nodesResult);
      emit(TreeEvent.RootNodesLoad, model.value);
    }
  }
}

/**
 * Removes the given node from the array of children if found.
 * Note that only the node that was deleted fires these, not any subnode, so
 * this comes from a request from the child node for this node to delete it.
 * This emits the treeNodeDelete event.
 * @param {TreeViewNode} metaNode The meta node to remove
 */
function handleChildDeletion(metaNode) {
  let targetIndex = metaModel.value.indexOf(metaNode);
  if (targetIndex > -1) {
    handleNodeDeletion(metaNode);
    spliceNodeList(targetIndex, 1);
  }

  emit(TreeEvent.Delete, metaNode);
}

/**
 * Handles setting the focusable node in the tree when the
 * currently focuable node is deleted.
 * @param {TreeViewNode} metaNode The meta node that was deleted
 */
function handleNodeDeletion(metaNode) {
  if (isFocused(metaNode)) {
    if (metaModel.value.indexOf(metaNode) === 0) {
      if (metaModel.value.length > 0) {
        focusNext(metaModel.value, metaNode);
      }
    }
    else {
      focusPrevious(metaModel.value, metaNode);
    }
  }
}

// PROVIDE/INJECT

provide("filterMethod", toRef(props, 'filterMethod'));

// CREATION LOGIC

// Force a unique tree ID. This will generate a unique ID internally, but on mount
// it will be set to the element ID if one is present.
uniqueId.value = generateUniqueId();

// EXPOSE PUBLIC STUFF

defineExpose({
  getCheckedCheckboxes,
  getCheckedRadioButtons,
  getMatching,
  getSelected,
  metaModel,
});

</script>

<style>

  /* Embedded CSS is the 'grtv-default-skin' skin */
  .grtv-wrapper.grtv-default-skin > .grtv {
    margin: 0;
    padding: 0;
    list-style: none;
  }

</style>