import { TreeViewNodeMetaModel } from 'types/treeView';
import { MaybeRef, unref } from 'vue'

/**
 * Composable dealing with selection handling on an arbitrary node.
 * @returns Methods to deal with selection of an arbitrary node.
 */
export function useSelection() {

  function select(metaModel: MaybeRef<TreeViewNodeMetaModel>) {
    unref(metaModel).state.selected = true;
  }

  function deselect(metaModel: MaybeRef<TreeViewNodeMetaModel>) {
    unref(metaModel).state.selected = false;
  }

  function setSelected(metaModel: MaybeRef<TreeViewNodeMetaModel>, newValue: boolean) {
    unref(metaModel).state.selected = newValue;
  }

  function isSelectable(metaModel: MaybeRef<TreeViewNodeMetaModel>) {
    return unref(metaModel).selectable === true;
  }

  function isSelected(metaModel: MaybeRef<TreeViewNodeMetaModel>) {
    return unref(metaModel).state.selected === true;
  }

  return {
    deselect,
    isSelectable,
    isSelected,
    setSelected,
    select,
  }
}