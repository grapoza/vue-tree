import { computed } from 'vue'

/**
 * Composable dealing with computed values common to any tree node.
 * @param {Ref<TreeNode>} treeModel The Ref to the top level model of the tree
 * @param {Ref<string>} treeId The ID of the main tree DOM element
 * @returns Composables for the tree node values
 */
export function useTreeNodeComputeds(treeModel, treeId) {

  const expanderId = computed(() => `${nodeId.value}-exp`);

  const id = computed(() => treeModel.value[idPropName.value]);

  const idPropName = computed(() => tns.value.idProperty ?? 'id');

  const nodeId = computed(() => `${treeId.value}-${id.value}`);

  const tns = computed(() => treeModel.value.treeNodeSpec);

  return {
    expanderId,
    id,
    idPropName,
    nodeId,
    tns,
  };
}