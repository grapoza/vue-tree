import { MaybeRef, ref } from 'vue'
import { useFocus } from './focus';
import { TreeViewNodeMetaModel } from 'types/treeView';

/**
 * Composable dealing with focus handling at the top level of the tree view.
 * @returns Methods to deal with tree view level focus
 */
export function useTreeViewFocus() {

  const { unfocus } = useFocus();

  /**
   * Stores the currently focusable node meta model
   */
  const focusableNodeMetaModel = ref<TreeViewNodeMetaModel | null>(null);

  /**
   * Handles changes to the node on which the focusable property is true.
   * A tree can only have one focusable node; that is, one node to which
   * focus is given when the treeview as a whole is given focus, e.g., by
   * tabbing into it.
   * @param newMetaModel The newly focusable meta node
   */
  function handleFocusableChange(newMetaModel: TreeViewNodeMetaModel) {
    if (focusableNodeMetaModel.value !== newMetaModel) {
      if (focusableNodeMetaModel.value) {
        unfocus(focusableNodeMetaModel as MaybeRef<TreeViewNodeMetaModel>);
      }

      focusableNodeMetaModel.value = newMetaModel;
    }
  }

  return {
    focusableNodeMetaModel,
    handleFocusableChange
  }
}