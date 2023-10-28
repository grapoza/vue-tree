import { useTreeTraversal } from '../traversal/treeTraversal.js'

/**
 * Composable dealing with convenience methods at the top level of the tree.
 * @param {TreeNode} treeModel The Ref to the top level model of the tree
 * @returns Convenience methods to deal with trees
 */
export function useTreeConvenienceMethods(treeModel) {

  const { depthFirstTraverse } = useTreeTraversal(treeModel);

  /**
   * Gets any nodes matched by the given function.
   * @param {Function} matcherFunction A function which takes a node as an argument
   * and returns a boolean indicating a match for some condition
   * @param  {Integer} maxMatches The maximum number of matches to return
   * @returns {Array<TreeNode>} An array of any nodes matched by the given function
   */
  function getMatching(matcherFunction, maxMatches = 0) {
    let matches = [];

    if (typeof matcherFunction === 'function') {
      depthFirstTraverse((current) => {
        if (matcherFunction(current)) {
          matches.push(current);
          return maxMatches < 1 || matches.length < maxMatches;
        }
      });
    }

    return matches;
  }

  /**
   * Gets the node with the given ID
   * @param {String} targetId The ID of the node to find
   * @returns {TreeNode} The node with the given ID if found, or null
   */
  function findById(targetId) {
    let node = null;

    if (typeof targetId === 'string') {
      // Do a quick check to see if it's at the root level
      node = treeModel.value.find(n => n[n.treeNodeSpec.idProperty] === targetId);

      if (!node) {
        depthFirstTraverse((current) => {
          let children = current[current.treeNodeSpec.childrenProperty];
          node = children.find(n => n[n.treeNodeSpec.idProperty] === targetId);
          if (node) {
            return false;
          }
        });
      }
    }

    return node;
  }

  /**
   * Removes and returns the node with the given ID
   * @param {String} targetId The ID of the node to remove
   * @returns {TreeNode} The node with the given ID if removed, or null
   */
  function removeById(targetId) {
    let node = null;

    if (typeof targetId === 'string') {
      // Do a quick check to see if it's at the root level
      let nodeIndex = treeModel.value.findIndex(n => n[n.treeNodeSpec.idProperty] === targetId);

      if (nodeIndex > -1) {
        node = treeModel.value.splice(nodeIndex, 1)[0];
      }
      else {
        depthFirstTraverse((current) => {
          // See if this node has a child that matches
          let children = current[current.treeNodeSpec.childrenProperty];
          nodeIndex = children.findIndex(n => n[n.treeNodeSpec.idProperty] === targetId);
          if (nodeIndex > -1) {
            node = children.splice(nodeIndex, 1)[0];
            return false;
          }
        });
      }
    }

    return node;
  }

  return {
    findById,
    getMatching,
    removeById,
  };
}