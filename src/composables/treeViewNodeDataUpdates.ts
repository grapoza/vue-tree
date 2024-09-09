import { TreeViewNodeMetaModel } from "types/treeViewNode";
import { useChildren } from "./children/children";
import { useNodeDataNormalizer } from "./nodeDataNormalizer";

 const { getChildren, getMetaChildren } = useChildren();

/**
 * Provides method which keep the data model updates in sync with the metadata model
 * in a node of the tree.
 * @param {Object} metaModel The metadata model
 */
export function useTreeViewNodeDataUpdates(metaModel: TreeViewNodeMetaModel) {

  const { createMetaModel } = useNodeDataNormalizer();

  function spliceChildNodeList(index: number, deleteCount: number, ...newItems: object[]) {
    getChildren(metaModel).splice(index, deleteCount, ...newItems);
   return getMetaChildren(metaModel).splice(index, deleteCount, ...newItems.map(createMetaModel));
  }

  function pushChildNode(node: object) {
    getChildren(metaModel).push(node);
    return getMetaChildren(metaModel).push(createMetaModel(node));
  }

  return {
    pushChildNode,
    spliceChildNodeList,
  };
}
