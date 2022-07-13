import { computed } from 'vue'
import TvEvent from '../enums/event.js';

export function useTreeViewNodeAria(ariaKeyMap, model, children, mayHaveChildren, canExpand, nodeElement, onDelete, toggleSelected, onExpandedChange, onAddChild, emit) {

  const tns = model.value.treeNodeSpec;
  const ariaTabIndex = computed(() => tns.focusable ? 0 : -1);

  /**
   * Set this node's focusable attribute to true.
   */
  function focus() {
    // Actual focusing happens in the watch method
    tns.focusable = true;
  }

  /**
   * Handles updating focus when a child node is deleted.
   * @param {TreeViewNode} node The node which is getting deleted
   */
  function handleChildDeletion(node) {
    if (node.treeNodeSpec.focusable) {
      // When this is the first of several siblings, focus the next node.
      // Otherwise, focus the previous node.
      if (children.value.length > 1 && children.value.indexOf(node) === 0) {
        handleNextFocus(node);
      }
      else {
        handlePreviousFocus(node);
      }
    }
  }

  /**
   * Handles setting focusable when the node is clicked.
   */
  function onClick() {
    tns.focusable = true;
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

    if (ariaKeyMap.activateItem.includes(event.keyCode)) {
      // Performs the default action (e.g. onclick event) for the focused node.
      // Note that splitting activation and selection so explicitly differs from
      // https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-22 (Enter description, and Selection in multi-select trees)
      if (tns.input && !tns.state.input.disabled) {
        let tvns = nodeElement.value.querySelector('.grtvn-self');
        let target = tvns.querySelector('.grtvn-self-input') || tvns.querySelector('input');

        if (target) {
          // Note: until there's a need, this just dumbly clicks the .t-v-n-s-i or first input if it exists.
          let clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
          target.dispatchEvent(clickEvent);
        }
      }
    }
    else if (ariaKeyMap.selectItem.includes(event.keyCode)) {
      // Toggles selection for the focused node.
      // Note that splitting activation and selection so explicitly differs from
      // https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-22 (Enter description, and Selection in multi-select trees)
      toggleSelected(event);
    }
    else if (ariaKeyMap.expandFocusedItem.includes(event.keyCode)) {
      // When focus is on a closed node, opens the node; focus does not move.
      // When focus is on a open node, moves focus to the first child node.
      // When focus is on an end node, does nothing.
      if (mayHaveChildren) {
        if (canExpand.value && !tns.state.expanded) {
          onExpandedChange(event);
        }
        else if (tns.state.expanded) {
          children.value[0].treeNodeSpec.focusable = true;
        }
      }
    }
    else if (ariaKeyMap.collapseFocusedItem.includes(event.keyCode)) {
      // When focus is on an open node, closes the node.
      // When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node.
      // When focus is on a root node that is also either an end node or a closed node, does nothing.
      if (canExpand.value && tns.state.expanded) {
        onExpandedChange(event);
      }
      else {
        // Parent handles setting its own focusability.
        emit(TvEvent.RequestParentFocus);
      }
    }
    else if (ariaKeyMap.focusFirstItem.includes(event.keyCode)) {
      // Moves focus to first node without opening or closing a node.
      // The actual change on the desired node model is handled at the TreeView level.
      emit(TvEvent.RequestFirstFocus);
    }
    else if (ariaKeyMap.focusLastItem.includes(event.keyCode)) {
      // Moves focus to the last node that can be focused without expanding any nodes that are closed.
      // The actual change on the desired node model is handled at the TreeView level.
      emit(TvEvent.RequestLastFocus);
    }
    else if (ariaKeyMap.focusPreviousItem.includes(event.keyCode)) {
      // Moves focus to the previous node that is focusable without opening or closing a node.
      // If focus is on the first node, does nothing
      // Parent handles setting focusability on a sibling (or child thereof) of this node, or itself.
      emit(TvEvent.RequestPreviousFocus, model.value);
    }
    else if (ariaKeyMap.focusNextItem.includes(event.keyCode)) {
      // Moves focus to the next node that is focusable without opening or closing a node.
      // If focus is on the last node, does nothing.
      // Parent handles setting focusability on a sibling of this node, or its first child.
      emit(TvEvent.RequestNextFocus, model.value, false);
    }
    else if (ariaKeyMap.insertItem.includes(event.keyCode)) {
      // Trigger insertion of a new child item if allowed.
      // Focus is not moved.
      onAddChild(event);
    }
    else if (ariaKeyMap.deleteItem.includes(event.keyCode)) {
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
   * Focuses the previous node in the tree
   * @param {TreeViewNode} childNode The node from which focusable should be moved
   */
  function handlePreviousFocus(childNode) {
    // If focusing previous of the first child, focus this parent.
    // If focusing previous of any other node, focus the last expanded node within the previous sibling.
    let childIndex = children.value.indexOf(childNode);
    if (childIndex === 0) {
      tns.focusable = true;
    }
    else {
      let lastModel = children.value[childIndex - 1];
      let lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
      while (lastModelChildren.length > 0 && lastModel.treeNodeSpec.state.expanded) {
        lastModel = lastModelChildren[lastModelChildren.length - 1];
      }

      lastModel.treeNodeSpec.focusable = true;
    }
  }

  /**
   * Focuses the next node in the tree.
   * @param {TreeViewNode} childNode The node from which focusable should be moved
   * @param {Boolean} ignoreChild True to not consider child nodes. This would be true if a user
   * requests to focus the next node while on the last child of this node; the next sibling of
   * this node should gain focus in that case, or the parent node if there is no next sibling.
   */
  function handleNextFocus(childNode, ignoreChild) {
    // If the node is expanded, focus first child unless we're ignoring it (this was punted from a grandchild)
    // If the node has a next sibling, focus that
    // Otherwise, punt this up to this node's parent
    let childIndex = children.value.indexOf(childNode);
    let childNodeChildrenPropName = childNode.treeNodeSpec.childrenProperty;
    if (!ignoreChild && childNode[childNodeChildrenPropName].length > 0 && childNode.treeNodeSpec.state.expanded) {
      childNode[childNodeChildrenPropName][0].treeNodeSpec.focusable = true;
    }
    else if (childIndex < children.value.length - 1) {
      children.value[childIndex + 1].treeNodeSpec.focusable = true;
    }
    else {
      emit(TvEvent.RequestNextFocus, model.value, true);
    }
  }

  return {
    ariaTabIndex,
    focus,
    handleChildDeletion,
    onClick,
    onKeyDown,
    handlePreviousFocus,
    handleNextFocus
  }
}
