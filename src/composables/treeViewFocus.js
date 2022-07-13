import { unref } from 'vue'

export function useTreeViewFocus() {

  function focusNode(model) {
    unref(model).treeNodeSpec.focusable = true;
  }

  return {
    focusNode
  }
}