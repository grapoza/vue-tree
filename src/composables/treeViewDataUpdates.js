import { unref } from 'vue';
import { useNodeDataNormalizer } from './nodeDataNormalizer.js';

/**
 * Provides method which keep the data model updates in sync with the metadata model
 * at the root level of the tree.
 * @param {TreeViewNode[]} model The data model
 * @param {Object[]} metaModel The metadata model
 */
export function useTreeViewDataUpdates(model, metaModel) {

  const { createMetaModel } = useNodeDataNormalizer(metaModel);

  function spliceNodeList(index, deleteCount, ...newItems) {
    unref(model).splice(index, deleteCount, ...newItems);
    return unref(metaModel).splice(index, deleteCount, ...newItems.map(createMetaModel));
  }

  return {
    spliceNodeList,
  };
}