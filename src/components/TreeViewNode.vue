<template>
  <!--
      A Component meant to be used internally by the TreeView component. See the documentation
      for a description of the expected data format.
  -->
  <li :id="nodeId"
      ref="nodeElement"
      class="grtvn"
      :class="[
        customClasses.treeViewNode,
        tns._.dragging ? 'grtvn-dragging' : '',
        filterIncludesNode ? '' : 'grtvn-hidden'
      ]"
      role="treeitem"
      :tabindex="tabIndex"
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
              @click="toggleNodeExpanded">
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
              @click="addChild">
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
                      :key="nodeModel[nodeModel.treeNodeSpec?.idProperty ?? 'id']"
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
                      @treeNodeCheckboxChange="handleCheckboxChange"
                      @treeNodeChildCheckboxChange="(t, c, e)=>$emit(TreeEvent.ChildCheckboxChange, t, c, e)"
                      @treeNodeRadioChange="(t, e)=>$emit(TreeEvent.RadioChange, t, e)"
                      @treeNodeExpandedChange="(t)=>$emit(TreeEvent.ExpandedChange, t)"
                      @treeNodeChildrenLoad="(t)=>$emit(TreeEvent.ChildrenLoad, t)"
                      @treeNodeSelectedChange="(t)=>$emit(TreeEvent.SelectedChange, t)"
                      @treeNodeAdd="(t, p)=>$emit(TreeEvent.Add, t, p)"
                      @treeNodeDelete="handleChildDeletion"
                      @treeNodeAriaFocusableChange="(t)=>$emit(TreeEvent.FocusableChange, t)"
                      @treeNodeAriaRequestParentFocus="()=>focusNode()"
                      @treeNodeAriaRequestFirstFocus="(keepCurrentDomFocus)=>$emit(TreeEvent.RequestFirstFocus, keepCurrentDomFocus)"
                      @treeNodeAriaRequestLastFocus="()=>$emit(TreeEvent.RequestLastFocus)"
                      @treeNodeAriaRequestPreviousFocus="focusPreviousNode"
                      @treeNodeAriaRequestNextFocus="focusNextNode"
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

import { computed, ref, toRef } from 'vue'
import { useTreeViewNodeDataNormalizer } from '../composables/normalization/treeViewNodeDataNormalizer.js';
import { useTreeNodeChildren } from '../composables/children/treeNodeChildren.js';
import { useTreeViewNodeDragAndDrop } from '../composables/dragDrop/treeViewNodeDragAndDrop.js';
import { useFocus } from '../composables/focus/focus.js';
import { useTreeViewNodeFocus } from '../composables/focus/treeViewNodeFocus.js';
import { useTreeViewNodeSelection } from '../composables/selection/treeViewNodeSelection.js';
import { useTreeNodeExpansion } from '../composables/expansion/treeNodeExpansion.js';
import { useTreeNodeFilter } from '../composables/filter/treeNodeFilter.js';
import SelectionMode from '../enums/selectionMode.js';
import TreeEvent from '../enums/event.js';

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
  TreeEvent.ChildCheckboxChange,
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

const tabIndex = computed(() => isFocusedNode() ? 0 : -1);

const customClasses = computed(() => tns.value.customizations?.classes ?? {});

const deleteId = computed(() => `${nodeId.value}-delete`);

const expanderId = computed(() => `${nodeId.value}-exp`);

const id = computed(() => model.value[idPropName.value]);

const idPropName = computed(() => tns.value.idProperty ?? 'id');

const inputId = computed(() => `${nodeId.value}-input`);

const isEffectivelySelected = computed(() => props.selectionMode !== SelectionMode.None && isNodeSelectable() && isNodeSelected());

const label = computed(() => model.value[labelPropName.value]);

const labelPropName = computed(() => tns.value.labelProperty ?? 'label');

const nodeId = computed(() => `${props.treeId}-${id.value}`);

const tns = computed(() => model.value.treeNodeSpec);

// COMPOSABLES

const { normalizeTreeViewNodeData } = useTreeViewNodeDataNormalizer(model, props.modelDefaults, radioGroupValues);

normalizeTreeViewNodeData();

const {
  addChild,
  areChildrenLoaded,
  areChildrenLoading,
  children,
  deleteChild,
  hasChildren,
} = useTreeNodeChildren(model, emit);

const {
  filteredChildren,
  filterIncludesNode,
  mayHaveFilteredChildren
} = useTreeNodeFilter(model, emit);

const {
  focus,
  isFocused,
} = useFocus();

const {
  focusNode,
  focusNextNode,
  focusPreviousNode,
  isFocusedNode
} = useTreeViewNodeFocus(model, nodeElement, emit, toRef(props, "isMounted"));

const {
  ariaSelected,
  isNodeSelectable,
  isNodeSelected,
  toggleNodeSelected,
} = useTreeViewNodeSelection(model, toRef(props, "selectionMode"), emit);

const {
  ariaExpanded,
  canExpand,
  collapseNode,
  expandNode,
  isNodeExpanded,
  toggleNodeExpanded,
} = useTreeNodeExpansion(model, emit);

const {
  dragMoveChild,
  drop,
  onDragstart,
  onDragenter,
  onDragover,
  onDragleave,
  onDrop,
  onDragend
} = useTreeViewNodeDragAndDrop(model, children, toRef(props, "treeId"), emit);

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
 * Handles clicks on the node. It only performs actions if the click happened on an element
 * that does not have node clicks explicitly ingored (e.g., the expander button).
 * Emits a treeNodeClick event.
 * @param {Event} event The click event
 */
function onClick(event) {
  // Don't fire this if the target is an element which has its own events
  if (!event.target.matches(elementsThatIgnoreClicks)) {
    emit(TreeEvent.Click, model.value, event);
    toggleNodeSelected();
  }

  focusNode();
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
 * Handles node deletion eventing. A callback can be supplied in the treeNodeSpec to perform
 * and pre-processing of the node or to cancel the deletion entirely.
 * @param {Event} event The event that triggered this method call
 */
async function onDelete(event) {
  if (tns.value.deletable && (await tns.value.deleteNodeCallback?.(model.value) ?? true)) {
    emit(TreeEvent.Delete, model.value);
  }
}

/**
 * Handles key events to trigger interactions such as selection, expansion,
 * or activation. Each interaction is detailed in the method body.
 * @param {Event} event The keydown event
 */
function onKeyDown(event) {
  let eventHandled = true;

  // Do nothing when modifiers or shift are present.
  if (event.altKey || event.ctrlKey || event.metaKey || event.shift) {
    return;
  }

  if (props.ariaKeyMap.activateItem.includes(event.keyCode)) {
    // Performs the default action (e.g. onclick event) for the focused node.
    // Note that splitting activation and selection so explicitly differs from
    // https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-22 (Enter description, and Selection in multi-select trees)
    if (tns.value.input && !tns.value.state.input.disabled) {
      let tvns = nodeElement.value.querySelector('.grtvn-self');
      let target = tvns.querySelector('.grtvn-self-input') || tvns.querySelector('input');

      if (target) {
        // Note: until there's a need, this just dumbly clicks the .t-v-n-s-i or first input if it exists.
        let clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
        target.dispatchEvent(clickEvent);
      }
    }
  }
  else if (props.ariaKeyMap.selectItem.includes(event.keyCode)) {
    // Toggles selection for the focused node.
    // Note that splitting activation and selection so explicitly differs from
    // https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-22 (Enter description, and Selection in multi-select trees)
    toggleNodeSelected();
  }
  else if (props.ariaKeyMap.expandFocusedItem.includes(event.keyCode)) {
    // When focus is on a closed node, opens the node; focus does not move.
    // When focus is on a open node, moves focus to the first child node.
    // When focus is on an end node, does nothing.
    if (mayHaveFilteredChildren.value && !areChildrenLoading.value) {
      if (!expandNode() && isNodeExpanded()) {
        focus(filteredChildren.value[0]);
      }
    }
  }
  else if (props.ariaKeyMap.collapseFocusedItem.includes(event.keyCode)) {
    // When focus is on an open node, closes the node.
    // When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node.
    // When focus is on a root node that is also either an end node or a closed node, does nothing.
    if (!collapseNode()) {
      // Parent handles setting its own focusability.
      emit(TreeEvent.RequestParentFocus);
    }
  }
  else if (props.ariaKeyMap.focusFirstItem.includes(event.keyCode)) {
    // Moves focus to first node without opening or closing a node.
    // The actual change on the desired node model is handled at the TreeView level.
    emit(TreeEvent.RequestFirstFocus);
  }
  else if (props.ariaKeyMap.focusLastItem.includes(event.keyCode)) {
    // Moves focus to the last node that can be focused without expanding any nodes that are closed.
    // The actual change on the desired node model is handled at the TreeView level.
    emit(TreeEvent.RequestLastFocus);
  }
  else if (props.ariaKeyMap.focusPreviousItem.includes(event.keyCode)) {
    // Moves focus to the previous node that is focusable without opening or closing a node.
    // If focus is on the first node, does nothing
    // Parent handles setting focusability on a sibling (or child thereof) of this node, or itself.
    emit(TreeEvent.RequestPreviousFocus, model.value);
  }
  else if (props.ariaKeyMap.focusNextItem.includes(event.keyCode)) {
    // Moves focus to the next node that is focusable without opening or closing a node.
    // If focus is on the last node, does nothing.
    // Parent handles setting focusability on a sibling of this node, or its first child.
    emit(TreeEvent.RequestNextFocus, model.value, false);
  }
  else if (props.ariaKeyMap.insertItem.includes(event.keyCode)) {
    // Trigger insertion of a new child item if allowed.
    // Focus is not moved.
    addChild();
  }
  else if (props.ariaKeyMap.deleteItem.includes(event.keyCode)) {
    // Trigger deletion of the current node if allowed.
    // Focus is moved to the previous node if available, or the next node.
    onDelete(event);
  }
  else {
    eventHandled = false;
  }

  if (eventHandled) {
    event.stopPropagation();
    event.preventDefault();
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
  // Remove the node from the array of children if this is an immediate child.
  // Note that only the node that was deleted fires these, not any subnode.
  let targetIndex = filteredChildren.value.indexOf(node);
  if (targetIndex > -1) {
    if (isFocused(node)) {
      // When this is the first of several siblings, focus the next node.
      // Otherwise, focus the previous node.
      if (filteredChildren.value.length > 1 && filteredChildren.value.indexOf(node) === 0) {
        focusNextNode(node);
      }
      else {
        focusPreviousNode(node);
      }
    }

    deleteChild(node);
  }
}

/**
 * Emits the treeNodeCheckboxChange event, and if the event is for
 * a direct child then it also emits the treeNodeChildCheckboxChange event.
 * @param {TreeViewNode} node The node on which the checkbox changed
 * @param {Event} event The event that triggered the change
 */
function handleCheckboxChange(node, event) {
  emit(TreeEvent.CheckboxChange, node, event);

  if (children.value.includes(node)) {
    emit(TreeEvent.ChildCheckboxChange, model.value, node, event);
  }
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

  .grtv-wrapper.grtv-default-skin .grtvn.grtvn-hidden {
    display: none;
  }
</style>
