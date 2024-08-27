import { unref } from 'vue'

/**
 * Composable dealing with selection handling on an arbitrary node.
 * @returns Methods to deal with selection of an arbitrary node.
 */
export function useSelection() {

  function select(targetMetaModel) {
    unref(targetMetaModel).state.selected = true;
  }

  function deselect(targetMetaModel) {
    unref(targetMetaModel).state.selected = false;
  }

  function setSelected(targetMetaModel, newValue) {
    unref(targetMetaModel).state.selected = newValue;
  }

  function isSelectable(targetMetaModel) {
    return unref(targetMetaModel).selectable === true;
  }

  function isSelected(targetMetaModel) {
    return unref(targetMetaModel).state.selected === true;
  }

  return {
    deselect,
    isSelectable,
    isSelected,
    setSelected,
    select,
  }
}