import { unref } from 'vue';
import { useTreeNodeDataNormalizer } from './treeNodeDataNormalizer.js'

export function useTreeGridNodeDataNormalizer(model, modelDefaults) {

  const { normalizeNodeData } = useTreeNodeDataNormalizer(model, modelDefaults);

  /**
   * Normalizes the data model to the format consumable by TreeGridRow.
   */
  function normalizeTreeGridNodeData() {
    normalizeNodeData();
  }

  return {
    normalizeTreeGridNodeData
  };
}