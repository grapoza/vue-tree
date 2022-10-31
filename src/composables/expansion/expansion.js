import { unref } from 'vue'

/**
 * Composable dealing with expansion on an arbitrary node.
 * @returns Methods to deal with expansion of an arbitrary node.
 */
export function useExpansion() {

  function isExpandable(targetNodeModel) {
    return unref(targetNodeModel).treeNodeSpec.expandable === true;
  }

  function isExpanded(targetNodeModel) {
    return unref(targetNodeModel).treeNodeSpec.state.expanded === true;
  }

  return {
    isExpandable,
    isExpanded,
  };
}