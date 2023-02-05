import { unref } from 'vue';
import { useChildren } from '../children/children.js';

/**
 * Composable dealing with filter handling on an arbitrary node.
 * @returns {Object} Methods to deal with filtering of arbitrary nodes
 */
export function useFilter() {

  const {
    getChildren
  } = useChildren();

  function getFilteredChildren(targetNodeModel) {
    return getFilteredNodes(getChildren(targetNodeModel));
  }

  function getFilteredNodes(targetNodeModels) {
    return unref(targetNodeModels).filter(c => c.treeNodeSpec?._?.state?.matchesFilter || c.treeNodeSpec?._?.state?.subnodeMatchesFilter);
  }

  return {
    getFilteredChildren,
    getFilteredNodes,
  };
}