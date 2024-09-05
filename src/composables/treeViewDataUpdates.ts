import { MaybeRef, unref } from 'vue';
import { useNodeDataNormalizer } from './nodeDataNormalizer';
import { TreeViewNodeMetaModel, TreeViewNodeMetaModelDefaults } from 'types/treeView';

/**
 * Provides method which keep the data model updates in sync with the metadata model
 * at the root level of the tree.
 * @param model The data model
 * @param metaModel The metadata model
 */
export function useTreeViewDataUpdates(model: MaybeRef<object[]>, metaModel: MaybeRef<TreeViewNodeMetaModelDefaults[]> | MaybeRef<TreeViewNodeMetaModel[]>) {

  const { createMetaModel } = useNodeDataNormalizer();

  function spliceNodeList(index: number, deleteCount: number, ...newItems: object[]) {
    unref(model).splice(index, deleteCount, ...newItems);
    return unref(metaModel).splice(index, deleteCount, ...newItems.map(createMetaModel));
  }

  return {
    spliceNodeList,
  };
}