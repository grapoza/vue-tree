export function useTreeGridNodeDataNormalizer(model, modelDefaults, radioGroupValues) {

  /**
   * Normalizes the data model to the format consumable by TreeGridRow.
   */
  function normalizeNodeData() {

    if (!model.value.treeNodeSpec) {
      model.value.treeNodeSpec = {};
    }

    normalizeNodeStateData(model.value.treeNodeSpec);
  }

  /**
   * Normalizes the data model's data related to the node's state.
   */
  function normalizeNodeStateData(tns) {
    if (tns.state === null || typeof tns.state !== 'object') {
      tns.state = {};
    }

    if (typeof tns.state.expanded !== 'boolean') {
      tns.state.expanded = false;
    }
  }

  return {
    normalizeNodeData
  };
}