import { ref } from 'vue'
import { useFocus } from './focus';

/**
 * Composable dealing with focus handling at the top level of the tree view.
 * @returns {Object} Methods to deal with tree view level focus
 */
export function useTreeViewFocus() {

  const { unfocus } = useFocus();

  /**
   * Stores the currently focusable node meta model
   */
  const focusableNodeModel = ref(null);

  /**
   * Handles changes to the node on which the focusable property is true.
   * A tree can only have one focusable node; that is, one node to which
   * focus is given when the treeview as a whole is given focus, e.g., by
   * tabbing into it.
   * @param {TreeViewNode} newMetaModel The newly focusable meta node
   */
  function handleFocusableChange(newMetaModel) {
    if (focusableNodeModel.value !== newMetaModel) {
      if (focusableNodeModel.value) {
        unfocus(focusableNodeModel);
      }

      focusableNodeModel.value = newMetaModel;
    }
  }

  return {
    focusableNodeModel,
    handleFocusableChange
  }
}