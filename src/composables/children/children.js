import { unref } from 'vue';

/**
 * Composable dealing with children on an arbitrary node.
 * @returns {Object} Methods to deal with children arbitrary nodes
 */
export function useChildren() {

  function getChildren(metaModel) {
    return unref(metaModel).data[unref(metaModel).childrenProperty ?? 'children'];
  }

  function getMetaChildren(metaModel) {
    return unref(metaModel).childMetaModels;
  }

  return {
    getChildren,
    getMetaChildren,
  };
}