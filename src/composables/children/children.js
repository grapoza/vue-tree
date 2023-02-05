import { unref } from 'vue';

/**
 * Composable dealing with children on an arbitrary node.
 * @returns {Object} Methods to deal with children arbitrary nodes
 */
export function useChildren() {

  function getChildren(targetNodeModel) {
    return unref(targetNodeModel)[unref(targetNodeModel).treeNodeSpec.childrenProperty ?? 'children'];
  }

  return {
    getChildren,
  };
}