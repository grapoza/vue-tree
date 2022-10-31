/**
 * Composable dealing with methods for traversing tree nodes
 * @param {Ref<TreeViewNode>} treeModel A Ref to the model from which traversals should start
 * @returns {Object} Methods for traversing tree nodes
 */
export function useTreeViewTraversal(treeModel) {

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

    if (treeModel.value.length === 0) {
      return;
    }

    let nodeQueue = treeModel.value.slice();
    let continueCallbacks = true;

    while (nodeQueue.length > 0 && continueCallbacks !== false) {
      let current = nodeQueue.shift();

      // Push children to the front (depth-first) or the back (breadth-first)
      let childrenPropName = current.treeNodeSpec.childrenProperty;
      if (Array.isArray(current[childrenPropName])) {
        nodeQueue = depthFirst
          ? current[childrenPropName].concat(nodeQueue)
          : nodeQueue.concat(current[childrenPropName]);
      }

      // Use a return value of false to halt calling the callback on further nodes.
      continueCallbacks = nodeActionCallback(current);
    }
  }

  return {
    breadthFirstTraverse,
    depthFirstTraverse,
  };
}