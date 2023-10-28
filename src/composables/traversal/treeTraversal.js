import { useFilter } from "../filter/filter.js";

/**
 * Composable dealing with methods for traversing tree nodes
 * @param {Ref<TreeNode>} treeModel A Ref to the model from which traversals should start
 * @returns {Object} Methods for traversing tree nodes
 */
export function useTreeTraversal(treeModel) {

  const {
    getFilteredChildren,
    getFilteredNodes
  } = useFilter();

  /**
   * Traverses the tree breadth-first and performs a callback action against each node.
   * @param {Function} nodeActionCallback The action to call against each node, taking that node as a parameter
   */
  function breadthFirstTraverse(nodeActionCallback) {
    traverse(nodeActionCallback, false);
  }

  /**
   * Traverses the tree depth-first and performs a callback action against each node.
   * @param {Function} nodeActionCallback The action to call against each node, taking that node as a parameter
   */
  function depthFirstTraverse(nodeActionCallback) {
    traverse(nodeActionCallback, true);
  }

  /**
   * Traverses the tree in the order specified and performs a callback action against each node.
   * @param {Function} nodeActionCallback The action to call against each node, taking that node as a parameter
   * @param {Boolean} depthFirst True to search depth-first, false for breadth-first.
   */
  function traverse(nodeActionCallback, depthFirst) {

    const filteredNodes = getFilteredNodes(treeModel);
    if (filteredNodes.length === 0) {
      return;
    }

    let nodeQueue = filteredNodes.slice();
    let continueCallbacks = true;

    while (nodeQueue.length > 0 && continueCallbacks !== false) {
      const current = nodeQueue.shift();

      // Push children to the front (depth-first) or the back (breadth-first)
      const children = getFilteredChildren(current);
      nodeQueue = depthFirst
        ? children.concat(nodeQueue)
        : nodeQueue.concat(children);

      // Use a return value of false to halt calling the callback on further nodes.
      continueCallbacks = nodeActionCallback(current);
    }
  }

  return {
    breadthFirstTraverse,
    depthFirstTraverse,
  };
}