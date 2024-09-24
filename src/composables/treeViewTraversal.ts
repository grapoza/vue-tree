import { TreeViewNodeMetaModel } from "types/treeView";
import { useFilter } from "./filter/filter";
import { Ref } from "vue";

/**
 * Composable dealing with methods for traversing tree nodes
 * @param treeMetaModel A Ref to the meta model from which traversals should start
 * @returns Methods for traversing tree nodes
 */
export function useTreeViewTraversal(treeMetaModel: Ref<TreeViewNodeMetaModel[]>) {

  const {
    getFilteredChildren,
    getFilteredNodes
  } = useFilter();

  /**
   * Traverses the tree breadth-first and performs a callback action against each node.
   * @param nodeActionCallback The action to call against each node, taking that node as a parameter
   */
  function breadthFirstTraverse(nodeActionCallback: (current: TreeViewNodeMetaModel) => boolean | void) {
    traverse(nodeActionCallback, false);
  }

  /**
   * Traverses the tree depth-first and performs a callback action against each node.
   * @param nodeActionCallback The action to call against each node, taking that node as a parameter
   */
  function depthFirstTraverse(nodeActionCallback: (current: TreeViewNodeMetaModel) => boolean | void) {
    traverse(nodeActionCallback, true);
  }

  /**
   * Traverses the tree in the order specified and performs a callback action against each node.
   * @param nodeActionCallback The action to call against each node, taking that node as a parameter
   * @param depthFirst True to search depth-first, false for breadth-first.
   */
  function traverse(nodeActionCallback: (current: TreeViewNodeMetaModel) => boolean | void, depthFirst: boolean) {
    const filteredNodes = getFilteredNodes(treeMetaModel);
    if (filteredNodes.length === 0) {
      return;
    }

    let nodeQueue = filteredNodes.slice();
    let continueCallbacks = true;

    while (nodeQueue.length > 0 && continueCallbacks !== false) {
      const current = nodeQueue.shift()!;

      // Push children to the front (depth-first) or the back (breadth-first)
      const children = getFilteredChildren(current);
      nodeQueue = depthFirst ? children.concat(nodeQueue) : nodeQueue.concat(children);

      // Use a return value of false to halt calling the callback on further nodes.
      continueCallbacks = nodeActionCallback(current) ?? true;
    }
  }

  return {
    breadthFirstTraverse,
    depthFirstTraverse,
  };
}