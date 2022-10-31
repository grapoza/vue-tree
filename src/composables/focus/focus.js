import { unref } from 'vue';
import { useExpansion } from '../expansion/expansion.js';

/**
 * Composable dealing with focus handling on an arbitrary node.
 * @returns {Object} Methods to deal with focus of arbitrary nodes
 */
export function useFocus() {

  const { isExpanded } = useExpansion();

  /**
   * Marks the given node as the focusable node in the tree
   * @param {TreeViewNode} targetNodeModel The model to mark as focusable
   */
  function focus(targetNodeModel) {
    unref(targetNodeModel).treeNodeSpec.focusable = true;
  }

  /**
   * Unmarks the given node as the focusable node in the tree
   * @param {TreeViewNode} targetNodeModel The model to unmark as focusable
   */
  function unfocus(targetNodeModel) {
    unref(targetNodeModel).treeNodeSpec.focusable = false;
  }

  /**
   * Gets whether the given node is focusable
   * @param {TreeViewNode} targetNodeModel The model check for focusable
   */
  function isFocused(targetNodeModel) {
    return unref(targetNodeModel).treeNodeSpec.focusable === true;
  }

  /**
   * Sets the first node in the node collection as focusable.
   * @param {TreeViewNode[]} targetCollection The collection of nodes
   */
  function focusFirst(targetCollection) {
    if (targetCollection.length > 0) {
      focus(targetCollection[0]);
    }
  }

  /**
   * Sets the last expanded node in the given part of the hierarchy as focusable.
   * @param {TreeViewNode[]} targetCollection The collection of nodes
   */
  function focusLast(targetCollection) {
    let lastModel = targetCollection[targetCollection.length - 1];
    let lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
    while (lastModelChildren.length > 0 && isExpanded(lastModel)) {
      lastModel = lastModelChildren[lastModelChildren.length - 1];
      lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
    }

    focus(lastModel);
  }

  /**
   * Focuses the next node in the collection.
   * @param {TreeViewNode[]} targetCollection The collection of nodes
   * @param {TreeViewNode} childNode The node from which focusable should be moved
   * @param {Boolean} ignoreChild True to not consider child nodes. This would be true if a user
   * requests to focus the next node while on the last child of this node; the next sibling of
   * this node should gain focus in that case, or the parent node if there is no next sibling.
   * @return {Boolean} true if a node was focused, false otherwise
   */
  function focusNext(targetCollection, childNode, ignoreChild) {
    // If the node is expanded, focus first child unless we're ignoring it (this was punted from a grandchild)
    // If the node has a next sibling, focus that
    // Otherwise, return false to let the caller know. A Node will punt to its parent if it has one.
    let childIndex = targetCollection.indexOf(childNode);
    let childNodeChildren = childNode[childNode.treeNodeSpec.childrenProperty];

    if (!ignoreChild && childNodeChildren.length > 0 && isExpanded(childNode)) {
      focus(childNodeChildren[0]);
    }
    else if (childIndex < targetCollection.length - 1) {
      focus(targetCollection[childIndex + 1]);
    }
    else {
      return false;
    }

    return true;
  }

  /**
   * Focuses the previous node in the tree
   * @param {TreeViewNode[]} targetCollection The collection of nodes
   * @param {TreeViewNode} childNode The node from which focusable should be moved
   * @return {Boolean} true if a node was focused, false otherwise
   */
  function focusPrevious(targetCollection, childNode) {
    // If focusing previous of the first child, defer to the caller to focus the parent.
    // If focusing previous of any other node, focus the last expanded node within the previous sibling.
    let childIndex = targetCollection.indexOf(childNode);
    if (childIndex !== 0) {
      let lastModel = targetCollection[childIndex - 1];
      let lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
      while (lastModelChildren.length > 0 && isExpanded(lastModel)) {
        lastModel = lastModelChildren[lastModelChildren.length - 1];
        lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
      }

      focus(lastModel);
      return true;
    }

    return false;
  }

  return {
    focus,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    isFocused,
    unfocus,
  }
}