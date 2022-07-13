<template>
  <!--
      A Component meant to be used internally by the TreeView component. See the documentation
      for a description of the expected data format.
  -->
  <li :id="nodeId"
      ref="nodeElement"
      class="grtvn"
      :class="[customClasses.treeViewNode,
               tns._.dragging ? 'grtvn-dragging' : '']"
      role="treeitem"
      :tabindex="ariaTabIndex"
      :aria-expanded="ariaExpanded"
      :aria-selected="ariaSelected"
      @keydown="onKeyDown">

    <div class="grtvn-self"
         :class="[customClasses.treeViewNodeSelf,
                  isEffectivelySelected ? 'grtvn-self-selected' : '',
                  isEffectivelySelected ? customClasses.treeViewNodeSelfSelected : '',
                  tns._.isDropTarget ? 'grtvn-self-drop-target': '',
                  tns._.isChildDropTarget ? 'grtvn-self-child-drop-target': '']"
         :draggable="tns.draggable"
         :dragging="tns._.dragging"
         @click="onClick"
         @dblclick="onDblclick"
         @dragend="onDragend"
         @dragenter="onDragenter"
         @dragleave="onDragleave"
         @dragover="onDragover"
         @dragstart="onDragstart"
         @drop="onDrop">

      <!-- Top Drop Target -->
      <div class="grtvn-self-sibling-drop-target grtvn-self-prev-target"
           :class="[tns._.isPrevDropTarget ? 'grtvn-self-sibling-drop-target-hover': '']"></div>

      <!-- Expander -->
      <button :id="expanderId"
              type="button"
              v-if="canExpand"
              aria-hidden="true"
              tabindex="-1"
              :title="tns.expanderTitle"
              class="grtvn-self-expander"
              :class="[customClasses.treeViewNodeSelfExpander,
                       tns.state.expanded ? 'grtvn-self-expanded' : '',
                       tns.state.expanded ? customClasses.treeViewNodeSelfExpanded : '']"
              @click="onExpandedChange">
              <i class="grtvn-self-expanded-indicator"
                 :class="customClasses.treeViewNodeSelfExpandedIndicator"></i></button>
      <span v-else
            class="grtvn-self-spacer"
            :class="customClasses.treeViewNodeSelfSpacer"></span>

      <!-- Inputs and labels -->
      <!-- Checkbox -->
      <slot v-if="tns.input && tns.input.type === 'checkbox'"
            name="checkbox"
            :model="model"
            :customClasses="customClasses"
            :inputId="inputId"
            :checkboxChangeHandler="onCheckboxChange">

        <label :for="inputId"
               :title="tns.title"
               class="grtvn-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 tabindex="-1"
                 class="grtvn-self-input grtvn-self-checkbox"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfCheckbox]"
                 type="checkbox"
                 :disabled="tns.state.input.disabled"
                 v-model="tns.state.input.value"
                 @change="onCheckboxChange" />

          {{ label }}
        </label>
      </slot>

      <!-- Radiobutton -->
      <slot v-else-if="tns.input && tns.input.type === 'radio'"
            name="radio"
            :model="model"
            :customClasses="customClasses"
            :inputId="inputId"
            :radioGroupValues="radioGroupValues"
            :radioChangeHandler="onRadioChange">

        <label :for="inputId"
               :title="tns.title"
               class="grtvn-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 tabindex="-1"
                 class="grtvn-self-input grtvn-self-radio"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfRadio]"
                 type="radio"
                 :name="tns.input.name"
                 :value="tns.input.value"
                 :disabled="tns.state.input.disabled"
                 v-model="radioGroupValues[tns.input.name]"
                 @change="onRadioChange" />

          {{ label }}
        </label>
      </slot>

      <!-- Text (if not an input) -->
      <slot v-else
            name="text"
            :model="model"
            :customClasses="customClasses">

        <span :title="tns.title"
              class="grtvn-self-text"
              :class="customClasses.treeViewNodeSelfText">
          {{ label }}
        </span>
      </slot>

      <!-- Add Child button -->
      <button :id="addChildId"
              type="button"
              v-if="tns.addChildCallback"
              aria-hidden="true"
              tabindex="-1"
              :title="tns.addChildTitle"
              class="grtvn-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfAddChild]"
              @click="onAddChild">
        <i class="grtvn-self-add-child-icon"
            :class="customClasses.treeViewNodeSelfAddChildIcon"></i>
      </button>

      <!-- Delete button -->
      <button :id="deleteId"
              type="button"
              v-if="tns.deletable"
              aria-hidden="true"
              tabindex="-1"
              :title="tns.deleteTitle"
              class="grtvn-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfDelete]"
              @click="onDelete">
        <i class="grtvn-self-delete-icon"
            :class="customClasses.treeViewNodeSelfDeleteIcon"></i>
      </button>

      <!-- Bottom Drop Target -->
      <div class="grtvn-self-sibling-drop-target grtvn-self-next-target"
           :class="[tns._.isNextDropTarget ? 'grtvn-self-sibling-drop-target-hover': '']"></div>
    </div>

    <!-- Children and Loading Placholder -->
    <div class="grtvn-children-wrapper"
            :class="customClasses.treeViewNodeChildrenWrapper">
      <slot v-if="tns.state.expanded && !areChildrenLoaded"
            name="loading"
            :model="model"
            :customClasses="customClasses">

        <span class="grtvn-loading"
              :class="customClasses.treeViewNodeLoading">
          ...
        </span>
      </slot>
      <ul v-show="tns.state.expanded"
          v-if="hasChildren"
          class="grtvn-children"
          :class="customClasses.treeViewNodeChildren"
          role="group"
          :aria-hidden="!tns.state.expanded">
        <TreeViewNode v-for="nodeModel in children"
                      :key="nodeModel[tns && tns.idProperty ? tns.idProperty : 'id']"
                      :depth="depth + 1"
                      :initial-model="nodeModel"
                      :model-defaults="modelDefaults"
                      :parent-id="id"
                      :selection-mode="selectionMode"
                      :tree-id="treeId"
                      :initial-radio-group-values="radioGroupValues"
                      :aria-key-map="ariaKeyMap"
                      :is-mounted="isMounted"
                      @treeNodeClick="(t, e)=>$emit(TreeEvent.Click, t, e)"
                      @treeNodeDblclick="(t, e)=>$emit(TreeEvent.DoubleClick, t, e)"
                      @treeNodeCheckboxChange="(t, e)=>$emit(TreeEvent.CheckboxChange, t, e)"
                      @treeNodeRadioChange="(t, e)=>$emit(TreeEvent.RadioChange, t, e)"
                      @treeNodeExpandedChange="(t, e)=>$emit(TreeEvent.ExpandedChange, t, e)"
                      @treeNodeChildrenLoad="(t, e)=>$emit(TreeEvent.ChildrenLoad, t, e)"
                      @treeNodeSelectedChange="(t, e)=>$emit(TreeEvent.SelectedChange, t, e)"
                      @treeNodeAdd="(t, p, e)=>$emit(TreeEvent.Add, t, p, e)"
                      @treeNodeDelete="handleChildDeletion"
                      @treeNodeAriaFocusableChange="(t)=>$emit(TreeEvent.FocusableChange, t)"
                      @treeNodeAriaRequestParentFocus="()=>focusNode(model)"
                      @treeNodeAriaRequestFirstFocus="()=>$emit(TreeEvent.RequestFirstFocus)"
                      @treeNodeAriaRequestLastFocus="()=>$emit(TreeEvent.RequestLastFocus)"
                      @treeNodeAriaRequestPreviousFocus="handlePreviousFocus"
                      @treeNodeAriaRequestNextFocus="handleNextFocus"
                      @treeNodeDragMove="dragMoveChild"
                      @treeNodeDrop="drop">
          <template #checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
            <slot name="checkbox" :model="model" :customClasses="customClasses" :inputId="inputId" :checkboxChangeHandler="checkboxChangeHandler"></slot>
          </template>
          <template #radio="{ model, customClasses, inputId, radioGroupValues, radioChangeHandler }">
            <slot name="radio" :model="model" :customClasses="customClasses" :inputId="inputId" :radioGroupValues="radioGroupValues" :radioChangeHandler="radioChangeHandler"></slot>
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
  </li>
</template>

<script setup>

import { computed, ref, watch } from 'vue'
import { useNodeDataNormalizer } from '../composables/nodeDataNormalizer.js';
import { useTreeViewNodeAria } from '../composables/treeViewNodeAria.js';
import { useTreeViewNodeDragAndDrop } from '../composables/treeViewNodeDragAndDrop.js';
import {  useTreeViewFocus } from '../composables/treeViewFocus.js';
import SelectionMode from '../enums/selectionMode';
import TreeEvent from '../enums/event';

// PROPS

const props = defineProps({
  ariaKeyMap: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    required: true
  },
  initialModel: {
    type: Object,
    required: true
  },
  initialRadioGroupValues: {
    type: Object,
    required: true
  },
  isMounted: {
    type: Boolean,
    required: true
  },
  modelDefaults: {
    type: Object,
    required: true
  },
  selectionMode: {
    type: String,
    required: false,
    default: SelectionMode.None,
    validator: function (value) {
      return Object.values(SelectionMode).includes(value);
    }
  },
  treeId: {
    type: String,
    required: true
  }
});

// EMITS

const emit = defineEmits([
  TreeEvent.Add,
  TreeEvent.Click,
  TreeEvent.CheckboxChange,
  TreeEvent.ChildrenLoad,
  TreeEvent.Delete,
  TreeEvent.DoubleClick,
  TreeEvent.DragMove,
  TreeEvent.Drop,
  TreeEvent.ExpandedChange,
  TreeEvent.FocusableChange,
  TreeEvent.RadioChange,
  TreeEvent.RequestFirstFocus,
  TreeEvent.RequestLastFocus,
  TreeEvent.RequestNextFocus,
  TreeEvent.RequestParentFocus,
  TreeEvent.RequestPreviousFocus,
  TreeEvent.SelectedChange
]);

// DATA

const elementsThatIgnoreClicks = 'input, .grtvn-self-expander, .grtvn-self-expander *, .grtvn-self-action, .grtvn-self-action *';
const model = ref(props.initialModel);

const radioGroupValues = ref(props.initialRadioGroupValues);
const nodeElement = ref(null); // template ref

// COMPUTED

const addChildId = computed(() => `${nodeId.value}-add-child`);

const areChildrenLoaded = computed(() => typeof tns.value.loadChildrenAsync !== 'function' || tns.value._.state.areChildrenLoaded);

const ariaExpanded = computed(() => canExpand.value ? tns.value.state.expanded : null);

const ariaSelected = computed(() => {
  // If selection isn't allowed, don't add an aria-selected attribute.
  // If the tree contains nodes that are not selectable, those nodes do not have the aria-selected state.
  if (props.selectionMode === SelectionMode.None || !tns.value.selectable) {
    return null;
  }

  // https://www.w3.org/TR/wai-aria-practices-1.1/#tree_roles_states_props
  // If the tree does not support multiple selection, aria-selected is set to true
  // for the selected node and it is not present on any other node in the tree.
  if (props.selectionMode !== SelectionMode.Multiple) {
    return tns.value.state.selected ? true : null;
  }

  // If the tree supports multiple selection:
  //   All selected nodes have aria-selected set to true.
  //   All nodes that are selectable but not selected have aria-selected set to false.
  return tns.value.state.selected;
});

const canExpand = computed(() => {
  // A node can be expanded if it is expandable and either has children or has not
  // yet had the asynchronous loader for children called.
  return mayHaveChildren.value && tns.value.expandable;
});

const children = computed(() => model.value[childrenPropName.value]);

const childrenPropName = computed(() => tns.value.childrenProperty || 'children');

const customClasses = computed(() => (tns.value.customizations || {}).classes || {});

const deleteId = computed(() => `${nodeId.value}-delete`);

const expanderId = computed(() => `${nodeId.value}-exp`);

const hasChildren = computed(() => children.value && children.value.length > 0);

const id = computed(() => model.value[idPropName.value]);

const idPropName = computed(() => tns.value.idProperty || 'id');

const inputId = computed(() => `${nodeId.value}-input`);

const isEffectivelySelected = computed(() => props.selectionMode !== SelectionMode.None && tns.value.selectable && tns.value.state.selected);

const label = computed(() => model.value[labelPropName.value]);

const labelPropName = computed(() => tns.value.labelProperty || 'label');

const mayHaveChildren = computed(() => hasChildren.value || !areChildrenLoaded.value);

const nodeId = computed(() => `${props.treeId}-${id.value}`);

const tns = computed(() => model.value.treeNodeSpec);

const treeId = computed(() => props.treeId);

// COMPOSABLES

const { normalizeNodeData } = useNodeDataNormalizer(model, props.modelDefaults, children, childrenPropName, label, radioGroupValues);

normalizeNodeData();

const {
  ariaTabIndex,
  handleChildDeletion: handleChildDeletionAria,
  onClick: onClickAria,
  onKeyDown,
  handlePreviousFocus,
  handleNextFocus
} = useTreeViewNodeAria(props.ariaKeyMap, model, children, mayHaveChildren, canExpand, nodeElement, onDelete, toggleSelected, onExpandedChange, onAddChild, emit);

const {
  dragMoveChild,
  drop,
  onDragstart,
  onDragenter,
  onDragover,
  onDragleave,
  onDrop,
  onDragend
} = useTreeViewNodeDragAndDrop(model, children, treeId, emit)

const {
  focusNode
} = useTreeViewFocus();

// METHODS

/**
 * Pass the event for checkbox changes up from the node.
 * Emits a treeNodeCheckboxChange event
 * @param {Event} event The event that triggered the change
 */
function onCheckboxChange(event) {
  emit(TreeEvent.CheckboxChange, model.value, event);
}

/**
 * Pass the event for radio button changes up from the node.
 * Emits a treeNodeRadioChange event
 * @param {Event} event The event that triggered the change
 */
function onRadioChange(event) {
  emit(TreeEvent.RadioChange, model.value, event);
}

/**
 * Expand the children of this node, starting an asynchronous load if needed.
 * Emits a treeNodeExpandedChange event. When children are loaded asynchronously,
 * Emits a treeNodeChildrenLoad event.
 * @param {Event} event The event that triggered the expansion toggle
 */
async function onExpandedChange(event) {
  let spec = tns.value;

  // First expand the node (to show either children or a "loading" indicator)
  spec.state.expanded = !spec.state.expanded;
  emit(TreeEvent.ExpandedChange, model.value, event);

  // If children need to be loaded asynchronously, load them.
  if (spec.state.expanded && !spec._.state.areChildrenLoaded && !spec._.state.areChildrenLoading) {

    spec._.state.areChildrenLoading = true;
    var childrenResult = await spec.loadChildrenAsync(model.value);

    if (childrenResult) {
      spec._.state.areChildrenLoaded = true;
      children.value.splice(0, children.value.length, ...childrenResult);
      emit(TreeEvent.ChildrenLoad, model.value, event);
    }

    spec._.state.areChildrenLoading = false;
  }
}

/**
 * Handle toggling the selected state for this node for Single and Multiple selection modes.
 * Note that for SelectionFollowsFocus mode the selection change is already handled by the
 * "model.treeNodeSpec.focusable" watcher method in TreeViewNodeAria.
 * @param {Event} event The event that triggered the selection toggle
 */
function toggleSelected(event) {
  if (tns.value.selectable && [SelectionMode.Single, SelectionMode.Multiple].includes(props.selectionMode)) {
    tns.value.state.selected = !tns.value.state.selected;
  }
}

/**
 * Handles clicks on the node. It only performs actions if the click happened on an element
 * that does not have node clicks explicitly ingored (e.g., the expander button).
 * Emits a treeNodeClick event.
 * @param {Event} event The click event
 */
function onClick(event) {
  // Don't fire this if the target is an element which has its own events
  if (!event.target.matches(elementsThatIgnoreClicks)) {
    emit(TreeEvent.Click, model.value, event);
    toggleSelected(event);
  }

  onClickAria();
}

/**
 * Handles double clicks on the node. It only performs actions if the double click happened on an
 * element that does not have node clicks explicitly ingored (e.g., the expander button).
 * Emits a treeNodeDblclick event.
 * @param {Event} event The dblclick event
 */
function onDblclick(event) {
  // Don't fire this if the target is an element which has its own events
  if (!event.target.matches(elementsThatIgnoreClicks)) {
    emit(TreeEvent.DoubleClick, model.value, event);
  }
}

/**
 * Add a child node to the end of the child nodes list. The child node data is
 * supplied by an async callback which is the addChildCallback parameter of this node's model.
 * Emits a treeNodeAdd if a node is added
 * @param {Event} event The event that triggered the add
 */
async function onAddChild(event) {
  if (tns.value.addChildCallback) {
    var childModel = await tns.value.addChildCallback(model.value);

    if (childModel) {
      children.value.push(childModel);
      emit(TreeEvent.Add, childModel, model.value, event);
    }
  }
}

function onDelete(event) {
  if (tns.value.deletable) {
    emit(TreeEvent.Delete, model.value, event);
  }
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
  // Remove the node from the array of children if this is an immediate child.
  // Note that only the node that was deleted fires these, not any subnode.
  let targetIndex = children.value.indexOf(node);
  if (targetIndex > -1) {
    handleChildDeletionAria(node);
    children.value.splice(targetIndex, 1);
  }

  emit(TreeEvent.Delete, node, event);
}

// CREATION LOGIC

// id and label are required; notify the user. Validation is done here instead
// of at the prop level due to dependency on multiple props at once and defaulting
// that takes place in the normalization process
if (!id.value || (typeof id.value !== 'number' && typeof id.value !== 'string')) {
  console.error(`initialModel id is required and must be a number or string. Expected prop ${idPropName.value} to exist on the model.`);
}

if (!label.value || typeof label.value !== 'string') {
  console.error(`initialModel label is required and must be a string. Expected prop ${labelPropName.value} to exist on the model.`);
}

// WATCHERS

watch(() => model.value.treeNodeSpec.state.selected, function () {
  emit(TreeEvent.SelectedChange, model.value);
});

watch(() => tns.value.focusable, function (newValue) {
  if (newValue === true) {
    // If focusable is set to true and the tree is mounted in the DOM,
    // also focus the node's element.
    if (props.isMounted) {
      nodeElement.value.focus();
    }
    emit(TreeEvent.FocusableChange, model.value);
  }

  // In selectionFollowsFocus selection mode, this focus watch is responsible for updating selection.
  if (tns.value.selectable && props.selectionMode === SelectionMode.SelectionFollowsFocus) {
    tns.value.state.selected = newValue;
  }
});

</script>

<style>

  /* Everything's in a .grtv-wrapper (embedded CSS is the 'grtv-default-skin' skin) */
  .grtv-wrapper.grtv-default-skin {
    --baseHeight: 1.2rem;
    --itemSpacing: 1.2rem;
  }

  /* The node, including its content and children list */
  .grtv-wrapper.grtv-default-skin .grtvn {
    padding-left: 0;
  }

  .grtv-wrapper.grtv-default-skin .grtvn:first-child {
    margin-top: 0;
  }

  /* ARIA styles */
  .grtv-wrapper.grtv-default-skin .grtvn[role="treeitem"]:focus {
    outline: 0;
  }

  .grtv-wrapper.grtv-default-skin .grtvn[role="treeitem"]:focus >.grtvn-self {
    outline: black dotted 1px;
  }

  /* The node's content, excluding the list of child nodes */
  .grtv-wrapper.grtv-default-skin .grtvn-self {
    display: flex;
    align-items: flex-start;
    line-height: var(--baseHeight);
  }

  /* Drag and Drop styles */
  .grtv-wrapper.grtv-default-skin .grtvn-dragging .grtvn-self {
    opacity: 0.5;
  }

  .grtv-wrapper.grtv-default-skin .grtvn-self-drop-target {
    flex-wrap: wrap;
  }

  .grtv-wrapper.grtv-default-skin .grtvn-self-drop-target.grtvn-self-child-drop-target {
    opacity: .5;
  }

  .grtv-wrapper.grtv-default-skin .grtvn-self-drop-target .grtvn-self-sibling-drop-target {
    width: 100%;
    height: 7px;
    background-color: #dddddd;
  }

  .grtv-wrapper.grtv-default-skin .grtvn-self-drop-target .grtvn-self-sibling-drop-target.grtvn-self-sibling-drop-target-hover {
    background-color: #bbbbbb;
  }

  /* The expander button and indicator content */
  .grtv-wrapper.grtv-default-skin .grtvn-self-expander {
    padding: 0;
    background: none;
    border: none;
    height: var(--baseHeight);
  }

  .grtv-wrapper.grtv-default-skin .grtvn-self-expander i.grtvn-self-expanded-indicator {
    font-style: normal;
  }

  .grtv-wrapper.grtv-default-skin .grtvn-self-expander i.grtvn-self-expanded-indicator::before {
    content: '+';
  }

  .grtv-wrapper.grtv-default-skin .grtvn-self-expander.grtvn-self-expanded i.grtvn-self-expanded-indicator::before {
    content: '-';
  }

  /* The styling for when the node is selected */
  .grtv-wrapper.grtv-default-skin .grtvn-self-selected {
    background-color: #f0f0f8;
  }

  /* Spacing */
  .grtv-wrapper.grtv-default-skin .grtvn-self-expander,
  .grtv-wrapper.grtv-default-skin .grtvn-self-checkbox,
  .grtv-wrapper.grtv-default-skin .grtvn-self-radio,
  .grtv-wrapper.grtv-default-skin .grtvn-self-spacer,
  .grtv-wrapper.grtv-default-skin .grtvn-self-action {
    min-width: 1rem;
  }

  .grtv-wrapper.grtv-default-skin .grtvn-self-expander,
  .grtv-wrapper.grtv-default-skin .grtvn-self-spacer {
    margin: 0;
  }

  .grtv-wrapper.grtv-default-skin .grtvn-self-checkbox,
  .grtv-wrapper.grtv-default-skin .grtvn-self-radio {
    margin: 0 0 0 calc(-1 * var(--itemSpacing));
  }

  .grtv-wrapper.grtv-default-skin .grtvn-self-text,
  .grtv-wrapper.grtv-default-skin .grtvn-self-label {
    margin-left: var(--itemSpacing);
  }

  /* Action buttons section */
  .grtv-wrapper.grtv-default-skin .grtvn-self-action {
    padding: 0;
    background: none;
    border: none;
    height: var(--baseHeight);
  }

  /* Action buttons (add, delete, etc) */
  .grtv-wrapper.grtv-default-skin i.grtvn-self-add-child-icon {
    font-style: normal;
  }

  .grtv-wrapper.grtv-default-skin i.grtvn-self-add-child-icon::before {
    content: '+';
  }

  .grtv-wrapper.grtv-default-skin i.grtvn-self-delete-icon {
    font-style: normal;
  }

  .grtv-wrapper.grtv-default-skin i.grtvn-self-delete-icon::before {
    content: 'x';
  }

  .grtv-wrapper.grtv-default-skin .grtvn-children-wrapper {
    margin: 0 0 0 calc(1rem + var(--itemSpacing));
  }

  /* The node's child list */
  .grtv-wrapper.grtv-default-skin .grtvn-children {
    padding: 0;
    list-style: none;
  }
</style>
