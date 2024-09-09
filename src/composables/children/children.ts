import { TreeViewNodeMetaModel } from 'types/treeViewNode';
import { unref } from 'vue';

/**
 * Composable dealing with children on an arbitrary node.
 * @returns Methods to deal with children arbitrary nodes
 */
export function useChildren() {

  function getChildren(metaModel: TreeViewNodeMetaModel) {
    return unref(metaModel).data[unref(metaModel).childrenProperty] ?? [];
  }

  function getMetaChildren(metaModel: TreeViewNodeMetaModel) {
    return unref(metaModel).childMetaModels;
  }

  return {
    getChildren,
    getMetaChildren,
  };
}