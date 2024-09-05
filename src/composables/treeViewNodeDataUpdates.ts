import { TreeViewNodeMetaModel } from "types/treeView";
import { useChildren } from "./children/children";
import { useNodeDataNormalizer } from "./nodeDataNormalizer";
import { MaybeRef } from "vue";

 const { getChildren, getMetaChildren } = useChildren();

/**
 * Provides method which keep the data model updates in sync with the metadata model
 * in a node of the tree.
 * @param metaModel The metadata model
 */
export function useTreeViewNodeDataUpdates(metaModel: MaybeRef<TreeViewNodeMetaModel>) {

  const { createMetaModel } = useNodeDataNormalizer();

  function spliceChildNodeList(index: number, deleteCount: number, ...newItems: object[]) {
    getChildren(metaModel).splice(index, deleteCount, ...newItems);
   return getMetaChildren(metaModel).splice(index, deleteCount, ...newItems.map(createMetaModel) as TreeViewNodeMetaModel[]);
  }

  function pushChildNode(node: object) {
    getChildren(metaModel).push(node);
    return getMetaChildren(metaModel).push(createMetaModel(node) as TreeViewNodeMetaModel);
  }

  return {
    pushChildNode,
    spliceChildNodeList,
  };
}
