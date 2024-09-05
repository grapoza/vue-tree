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
        metaModel._.dragging ? 'grtvn-dragging' : '',
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
         metaModel._.isDropTarget ? 'grtvn-self-drop-target': '',
         metaModel._.isChildDropTarget ? 'grtvn-self-child-drop-target': '']"
         :draggable="metaModel.draggable"
         :dragging="metaModel._.dragging"
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
           :class="[metaModel._.isPrevDropTarget ? 'grtvn-self-sibling-drop-target-hover': '']"></div>

      <!-- Expander -->
      <slot name="expander"
            :metaModel="metaModel"
            :customClasses="customClasses"
            :expanderId="expanderId"
            :canExpand="canExpand"
            :toggleNodeExpanded="toggleNodeExpanded">

        <button :id="expanderId"
                type="button"
                v-if="canExpand"
                aria-hidden="true"
                tabindex="-1"
                :title="metaModel.expanderTitle ?? undefined"
                class="grtvn-self-expander"
                :class="[customClasses.treeViewNodeSelfExpander,
                metaModel.state.expanded ? 'grtvn-self-expanded' : '',
                metaModel.state.expanded ? customClasses.treeViewNodeSelfExpanded : '']"
                @click="toggleNodeExpanded">
                <i class="grtvn-self-expanded-indicator"
                  :class="customClasses.treeViewNodeSelfExpandedIndicator"></i></button>
        <span v-else
              class="grtvn-self-spacer"
              :class="customClasses.treeViewNodeSelfSpacer"></span>
      </slot>

      <!-- Inputs and labels -->
      <!-- Checkbox -->
      <slot v-if="metaModel.input && metaModel.input.type === 'checkbox'"
            name="checkbox"
            :metaModel="metaModel"
            :customClasses="customClasses"
            :inputId="inputId"
            :checkboxChangeHandler="onCheckboxChange">

        <label :for="inputId"
               :title="metaModel.title ?? undefined"
               class="grtvn-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 tabindex="-1"
                 class="grtvn-self-input grtvn-self-checkbox"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfCheckbox]"
                 type="checkbox"
                 :disabled="metaModel.state.input.disabled"
                 v-model="metaModel.state.input.value"
                 @change="onCheckboxChange" />

          {{ label }}
        </label>
      </slot>

      <!-- Radiobutton -->
      <slot v-else-if="metaModel.input && metaModel.input.type === 'radio'"
            name="radio"
            :metaModel="metaModel"
            :customClasses="customClasses"
            :inputId="inputId"
            :radioGroupValues="radioGroupValues"
            :radioChangeHandler="onRadioChange">

        <label :for="inputId"
               :title="metaModel.title ?? undefined"
               class="grtvn-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 tabindex="-1"
                 class="grtvn-self-input grtvn-self-radio"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfRadio]"
                 type="radio"
                 :name="metaModel.input.name!"
                 :value="metaModel.input.value"
                 :disabled="metaModel.state.input.disabled"
                 v-model="radioGroupValues[metaModel.input.name!]"
                 @change="onRadioChange" />

          {{ label }}
        </label>
      </slot>

      <!-- Text (if not an input) -->
      <slot v-else
            name="text"
            :metaModel="metaModel"
            :customClasses="customClasses">

        <span :title="metaModel.title ?? undefined"
              class="grtvn-self-text"
              :class="customClasses.treeViewNodeSelfText">
          {{ label }}
        </span>
      </slot>

      <!-- Add Child button -->
      <button :id="addChildId"
              type="button"
              v-if="metaModel.addChildCallback"
              aria-hidden="true"
              tabindex="-1"
              :title="metaModel.addChildTitle ?? undefined"
              class="grtvn-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfAddChild]"
              @click="addChild">
        <i class="grtvn-self-add-child-icon"
            :class="customClasses.treeViewNodeSelfAddChildIcon"></i>
      </button>

      <!-- Delete button -->
      <button :id="deleteId"
              type="button"
              v-if="metaModel.deletable"
              aria-hidden="true"
              tabindex="-1"
              :title="metaModel.deleteTitle ?? undefined"
              class="grtvn-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfDelete]"
              @click="onDelete">
        <i class="grtvn-self-delete-icon"
            :class="customClasses.treeViewNodeSelfDeleteIcon"></i>
      </button>

      <!-- Bottom Drop Target -->
      <div class="grtvn-self-sibling-drop-target grtvn-self-next-target"
           :class="[metaModel._.isNextDropTarget ? 'grtvn-self-sibling-drop-target-hover': '']"></div>
    </div>

    <!-- Children and Loading Placholder -->
    <div class="grtvn-children-wrapper"
            :class="customClasses.treeViewNodeChildrenWrapper">
      <slot v-if="metaModel.state.expanded && !areChildrenLoaded"
            name="loading"
            :metaModel="metaModel"
            :customClasses="customClasses">

        <span class="grtvn-loading"
              :class="customClasses.treeViewNodeLoading">
          ...
        </span>
      </slot>
      <ul v-show="metaModel.state.expanded"
          v-if="hasChildren"
          class="grtvn-children"
          :class="customClasses.treeViewNodeChildren"
          role="group"
          :aria-hidden="!metaModel.state.expanded">
        <TreeViewNode v-for="(childMetaModel, index) in metaModel.childMetaModels"
                      :key="childMetaModel.data[childMetaModel.idProperty ?? 'id']"
                      :depth="depth + 1"
                      v-model="metaModel.childMetaModels[index]"
                      :model-defaults="modelDefaults"
                      :parent-id="id"
                      :selection-mode="selectionMode"
                      :tree-id="treeId"
                      :initial-radio-group-values="radioGroupValues"
                      :ariaKeyMap="ariaKeyMap"
                      :is-mounted="isMounted"
                      @treeNodeClick="(t, e)=>$emit(TreeEvent.Click, t, e)"
                      @treeNodeDblclick="(t, e)=>$emit(TreeEvent.DoubleClick, t, e)"
                      @treeNodeCheckboxChange="handleCheckboxChange"
                      @treeNodeChildCheckboxChange="(t, c, e)=>$emit(TreeEvent.ChildCheckboxChange, t, c, e)"
                      @treeNodeRadioChange="(t, e)=>$emit(TreeEvent.RadioChange, t, e)"
                      @treeNodeExpandedChange="(t)=>$emit(TreeEvent.ExpandedChange, t)"
                      @treeNodeChildrenLoad="(t)=>$emit(TreeEvent.ChildrenLoad, t)"
                      @treeNodeSelectedChange="(t)=>$emit(TreeEvent.SelectedChange, t)"
                      @treeNodeActivate="(t)=>$emit(TreeEvent.Activate, t)"
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
  </li>
</template>

<script setup lang="ts">

import { computed, PropType, Ref, ref, toRef, useTemplateRef, watchEffect } from 'vue'
import { useNodeDataNormalizer } from '../composables/nodeDataNormalizer';
import { useChildren } from '../composables/children/children';
import { useTreeViewNodeChildren } from '../composables/children/treeViewNodeChildren';
import { useTreeViewNodeDragAndDrop } from '../composables/dragDrop/treeViewNodeDragAndDrop';
import { useFocus } from '../composables/focus/focus';
import { useTreeViewNodeFocus } from '../composables/focus/treeViewNodeFocus';
import { useTreeViewNodeSelection } from '../composables/selection/treeViewNodeSelection';
import { useTreeViewNodeExpansion } from '../composables/expansion/treeViewNodeExpansion';
import { useTreeViewNodeFilter } from '../composables/filter/treeViewNodeFilter';
import { SelectionMode } from '../types/selectionMode';
import { TreeEvent } from '../types/event';
import { TreeViewNodeMetaModelCustomizations, TreeViewNodeMetaModel, TreeViewNodeMetaModelDefaults, TreeViewNodeMetaModelDefaultsMethod } from 'types/treeView';
import { DropEventData } from 'types/dragDrop';

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
  initialRadioGroupValues: {
    type: Object as PropType<Record<string, string>>,
    required: true
  },
  isMounted: {
    type: Boolean,
    required: true
  },
  modelDefaults: {
    type: Function as PropType<TreeViewNodeMetaModelDefaultsMethod>,
    required: true
  },
  selectionMode: {
    type: String as PropType<SelectionMode>,
    required: false,
    default: SelectionMode.None,
    validator: function (value: SelectionMode) {
      return Object.values(SelectionMode).includes(value);
    }
  },
  treeId: {
    type: String,
    required: true
  }
});

// EMITS

const emit = defineEmits({
  [TreeEvent.Activate]: (node: TreeViewNodeMetaModel) => true,
  [TreeEvent.Add]: (node: TreeViewNodeMetaModel, parent: TreeViewNodeMetaModel) => true,
  [TreeEvent.CheckboxChange]: (node: TreeViewNodeMetaModel, event: Event) => true,
  [TreeEvent.ChildCheckboxChange]: (node: TreeViewNodeMetaModel, child: TreeViewNodeMetaModel, event: Event) => true,
  [TreeEvent.ChildrenLoad]: (node: TreeViewNodeMetaModel) => true,
  [TreeEvent.Click]: (node: TreeViewNodeMetaModel, event: MouseEvent) => true,
  [TreeEvent.Delete]: (node: TreeViewNodeMetaModel) => true,
  [TreeEvent.DoubleClick]: (node: TreeViewNodeMetaModel, event: MouseEvent) => true,
  [TreeEvent.DragMove]: (node: TreeViewNodeMetaModel, event: DragEvent) => true,
  [TreeEvent.Drop]: (data: DropEventData, event: DragEvent) => true,
  [TreeEvent.ExpandedChange]: (node: TreeViewNodeMetaModel) => true,
  [TreeEvent.FocusableChange]: (node: TreeViewNodeMetaModel) => true,
  [TreeEvent.RadioChange]: (node: TreeViewNodeMetaModel, event: Event) => true,
  [TreeEvent.RequestFirstFocus]: (keepCurrentDomFocus?: boolean) => true,
  [TreeEvent.RequestLastFocus]: () => true,
  [TreeEvent.RequestNextFocus]: (node: TreeViewNodeMetaModel, keepCurrentDomFocus: boolean) => true,
  [TreeEvent.RequestParentFocus]: () => true,
  [TreeEvent.RequestPreviousFocus]: (node: TreeViewNodeMetaModel) => true,
  [TreeEvent.SelectedChange]: (node: TreeViewNodeMetaModel) => true,
});

// SLOTS

const slots = defineSlots<{
  expander(props: {
    metaModel: TreeViewNodeMetaModel,
    customClasses: TreeViewNodeMetaModelCustomizations["classes"],
    expanderId: string,
    canExpand: boolean,
    toggleNodeExpanded: () => boolean
  }): void,
  checkbox(props: {
    metaModel: TreeViewNodeMetaModel,
    customClasses: TreeViewNodeMetaModelCustomizations["classes"],
    inputId: string,
    checkboxChangeHandler: (event: Event) => void
  }): void,
  radio(props: {
    metaModel: TreeViewNodeMetaModel,
    customClasses: TreeViewNodeMetaModelCustomizations["classes"],
    inputId: string,
    radioGroupValues: Record<string, any>,
    radioChangeHandler: (event: Event) => void
  }): void,
  text(props: {
    metaModel: TreeViewNodeMetaModel,
    customClasses: TreeViewNodeMetaModelCustomizations["classes"]
  }): void,
  loading(props: {
    metaModel: TreeViewNodeMetaModel,
    customClasses: TreeViewNodeMetaModelCustomizations["classes"]
  }): void
}>();

// DATA

const elementsThatIgnoreClicks = 'input, .grtvn-self-expander, .grtvn-self-expander *, .grtvn-self-action, .grtvn-self-action *';
const metaModel = defineModel({ required: true, type: Object as PropType<TreeViewNodeMetaModel> });

const radioGroupValues = ref(props.initialRadioGroupValues);
const nodeElement = useTemplateRef("nodeElement");

// COMPUTED

const addChildId = computed(() => `${nodeId.value}-add-child`);

const tabIndex = computed(() => isFocusedNode() ? 0 : -1);

const customClasses = computed(() => metaModel.value.customizations?.classes ?? {});

const deleteId = computed(() => `${nodeId.value}-delete`);

const expanderId = computed(() => `${nodeId.value}-exp`);

const id = computed(() => metaModel.value.data[idPropName.value]);

const idPropName = computed(() => metaModel.value.idProperty ?? 'id');

const inputId = computed(() => `${nodeId.value}-input`);

const isEffectivelySelected = computed(() => props.selectionMode !== SelectionMode.None && isNodeSelectable() && isNodeSelected());

const label = computed(() => metaModel.value.data[labelPropName.value]);

const labelPropName = computed(() => metaModel.value.labelProperty ?? 'label');

const nodeId = computed(() => `${props.treeId}-${id.value}`);

const treeId = computed(() => props.treeId);

// COMPOSABLES

const { createMetaModel, normalizeNodeData } = useNodeDataNormalizer(metaModel as Ref<TreeViewNodeMetaModelDefaults>, props.modelDefaults, radioGroupValues);
normalizeNodeData();

const {
  getChildren,
} = useChildren();

const {
  addChild,
  areChildrenLoaded,
  areChildrenLoading,
  children,
  deleteChild,
  hasChildren,
} = useTreeViewNodeChildren(metaModel, emit);

const {
  filteredChildren,
  filterIncludesNode,
  mayHaveFilteredChildren
} = useTreeViewNodeFilter(metaModel, emit);

const {
  focus,
  isFocused,
} = useFocus();

const {
  focusNode,
  focusNextNode,
  focusPreviousNode,
  isFocusedNode
} = useTreeViewNodeFocus(metaModel, nodeElement, emit, toRef(props, "isMounted"));

const {
  ariaSelected,
  isNodeSelectable,
  isNodeSelected,
  toggleNodeSelected,
} = useTreeViewNodeSelection(metaModel, toRef(props, "selectionMode"), emit);

const {
  ariaExpanded,
  canExpand,
  collapseNode,
  expandNode,
  isNodeExpanded,
  toggleNodeExpanded,
} = useTreeViewNodeExpansion(metaModel, emit);

const {
  dragMoveChild,
  drop,
  onDragstart,
  onDragenter,
  onDragover,
  onDragleave,
  onDrop,
  onDragend
} = useTreeViewNodeDragAndDrop(metaModel, treeId, emit);

// Watch the model children to make sure the metamodel is kept in sync
watchEffect(() => {
  // Patch the meta children to match the data children
  const metaChildren = children.value;
  const dataChildren = getChildren(metaModel);

  dataChildren.forEach((node, index) => {
    const metaIndex = metaChildren.findIndex((m) => m.data[idPropName.value] === node[idPropName.value]);

    // If the indexes match, then the meta node is already in place and we can skip it.
    if (index !== metaIndex) {
      // Otherwise, if the node is not in the meta children, add it.
      if (metaIndex === -1) {
        metaChildren.splice(index, 0, createMetaModel(node) as TreeViewNodeMetaModel);
      }
      else {
        // If the node is in the meta children, but not in the right place, move it.
        metaChildren.splice(index, 0, metaChildren.splice(metaIndex, 1)[0]);
      }
    }
  });

  // If there are more meta children than data children, remove the extra meta children.
  if (metaChildren.length > dataChildren.length) {
    metaChildren.splice(dataChildren.length);
  }
});

// METHODS

/**
 * Pass the event for checkbox changes up from the node.
 * Emits a treeNodeCheckboxChange event
 * @param event The event that triggered the change
 */
function onCheckboxChange(event: Event) {
  emit(TreeEvent.CheckboxChange, metaModel.value, event);
}

/**
 * Pass the event for radio button changes up from the node.
 * Emits a treeNodeRadioChange event
 * @param event The event that triggered the change
 */
function onRadioChange(event: Event) {
  emit(TreeEvent.RadioChange, metaModel.value, event);
}

/**
 * Handles clicks on the node. It only performs actions if the click happened on an element
 * that does not have node clicks explicitly ingored (e.g., the expander button).
 * Emits a treeNodeClick event.
 * @param event The click event
 */
function onClick(event: MouseEvent) {
  // Don't fire this if the target is an element which has its own events
  if (!(event.target as Element).matches(elementsThatIgnoreClicks)) {
    emit(TreeEvent.Click, metaModel.value, event);
    toggleNodeSelected();
  }

  focusNode();
}

/**
 * Handles double clicks on the node. It only performs actions if the double click happened on an
 * element that does not have node clicks explicitly ingored (e.g., the expander button).
 * Emits a treeNodeDblclick event.
 * @param event The dblclick event
 */
function onDblclick(event: MouseEvent) {
  // Don't fire this if the target is an element which has its own events
  if (!(event.target as Element).matches(elementsThatIgnoreClicks)) {
    emit(TreeEvent.DoubleClick, metaModel.value, event);
  }
}

/**
 * Handles node deletion eventing. A callback can be supplied in the metaModel to perform
 * and pre-processing of the node or to cancel the deletion entirely.
 */
async function onDelete() {
  if (metaModel.value.deletable && (await metaModel.value.deleteNodeCallback?.(metaModel.value) ?? true)) {
    emit(TreeEvent.Delete, metaModel.value);
  }
}

/**
 * Handles key events to trigger interactions such as selection, expansion,
 * or activation. Each interaction is detailed in the method body.
 * @param event The keydown event
 */
function onKeyDown(event: KeyboardEvent) {
  let eventHandled = true;

  // Do nothing when modifiers or shift are present.
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return;
  }

  if (props.ariaKeyMap.activateItem.includes(event.keyCode)) {
    // Performs the default action (e.g. onclick event) for the focused node.
    // Note that splitting activation and selection so explicitly differs from
    // https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-22 (Enter description, and Selection in multi-select trees)
    if (metaModel.value.input && !metaModel.value.state.input.disabled) {
      let tvns = nodeElement.value!.querySelector('.grtvn-self');
      let target = tvns!.querySelector('.grtvn-self-input') ?? tvns!.querySelector('input');

      if (target) {
        // Note: until there's a need, this just dumbly clicks the .t-v-n-s-i or first input if it exists.
        let clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
        target.dispatchEvent(clickEvent);
      }
    }

    // Bubble activation out so users can apply handling for any kind of node
    emit(TreeEvent.Activate, metaModel.value);
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
    emit(TreeEvent.RequestPreviousFocus, metaModel.value);
  }
  else if (props.ariaKeyMap.focusNextItem.includes(event.keyCode)) {
    // Moves focus to the next node that is focusable without opening or closing a node.
    // If focus is on the last node, does nothing.
    // Parent handles setting focusability on a sibling of this node, or its first child.
    emit(TreeEvent.RequestNextFocus, metaModel.value, false);
  }
  else if (props.ariaKeyMap.insertItem.includes(event.keyCode)) {
    // Trigger insertion of a new child item if allowed.
    // Focus is not moved.
    addChild();
  }
  else if (props.ariaKeyMap.deleteItem.includes(event.keyCode)) {
    // Trigger deletion of the current node if allowed.
    // Focus is moved to the previous node if available, or the next node.
    onDelete();
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
 * @param metaNode The node to remove
 */
function handleChildDeletion(metaNode: TreeViewNodeMetaModel) {
  // Remove the node from the array of children if this is an immediate child.
  // Note that only the node that was deleted fires these, not any subnode.
  let targetIndex = filteredChildren.value.indexOf(metaNode);
  if (targetIndex > -1) {
    if (isFocused(metaNode)) {
      // When this is the first of several siblings, focus the next node.
      // Otherwise, focus the previous node.
      if (filteredChildren.value.length > 1 && filteredChildren.value.indexOf(metaNode) === 0) {
        focusNextNode(metaNode);
      }
      else {
        focusPreviousNode(metaNode);
      }
    }

    deleteChild(metaNode);
  }
}

/**
 * Emits the treeNodeCheckboxChange event, and if the event is for
 * a direct child then it also emits the treeNodeChildCheckboxChange event.
 * @param metaNode The meta node on which the checkbox changed
 * @param event The event that triggered the change
 */
function handleCheckboxChange(metaNode: TreeViewNodeMetaModel, event: Event) {
  emit(TreeEvent.CheckboxChange, metaNode, event);

  if (children.value.includes(metaNode)) {
    emit(TreeEvent.ChildCheckboxChange, metaModel.value, metaNode, event);
  }
}

// CREATION LOGIC

// id and label are required; notify the user. Validation is done here instead
// of at the prop level due to dependency on multiple props at once and defaulting
// that takes place in the normalization process
if (!id.value || (typeof id.value !== 'number' && typeof id.value !== 'string')) {
  console.error(`modelValue id is required and must be a number or string. Expected prop ${idPropName.value} to exist on the model.`);
}

if (!label.value || typeof label.value !== 'string') {
  console.error(`modelValue label is required and must be a string. Expected prop ${labelPropName.value} to exist on the model.`);
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
