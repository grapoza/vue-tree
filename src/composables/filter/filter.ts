import { MaybeRef, unref } from 'vue';
import { useChildren } from '../children/children';
import { TreeViewNodeMetaModel } from 'types/treeView';

/**
 * Composable dealing with filter handling on an arbitrary node.
 * @returns Methods to deal with filtering of arbitrary nodes
 */
export function useFilter() {

  const {
    getMetaChildren
  } = useChildren();

  function getFilteredChildren(metaModel: MaybeRef<TreeViewNodeMetaModel>) {
    return getFilteredNodes(getMetaChildren(metaModel));
  }

  function getFilteredNodes(metaModels: MaybeRef<TreeViewNodeMetaModel[]>) {
    return unref(metaModels).filter(c => c._?.state?.matchesFilter || c._?.state?.subnodeMatchesFilter);
  }

  return {
    getFilteredChildren,
    getFilteredNodes,
  };
}