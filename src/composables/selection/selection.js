import { unref } from 'vue'

/**
 * Composable dealing with selection handling on an arbitrary node.
 * @returns Methods to deal with selection of an arbitrary node.
 */
export function useSelection() {

  function select(targetNodeModel) {
    unref(targetNodeModel).treeNodeSpec.state.selected = true;
  }

  function deselect(targetNodeModel) {
    unref(targetNodeModel).treeNodeSpec.state.selected = false;
  }

  function setSelected(targetNodeModel, newValue) {
    unref(targetNodeModel).treeNodeSpec.state.selected = newValue;
  }

  function isSelectable(targetNodeModel) {
    return unref(targetNodeModel).treeNodeSpec.selectable === true;
  }

  function isSelected(targetNodeModel) {
    return unref(targetNodeModel).treeNodeSpec.state.selected === true;
  }

  return {
    deselect,
    isSelectable,
    isSelected,
    setSelected,
    select,
  }
}