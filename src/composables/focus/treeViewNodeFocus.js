import { computed, unref, watch } from 'vue'
import { useFocus } from './focus.js';
import TreeEvent from '../../enums/event.js';

/**
 * Composable dealing with focus handling at the tree view node.
 * @param {Ref<TreeViewNode>} nodeModel A Ref to the model of the node
 * @param {Ref<Element>} nodeElement A Ref to the HTML Element for the node
 * @param {Function} emit The TreeViewNode's emit function, used to emit selection events on the node's behalf
 * @param {Ref<Boolean>} isMounted A Ref to the isMounted property of the node
 * @returns {Object} Methods to deal with tree view node level focus
 */
export function useTreeViewNodeFocus(nodeModel, nodeElement, emit, isMounted) {

  const { focus, focusFirst, focusLast, focusNext, focusPrevious, isFocused, unfocus } = useFocus();

  const nodeModelChildren = computed(() => nodeModel.value[nodeModel.value.treeNodeSpec.childrenProperty]);

  watch(() => nodeModel.value.treeNodeSpec.focusable, function (newValue) {
    if (newValue === true) {
      // If focusable is set to true and the tree is mounted in the DOM,
      // also focus the node's element.
      if (isMounted.value) {
        nodeElement.value.focus();
      }
      emit(TreeEvent.FocusableChange, nodeModel.value);
    }
  });

  function focusNode() {
    focus(nodeModel);
  }

  function unfocusNode() {
    unfocus(nodeModel);
  }

  function isFocusedNode() {
    return isFocused(nodeModel);
  }

  /**
   * Sets the first node in the node's children as focusable.
   */
  function focusFirstChild() {
    focusFirst(nodeModelChildren.value);
  }

  /**
   * Sets the last expanded node in this part of the hierarchy as focusable.
   */
  function focusLastChild() {
    focusLast(nodeModelChildren.value);
  }

  /**
   * Focuses the next node in the tree.
   * @param {TreeViewNode} childNode The node from which focusable should be moved
   * @param {Boolean} ignoreChild True to not consider child nodes. This would be true if a user
   * requests to focus the next node while on the last child of this node; the next sibling of
   * this node should gain focus in that case, or the parent node if there is no next sibling.
   */
  function focusNextNode(childNode, ignoreChild) {
    // Call focusNext and see if it succeeds in focusing.
    // If not, punt this up to this node's parent.
    if (!focusNext(nodeModelChildren.value, childNode, ignoreChild)) {
      emit(TreeEvent.RequestNextFocus, unref(nodeModel), true);
    }
  }

  /**
   * Focuses the previous node in the tree
   * @param {TreeViewNode} childNode The node from which focusable should be moved
   */
  function focusPreviousNode(childNode) {
    // If focusing previous of the first child, focusPrevious returns false. Focus this node.
    if (!focusPrevious(nodeModelChildren.value, childNode)) {
      focusNode();
    }
  }

  return {
    focusNode,
    unfocusNode,
    isFocusedNode,
    focusFirstChild,
    focusLastChild,
    focusNextNode,
    focusPreviousNode,
  }
}