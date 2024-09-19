import { MaybeRef, unref } from 'vue';
import { useExpansion } from '../expansion/expansion';
import { useFilter } from '../filter/filter';
import { TreeViewNodeMetaModel } from 'types/treeView';

/**
 * Composable dealing with focus handling on an arbitrary node.
 * @returns Methods to deal with focus of arbitrary nodes
 */
export function useFocus() {

  const { isExpanded } = useExpansion();

  const {
    getFilteredChildren,
    getFilteredNodes
  } = useFilter();

  /**
   * Marks the given meta node as the focusable node in the tree
   * @param metaModel The meta model to mark as focusable
   * @param keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   */
  function focus(metaModel: MaybeRef<TreeViewNodeMetaModel>, keepCurrentDomFocus: boolean = false) {
    unref(metaModel)._.keepCurrentDomFocus = keepCurrentDomFocus;
    unref(metaModel).focusable = true;
  }

  /**
   * Unmarks the given meta node as the focusable node in the tree
   * @param metaModel The meta model to unmark as focusable
   */
  function unfocus(metaModel: MaybeRef<TreeViewNodeMetaModel>) {
    unref(metaModel).focusable = false;
  }

  /**
   * Gets whether the given meta node is focusable
   * @param metaModel The meta model check for focusable
   */
  function isFocused(metaModel: MaybeRef<TreeViewNodeMetaModel>) {
    return unref(metaModel).focusable === true;
  }

  /**
   * Sets the first meta node in the collection as focusable.
   * @param targetCollection The collection of nodes
   * @param keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   */
  function focusFirst(targetCollection: MaybeRef<TreeViewNodeMetaModel[]>, keepCurrentDomFocus: boolean = false) {
    const filteredCollection = getFilteredNodes(targetCollection);

    if (filteredCollection.length > 0) {
      focus(filteredCollection[0], keepCurrentDomFocus);
    }
  }

  /**
   * Sets the last expanded node in the given part of the hierarchy as focusable.
   * @param targetCollection The collection of meta nodes
   * @param keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   */
  function focusLast(targetCollection: MaybeRef<TreeViewNodeMetaModel[]>, keepCurrentDomFocus: boolean = false) {
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
   * @param targetCollection The collection of meta nodes
   * @param childMetaNode The meta node from which focusable should be moved
   * @param ignoreChild True to not consider child nodes. This would be true if a user
   * requests to focus the next node while on the last child of this node; the next sibling of
   * this node should gain focus in that case, or the parent node if there is no next sibling.
   * @param keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   * @return true if a node was focused, false otherwise
   */
  function focusNext(
    targetCollection: MaybeRef<TreeViewNodeMetaModel[]>,
    childMetaNode: TreeViewNodeMetaModel,
    ignoreChild: boolean = false,
    keepCurrentDomFocus: boolean = false
  ) {
    const filteredCollection = getFilteredNodes(targetCollection);

    // If the node is expanded, focus first child unless we're ignoring it (this was punted from a grandchild)
    // If the node has a next sibling, focus that
    // Otherwise, return false to let the caller know. A Node will punt to its parent if it has one.
    let childIndex = filteredCollection.findIndex(
      (n) => n.data[n.idProperty] === childMetaNode.data[childMetaNode.idProperty]
    );
    let childNodeChildren = getFilteredChildren(childMetaNode);

    if (!ignoreChild && childNodeChildren.length > 0 && isExpanded(childMetaNode)) {
      focus(childNodeChildren[0], keepCurrentDomFocus);
    } else if (childIndex < filteredCollection.length - 1) {
      focus(filteredCollection[childIndex + 1], keepCurrentDomFocus);
    } else {
      return false;
    }

    return true;
  }

  /**
   * Focuses the previous node in the tree
   * @param targetCollection The collection of meta nodes
   * @param childNode The meta node from which focusable should be moved
   * @param keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   * @return true if a node was focused, false otherwise
   */
  function focusPrevious(
    targetCollection: MaybeRef<TreeViewNodeMetaModel[]>,
    childNode: TreeViewNodeMetaModel,
    keepCurrentDomFocus: boolean = false
  ) {
    const filteredCollection = getFilteredNodes(targetCollection);

    // If focusing previous of the first child, defer to the caller to focus the parent.
    // If focusing previous of any other node, focus the last expanded node within the previous sibling.
    let childIndex = filteredCollection.findIndex(
      (n) => n.data[n.idProperty] === childNode.data[childNode.idProperty]
    );

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