import { useTreeViewTraversal } from './treeViewTraversal.js'
import { useSelection } from './selection/selection.js';
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

  const { depthFirstTraverse } = useTreeViewTraversal(treeModel);

  const { isSelectable, isSelected } = useSelection(selectionMode);

  /**
   * Gets any nodes matched by the given function.
   * @param {Function} matcherFunction A function which takes a node as an argument
   * and returns a boolean indicating a match for some condition
   * @param  {Integer} maxMatches The maximum number of matches to return
   * @returns {Array<TreeViewNode>} An array of any nodes matched by the given function
   */
  function getMatching(matcherFunction, maxMatches = 0) {
    let matches = [];

    if (typeof matcherFunction === 'function') {
      depthFirstTraverse((current) => {
        if (matcherFunction(current)) {
          matches.push(current);
          return maxMatches < 1 || matches.length < maxMatches;
        }
      });
    }

    return matches;
  }

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
   * Gets the node with the given ID
   * @param {String} targetId The ID of the node to find
   * @returns {TreeViewNode} The node with the given ID if found, or null
   */
  function findById(targetId) {
    let node = null;

    if (typeof targetId === 'string') {
      // Do a quick check to see if it's at the root level
      node = treeModel.value.find(n => n[n.treeNodeSpec.idProperty] === targetId);

      if (!node) {
        depthFirstTraverse((current) => {
          let children = current[current.treeNodeSpec.childrenProperty];
          node = children.find(n => n[n.treeNodeSpec.idProperty] === targetId);
          if (node) {
            return false;
          }
        });
      }
    }

    return node;
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

  /**
   * Removes and returns the node with the given ID
   * @param {String} targetId The ID of the node to remove
   * @returns {TreeViewNode} The node with the given ID if removed, or null
   */
  function removeById(targetId) {
    let node = null;

    if (typeof targetId === 'string') {
      // Do a quick check to see if it's at the root level
      let nodeIndex = treeModel.value.findIndex(n => n[n.treeNodeSpec.idProperty] === targetId);

      if (nodeIndex > -1) {
        node = treeModel.value.splice(nodeIndex, 1)[0];
      }
      else {
        depthFirstTraverse((current) => {
          // See if this node has a child that matches
          let children = current[current.treeNodeSpec.childrenProperty];
          nodeIndex = children.findIndex(n => n[n.treeNodeSpec.idProperty] === targetId);
          if (nodeIndex > -1) {
            node = children.splice(nodeIndex, 1)[0];
            return false;
          }
        });
      }
    }

    return node;
  }

  return {
    findById,
    getCheckedCheckboxes,
    getCheckedRadioButtons,
    getMatching,
    getSelected,
    removeById,
  };
}