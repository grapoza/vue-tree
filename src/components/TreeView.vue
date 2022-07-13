<template>
  <div ref="treeElement" class="grtv-wrapper" :class="skinClass">
    <slot v-if="!areNodesLoaded" name="loading-root">

      <span class="grtv-loading">
        ...
      </span>
    </slot>
    <ul class="grtv" role="tree" :aria-multiselectable="ariaMultiselectable" v-if="areNodesLoaded">
      <TreeViewNode v-for="(nodeModel) in model"
        :key="nodeModel[nodeModel.treeNodeSpec && nodeModel.treeNodeSpec.idProperty ? nodeModel.treeNodeSpec.idProperty : 'id']"
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
        @treeNodeRadioChange="(t, e)=>$emit(TreeEvent.RadioChange, t, e)"
        @treeNodeExpandedChange="(t, e)=>$emit(TreeEvent.ExpandedChange, t, e)"
        @treeNodeChildrenLoad="(t, e)=>$emit(TreeEvent.ChildrenLoad, t, e)"
        @treeNodeSelectedChange="handleNodeSelectedChange"
        @treeNodeAdd="(t, p, e)=>$emit(TreeEvent.Add, t, p, e)"
        @treeNodeDelete="handleChildDeletion"
        @treeNodeAriaFocusableChange="handleFocusableChange"
        @treeNodeAriaRequestFirstFocus="focusFirstNode"
        @treeNodeAriaRequestLastFocus="focusLastNode"
        @treeNodeAriaRequestPreviousFocus="handlePreviousFocus"
        @treeNodeAriaRequestNextFocus="handleNextFocus"
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
import { computed, nextTick, ref, onMounted, watch } from 'vue'
import InputType from '../enums/inputType.js';
import SelectionMode from '../enums/selectionMode.js';
import { useIdGeneration } from '../composables/idGeneration.js'
import { useTreeViewAria } from '../composables/treeViewAria.js';
import { useTreeViewDragAndDrop } from '../composables/treeViewDragAndDrop.js';
import TreeViewNode from './TreeViewNode.vue';
import TreeEvent from '../enums/event';

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
  TreeEvent.Click,
  TreeEvent.Delete,
  TreeEvent.DoubleClick,
  TreeEvent.ExpandedChange,
  TreeEvent.RadioChange,
  TreeEvent.RootNodesLoad,
  TreeEvent.SelectedChange
]);

// DATA

const areNodesAsyncLoaded = ref(false);
const isMounted = ref(false);
const model = ref(props.initialModel);
const radioGroupValues = ref({});
const uniqueId = ref('');
const treeElement = ref(null); // ref in template

// COMPOSABLES

const { generateUniqueId } = useIdGeneration();

const {
  ariaKeyMap,
  enforceSelectionMode,
  handleFocusableChange,
  focusFirstNode,
  focusLastNode,
  handleNodeDeletion,
  handlePreviousFocus,
  handleNextFocus } = useTreeViewAria(model, props.customAriaKeyMap, props.selectionMode, depthFirstTraverse, enforceSingleSelectionMode);

const { dragMoveNode, drop } = useTreeViewDragAndDrop(model, uniqueId, findById, removeById);

// WATCHER

watch(() => props.selectionMode, enforceSelectionMode)

// COMPUTED

const areNodesLoaded = computed(() => {
  return typeof props.loadNodesAsync !== 'function' || areNodesAsyncLoaded.value
});

const ariaMultiselectable = computed(() => {
  // If there's no selectionMode, return null so aria-multiselectable isn't included.
  // Otherwise, return either true or false as the attribute's value.
  return props.selectionMode === SelectionMode.None ? null : props.selectionMode === SelectionMode.Multiple;
});

// HOOKS

onMounted(async () => {
  await performInitialNodeLoad();

  if (treeElement.value.id) {
    uniqueId.value = treeElement.value.id;
  }

  // Set isMounted in a nextTick so the focusable watcher
  // in TreeViewNodeAria fires before isMounted is set.
  // Otherwise, it steals focus when the tree is mounted.
  // Also wait to enforce single selection mode in case root
  // nodes load asynchronously so their create hooks fire.
  nextTick(() => {
    enforceSingleSelectionMode();
    isMounted.value = true;
  });
});

// METHODS

/**
 * Gets any nodes with checked checkboxes.
 * @returns {Array<TreeViewNode>} An array of any nodes with checked checkboxes
 */
function getCheckedCheckboxes() {
  return getMatching((current) =>
    current.treeNodeSpec.input
    && current.treeNodeSpec.input.type === InputType.Checkbox
    && current.treeNodeSpec.state.input.value);
}

/**
 * Gets any nodes with checked checkboxes.
 * @returns {Array<TreeViewNode>} An array of any nodes with checked checkboxes
 */
function getCheckedRadioButtons() {
  return getMatching((current) =>
    current.treeNodeSpec.input
    && current.treeNodeSpec.input.type === InputType.RadioButton
    && radioGroupValues.value[current.treeNodeSpec.input.name] === current.treeNodeSpec.input.value);
}

/**
 * Gets any nodes matched by the given function.
 * @param matcherFunction {function} A function which takes a node as an argument
 * and returns a boolean indicating a match for some condition
 * @returns {Array<TreeNode>} An array of any nodes matched by the given function
 */
function getMatching(matcherFunction) {
  let matches = [];

  if (typeof matcherFunction === 'function') {
    depthFirstTraverse((current) => {
      if (matcherFunction(current)) {
        matches.push(current);
      }
    });
  }

  return matches;
}

/**
 * Gets any selected nodes
 * @returns {TreeViewNode[]} An array of any selected nodes
 */
function getSelected() {
  return props.selectionMode === SelectionMode.None
    ? []
    : getMatching((current) => current.treeNodeSpec.selectable && current.treeNodeSpec.state.selected);
}

/**
 * Gets the node with the given ID
 * @param targetId {string} The ID of the node to find
 * @returns {TreeNode} The node with the given ID if found, or null
 */
function findById(targetId) {
  let node = null;

  if (typeof targetId === 'string') {
    // Do a quick check to see if it's at the root level
    node = model.value.find(n => n[n.treeNodeSpec.idProperty] === targetId);

    if (!node) {
      depthFirstTraverse((current) => {
        let children = current[current.treeNodeSpec.childrenProperty];
        node = children.find(n => n[n.treeNodeSpec.idProperty] === targetId);
        if (node) {
          return false;
        }
      });
    }
  }

  return node;
}

/**
 * Traverses the tree depth-first and performs a callback action against each node.
 * @param nodeActionCallback {function} The action to call against each node, taking that node as a parameter
 */
function depthFirstTraverse(nodeActionCallback) {
  if (model.value.length === 0) {
    return;
  }

  let nodeQueue = model.value.slice();
  let continueCallbacks = true;

  while (nodeQueue.length > 0 && continueCallbacks !== false) {
    let current = nodeQueue.shift();

    // Push children to the front (depth first traversal)
    let childrenPropName = current.treeNodeSpec.childrenProperty;
    if (Array.isArray(current[childrenPropName])) {
      nodeQueue = current[childrenPropName].concat(nodeQueue);
    }

    // Use a return value of false to halt calling the callback on further nodes.
    continueCallbacks = nodeActionCallback(current);
  }
}

/**
 * Enforce single selection mode by deselecting anything except
 * the first (by depth-first) selected node.
 */
function enforceSingleSelectionMode() {
  // For single selection mode, only allow one selected node.
  if (props.selectionMode === SelectionMode.Single) {
    let alreadyFoundSelected = false;
    depthFirstTraverse((node) => {
      if (node.treeNodeSpec.state && node.treeNodeSpec.state.selected === true) {
        if (alreadyFoundSelected) {
          node.treeNodeSpec.state.selected = false;
        }
        else {
          alreadyFoundSelected = true;
        }
      }
    });
  }
}

/**
 * For single selection mode, unselect any other selected node.
 * For selectionFollowsFocus mode for TreeView, selection state is handled in TreeViewAria.handleFocusableChange.
 * In all cases this emits treeNodeSelectedChange for the node parameter.
 * @param node {TreeViewNode} The node for which selection changed
 * @param event {Event} The initial event that triggered the change
 */
function handleNodeSelectedChange(node, event) {
  if (props.selectionMode === SelectionMode.Single && node.treeNodeSpec.state.selected) {
    depthFirstTraverse((current) => {
      if (current.treeNodeSpec.state.selected && current.id !== node.id) {
        current.treeNodeSpec.state.selected = false;
        return false;
      }
      return true;
    });
  }

  emit(TreeEvent.SelectedChange, node, event);
}

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
 * Removes and returns the node with the given ID
 * @param targetId {string} The ID of the node to remove
 * @returns {TreeViewNode} The node with the given ID if removed, or null
 */
function removeById(targetId) {
  let node = null;

  if (typeof targetId === 'string') {
    // Do a quick check to see if it's at the root level
    let nodeIndex = model.value.findIndex(n => n[n.treeNodeSpec.idProperty] === targetId);

    if (nodeIndex > -1) {
      node = model.value.splice(nodeIndex, 1)[0];
    }
    else {
      depthFirstTraverse((current) => {
        // See if this node has a child that matches
        let children = current[current.treeNodeSpec.childrenProperty];
        nodeIndex = children.findIndex(n => n[n.treeNodeSpec.idProperty] === targetId);
        if (nodeIndex > -1) {
          node = children.splice(nodeIndex, 1)[0];
          return false;
        }
      });
    }
  }

  return node;
}

/**
 * Removes the given node from the array of children if found.
 * Note that only the node that was deleted fires these, not any subnode, so
 * this comes from a request from the child node for this node to delete it.
 * This emits the treeNodeDelete event.
 * @param node {TreeViewNode} The node to remove
 * @param event {Event} The initial event that triggered the deletion
 */
function handleChildDeletion(node, event) {
  let targetIndex = model.value.indexOf(node);
  if (targetIndex > -1) {
    handleNodeDeletion(node);
    model.value.splice(targetIndex, 1);
  }

  emit(TreeEvent.Delete, node, event);
}

// CREATION LOGIC

// Force a unique tree ID. This will generate a unique ID internally, but on mount
// it will be set to the element ID if one is present.
uniqueId.value = generateUniqueId();

// EXPOSE PUBLIC STUFF

defineExpose({
  getCheckedCheckboxes,
  getCheckedRadioButtons,
  getMatching,
  getSelected
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