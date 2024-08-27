import { unref } from "vue";
import { useChildren } from "./children/children.js";
import { useNodeDataNormalizer } from "./nodeDataNormalizer.js";

 const { getChildren, getMetaChildren } = useChildren();

/**
 * Provides method which keep the data model updates in sync with the metadata model
 * in a node of the tree.
 * @param {Object} metaModel The metadata model
 */
export function useTreeViewNodeDataUpdates(metaModel) {

  const { createMetaModel } = useNodeDataNormalizer(metaModel);

  function spliceChildNodeList(index, deleteCount, ...newItems) {
    getChildren(metaModel).splice(index, deleteCount, ...newItems);
   return getMetaChildren(metaModel).splice(index, deleteCount, ...newItems.map(createMetaModel));
  }

  function pushChildNode(node) {
    getChildren(metaModel).push(node);
    return getMetaChildren(metaModel).push(createMetaModel(node));
  }

  return {
    pushChildNode,
    spliceChildNodeList,
  };
}
