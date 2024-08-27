import { unref } from 'vue';
import { useExpansion } from '../expansion/expansion.js';
import { useFilter } from '../filter/filter.js';

/**
 * Composable dealing with focus handling on an arbitrary node.
 * @returns {Object} Methods to deal with focus of arbitrary nodes
 */
export function useFocus() {

  const { isExpanded } = useExpansion();

  const {
    getFilteredChildren,
    getFilteredNodes
  } = useFilter();

  /**
   * Marks the given node as the focusable node in the tree
   * @param {Object} targetMetaModel The meta model to mark as focusable
   * @param {boolean} keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   */
  function focus(targetMetaModel, keepCurrentDomFocus = false) {
    unref(targetMetaModel)._.keepCurrentDomFocus = keepCurrentDomFocus;
    unref(targetMetaModel).focusable = true;
  }

  /**
   * Unmarks the given node as the focusable node in the tree
   * @param {Object} targetMetaModel The meta model to unmark as focusable
   */
  function unfocus(targetMetaModel) {
    unref(targetMetaModel).focusable = false;
  }

  /**
   * Gets whether the given node is focusable
   * @param {Object} targetMetaModel The meta model check for focusable
   */
  function isFocused(targetMetaModel) {
    return unref(targetMetaModel).focusable === true;
  }

  /**
   * Sets the first node in the node collection as focusable.
   * @param {TreeViewNode[]} targetCollection The collection of nodes
   * @param {boolean} keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   */
  function focusFirst(targetCollection, keepCurrentDomFocus = false) {
    const filteredCollection = getFilteredNodes(targetCollection);

    if (filteredCollection.length > 0) {
      focus(filteredCollection[0], keepCurrentDomFocus);
    }
  }

  /**
   * Sets the last expanded node in the given part of the hierarchy as focusable.
   * @param {Object[]} targetCollection The collection of meta nodes
   * @param {boolean} keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   */
  function focusLast(targetCollection, keepCurrentDomFocus = false) {
    const filteredCollection = getFilteredNodes(targetCollection);

    let lastModel = filteredCollection[filteredCollection.length - 1];
    let lastModelChildren = getFilteredChildren(lastModel);
    while (lastModelChildren.length > 0 && isExpanded(lastModel)) {
      lastModel = lastModelChildren[lastModelChildren.length - 1];
      lastModelChildren = getFilteredChildren(lastModel);
    }

    focus(lastModel, keepCurrentDomFocus);
  }

  /**
   * Focuses the next node in the collection.
   * @param {Object[]} targetCollection The collection of meta nodes
   * @param {Object} childNode The meta node from which focusable should be moved
   * @param {Boolean} ignoreChild True to not consider child nodes. This would be true if a user
   * requests to focus the next node while on the last child of this node; the next sibling of
   * this node should gain focus in that case, or the parent node if there is no next sibling.
   * @param {boolean} keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   * @return {Boolean} true if a node was focused, false otherwise
   */
  function focusNext(targetCollection, childNode, ignoreChild, keepCurrentDomFocus = false) {
    const filteredCollection = getFilteredNodes(targetCollection);

    // If the node is expanded, focus first child unless we're ignoring it (this was punted from a grandchild)
    // If the node has a next sibling, focus that
    // Otherwise, return false to let the caller know. A Node will punt to its parent if it has one.
    let childIndex = filteredCollection.findIndex(n => n.data[n.idProperty] === childNode.data[childNode.idProperty]);
    let childNodeChildren = getFilteredChildren(childNode);

    if (!ignoreChild && childNodeChildren.length > 0 && isExpanded(childNode)) {
      focus(childNodeChildren[0], keepCurrentDomFocus);
    }
    else if (childIndex < filteredCollection.length - 1) {
      focus(filteredCollection[childIndex + 1], keepCurrentDomFocus);
    }
    else {
      return false;
    }

    return true;
  }

  /**
   * Focuses the previous node in the tree
   * @param {Object[]} targetCollection The collection of meta nodes
   * @param {Object} childNode The meta node from which focusable should be moved
   * @param {boolean} keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   * @return {Boolean} true if a node was focused, false otherwise
   */
  function focusPrevious(targetCollection, childNode, keepCurrentDomFocus = false) {
    const filteredCollection = getFilteredNodes(targetCollection);

    // If focusing previous of the first child, defer to the caller to focus the parent.
    // If focusing previous of any other node, focus the last expanded node within the previous sibling.
    let childIndex = filteredCollection.findIndex(n => n.data[n.idProperty] === childNode.data[childNode.idProperty]);

    if (childIndex !== 0) {
      let lastModel = filteredCollection[childIndex - 1];
      let lastModelChildren = getFilteredChildren(lastModel);
      while (lastModelChildren.length > 0 && isExpanded(lastModel)) {
        lastModel = lastModelChildren[lastModelChildren.length - 1];
        lastModelChildren = getFilteredChildren(lastModel);
      }

      focus(lastModel, keepCurrentDomFocus);
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