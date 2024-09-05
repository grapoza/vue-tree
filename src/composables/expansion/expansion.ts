import { TreeViewNodeMetaModel } from 'types/treeView';
import { MaybeRef, unref } from 'vue'

/**
 * Composable dealing with expansion on an arbitrary node.
 * @returns Methods to deal with expansion of an arbitrary node.
 */
export function useExpansion() {

  function isExpandable(metaModel: MaybeRef<TreeViewNodeMetaModel>) {
    return unref(metaModel).expandable === true;
  }

  function isExpanded(metaModel: MaybeRef<TreeViewNodeMetaModel>) {
    return unref(metaModel).state.expanded === true;
  }

  return {
    isExpandable,
    isExpanded,
  };
}