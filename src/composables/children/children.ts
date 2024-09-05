import { TreeViewNodeMetaModel } from 'types/treeView';
import { MaybeRef, unref } from 'vue';

/**
 * Composable dealing with children on an arbitrary node.
 * @returns Methods to deal with children arbitrary nodes
 */
export function useChildren() {

  function getChildren(metaModel: MaybeRef<TreeViewNodeMetaModel>) {
    return (unref(metaModel).data[unref(metaModel).childrenProperty] ?? []) as { [key: string]: any }[];
  }

  function getMetaChildren(metaModel: MaybeRef<TreeViewNodeMetaModel>) {
    return unref(metaModel).childMetaModels;
  }

  return {
    getChildren,
    getMetaChildren,
  };
}