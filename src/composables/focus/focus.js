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
   * Marks the given meta node as the focusable node in the tree
   * @param {Object} metaModel The meta model to mark as focusable
   * @param {boolean} keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   */
  function focus(metaModel, keepCurrentDomFocus = false) {
    unref(metaModel)._.keepCurrentDomFocus = keepCurrentDomFocus;
    unref(metaModel).focusable = true;
  }

  /**
   * Unmarks the given meta node as the focusable node in the tree
   * @param {Object} metaModel The meta model to unmark as focusable
   */
  function unfocus(metaModel) {
    unref(metaModel).focusable = false;
  }

  /**
   * Gets whether the given meta node is focusable
   * @param {Object} metaModel The meta model check for focusable
   */
  function isFocused(metaModel) {
    return unref(metaModel).focusable === true;
  }

  /**
   * Sets the first meta node in the collection as focusable.
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
   * @param {Object} childMetaNode The meta node from which focusable should be moved
   * @param {Boolean} ignoreChild True to not consider child nodes. This would be true if a user
   * requests to focus the next node while on the last child of this node; the next sibling of
   * this node should gain focus in that case, or the parent node if there is no next sibling.
   * @param {boolean} keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   * @return {Boolean} true if a node was focused, false otherwise
   */
  function focusNext(targetCollection, childMetaNode, ignoreChild, keepCurrentDomFocus = false) {
    const filteredCollection = getFilteredNodes(targetCollection);

    // If the node is expanded, focus first child unless we're ignoring it (this was punted from a grandchild)
    // If the node has a next sibling, focus that
    // Otherwise, return false to let the caller know. A Node will punt to its parent if it has one.
    let childIndex = filteredCollection.findIndex(n => n.data[n.idProperty] === childMetaNode.data[childMetaNode.idProperty]);
    let childNodeChildren = getFilteredChildren(childMetaNode);

    if (!ignoreChild && childNodeChildren.length > 0 && isExpanded(childMetaNode)) {
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
      let lastMetaModel = filteredCollection[childIndex - 1];
      let lastModelChildren = getFilteredChildren(lastMetaModel);
      while (lastModelChildren.length > 0 && isExpanded(lastMetaModel)) {
        lastMetaModel = lastModelChildren[lastModelChildren.length - 1];
        lastModelChildren = getFilteredChildren(lastMetaModel);
      }

      focus(lastMetaModel, keepCurrentDomFocus);
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