import { useSelection } from './selection/selection.js';
import { useTreeConvenienceMethods } from './treeConvenienceMethods.js';
import InputType from '../enums/inputType.js';
import SelectionMode from '../enums/selectionMode.js';

/**
 * Composable dealing with convenience methods at the top level of the tree view.
 * @param {TreeViewNode} treeModel The Ref to the top level model of the tree
 * @param {Ref<Object>} radioGroupValues The Ref to the tree's radioGroupValues
 * @param {Ref<SelectionMode>} selectionMode The Ref to the tree's selectionMode
 * @returns Convenience methods to deal with tree view
 */
export function useTreeViewConvenienceMethods(treeModel, radioGroupValues, selectionMode) {

  const { isSelectable, isSelected } = useSelection(selectionMode);

  const { getMatching } = useTreeConvenienceMethods(treeModel);

  /**
   * Gets any nodes with checked checkboxes.
   * @returns {Array<TreeViewNode>} An array of any nodes with checked checkboxes
   */
  function getCheckedCheckboxes() {
    return getMatching((current) =>
      current.treeNodeSpec.input
      && current.treeNodeSpec.input.type === InputType.Checkbox
      && current.treeNodeSpec.state.input.value);
  }

  /**
   * Gets any nodes with checked checkboxes.
   * @returns {Array<TreeViewNode>} An array of any nodes with checked checkboxes
   */
  function getCheckedRadioButtons() {
    return getMatching((current) =>
      current.treeNodeSpec.input
      && current.treeNodeSpec.input.type === InputType.RadioButton
      && radioGroupValues.value[current.treeNodeSpec.input.name] === current.treeNodeSpec.input.value);
  }

  /**
   * Gets any selected nodes
   * @returns {TreeViewNode[]} An array of any selected nodes
   */
  function getSelected() {
    return selectionMode.value === SelectionMode.None
      ? []
      : getMatching((current) => isSelectable(current) && isSelected(current));
  }

  return {
    getCheckedCheckboxes,
    getCheckedRadioButtons,
    getSelected,
  };
}