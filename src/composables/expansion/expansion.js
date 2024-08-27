import { unref } from 'vue'

/**
 * Composable dealing with expansion on an arbitrary node.
 * @returns Methods to deal with expansion of an arbitrary node.
 */
export function useExpansion() {

  function isExpandable(metaModel) {
    return unref(metaModel).expandable === true;
  }

  function isExpanded(metaModel) {
    return unref(metaModel).state.expanded === true;
  }

  return {
    isExpandable,
    isExpanded,
  };
}