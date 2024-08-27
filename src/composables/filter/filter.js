import { unref } from 'vue';
import { useChildren } from '../children/children.js';

/**
 * Composable dealing with filter handling on an arbitrary node.
 * @returns {Object} Methods to deal with filtering of arbitrary nodes
 */
export function useFilter() {

  const {
    getMetaChildren
  } = useChildren();

  function getFilteredChildren(targetMetaModel) {
    return getFilteredNodes(getMetaChildren(targetMetaModel));
  }

  function getFilteredNodes(targetMetaModels) {
    return unref(targetMetaModels).filter(c => c._?.state?.matchesFilter || c._?.state?.subnodeMatchesFilter);
  }

  return {
    getFilteredChildren,
    getFilteredNodes,
  };
}