<template>
  <div ref="treeElement" class="grtv-wrapper" :class="skinClass">
    <slot v-if="!areNodesLoaded" name="loading-root">

      <span class="grtv-loading">
        ...
      </span>
    </slot>
    <ul class="grtv" role="tree" :aria-multiselectable="ariaMultiselectable" v-if="areNodesLoaded">
      <TreeViewNode v-for="(nodeModel) in model"
        :key="nodeModel[nodeModel.treeNodeSpec?.idProperty ?? 'id']"
        :aria-key-map="ariaKeyMap"
        :depth="0"
        :model-defaults="modelDefaults"
        :initial-model="nodeModel"
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
        @treeNodeAriaRequestFirstFocus="(keepCurrentDomFocus) => focusFirst(model, keepCurrentDomFocus)"
        @treeNodeAriaRequestLastFocus="focusLast(model)"
        @treeNodeAriaRequestPreviousFocus="(t) => focusPrevious(model, t)"
        @treeNodeAriaRequestNextFocus="(t, f) => focusNext(model, t, f)"
        @treeNodeDragMove="dragMoveNode"
        @treeNodeDrop="drop">

        <template #checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
          <slot name="checkbox" :model="model" :customClasses="customClasses" :inputId="inputId"
            :checkboxChangeHandler="checkboxChangeHandler"></slot>
        </template>
        <template #radio="{ model, customClasses, inputId, radioGroupValues, radioChangeHandler }">
          <slot name="radio" :model="model" :customClasses="customClasses" :inputId="inputId"
            :radioGroupValues="radioGroupValues" :radioChangeHandler="radioChangeHandler"></slot>
        </template>
        <template #text="{ model, customClasses }">
          <slot name="text" :model="model" :customClasses="customClasses"></slot>
        </template>
        <template #loading="{ model, customClasses }">
          <slot name="loading" :model="model" :customClasses="customClasses"></slot>
        </template>
      </TreeViewNode>
    </ul>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, readonly, onMounted, provide, toRef } from 'vue'
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
  initialModel: {
    type: Array,
    required: false,
    default: function () { return []; }
  },
  loadNodesAsync: {
    type: Function,
    required: false,
    default: null
  },
  modelDefaults: {
    type: Object,
    required: false,
    default: function () { return {}; }
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

const areNodesAsyncLoaded = ref(false);
const isMounted = ref(false);
const model = ref(props.initialModel); // Using ref instead of toRef because this will get mutated (see end of https://vuejs.org/api/reactivity-utilities.html#toref)
const radioGroupValues = ref({});
const uniqueId = ref('');
const treeElement = ref(null); // ref in template

// COMPOSABLES

const { generateUniqueId } = useIdGeneration();

const { depthFirstTraverse } = useTreeViewTraversal(model);

const {
  focusableNodeModel,
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
} = useTreeViewSelection(model, toRef(props, "selectionMode"), focusableNodeModel, emit);

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
} = useTreeViewConvenienceMethods(model, radioGroupValues, toRef(props, "selectionMode"));

const { dragMoveNode, drop } = useTreeViewDragAndDrop(model, uniqueId, findById, removeById);

useTreeViewFilter(model);

// COMPUTED

const areNodesLoaded = computed(() => {
  return typeof props.loadNodesAsync !== 'function' || areNodesAsyncLoaded.value
});

const ariaKeyMap = computed(() =>
  Object.assign({}, defaultAriaKeyMap, props.customAriaKeyMap));

// HOOKS

onMounted(async () => {
  await performInitialNodeLoad();

  if (treeElement.value.id) {
    uniqueId.value = treeElement.value.id;
  }

  if (model.value.length > 0) {
    // Walk the model looking for focusable attributes.
    // If none are found, set to true for the first root, or the first selected node if one exists.
    // If one is found, set any subsequent to false.
    let firstSelectedNode = null;
    depthFirstTraverse((node) => {
      if (isFocused(node)) {
        if (focusableNodeModel.value) {
          unfocus(node);
        }
        else {
          focusableNodeModel.value = node;
        }
      }
      if (props.selectionMode !== SelectionMode.None && firstSelectedNode === null && isSelected(node)) {
        firstSelectedNode = node;
      }
    });

    if (!focusableNodeModel.value) {
      focusableNodeModel.value = firstSelectedNode || model.value[0];
      focus(focusableNodeModel);
    }

    // Also default the selection to the focused node if no selected node was found
    // and the selection mode is selectionFollowsFocus.
    if (firstSelectedNode === null && isSelectable(focusableNodeModel) && props.selectionMode === SelectionMode.SelectionFollowsFocus) {
      select(focusableNodeModel);
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
      model.value.splice(0, model.value.length, ...nodesResult);
      emit(TreeEvent.RootNodesLoad, model.value);
    }
  }
}

/**
 * Removes the given node from the array of children if found.
 * Note that only the node that was deleted fires these, not any subnode, so
 * this comes from a request from the child node for this node to delete it.
 * This emits the treeNodeDelete event.
 * @param {TreeViewNode} node The node to remove
 */
function handleChildDeletion(node) {
  let targetIndex = model.value.indexOf(node);
  if (targetIndex > -1) {
    handleNodeDeletion(node);
    model.value.splice(targetIndex, 1);
  }

  emit(TreeEvent.Delete, node);
}

/**
 * Handles setting the focusable node in the tree when the
 * currently focuable node is deleted.
 * @param {TreeViewNode} node The node that was deleted
 */
function handleNodeDeletion(node) {
  if (isFocused(node)) {
    if (model.value.indexOf(node) === 0) {
      if (model.value.length > 0) {
        focusNext(model.value, node);
      }
    }
    else {
      focusPrevious(model.value, node);
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