import { unref } from 'vue'

/**
 * Composable dealing with selection handling on an arbitrary node.
 * @returns Methods to deal with selection of an arbitrary node.
 */
export function useSelection() {

  function select(metaModel) {
    unref(metaModel).state.selected = true;
  }

  function deselect(metaModel) {
    unref(metaModel).state.selected = false;
  }

  function setSelected(metaModel, newValue) {
    unref(metaModel).state.selected = newValue;
  }

  function isSelectable(metaModel) {
    return unref(metaModel).selectable === true;
  }

  function isSelected(metaModel) {
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