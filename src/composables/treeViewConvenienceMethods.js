import { useTreeViewTraversal } from './treeViewTraversal.js'
import { useSelection } from './selection/selection.js';
import { useTreeViewDataUpdates } from './treeViewDataUpdates.js';
import { useTreeViewNodeDataUpdates } from './treeViewNodeDataUpdates.js';
import { useChildren } from './children/children.js';
import InputType from '../enums/inputType.js';
import SelectionMode from '../enums/selectionMode.js';

/**
 * Composable dealing with convenience methods at the top level of the tree view.
 * @param {TreeViewNode[]} treeModel The top level model of the tree
 * @param {Object[]} treeMetaModel The Ref to the top level meta model of the tree
 * @param {Ref<Object>} radioGroupValues The Ref to the tree's radioGroupValues
 * @param {Ref<SelectionMode>} selectionMode The Ref to the tree's selectionMode
 * @returns Convenience methods to deal with tree view
 */
export function useTreeViewConvenienceMethods(treeModel, treeMetaModel, radioGroupValues, selectionMode) {

  const { depthFirstTraverse } = useTreeViewTraversal(treeMetaModel);

  const { isSelectable, isSelected } = useSelection();

  const { spliceNodeList } = useTreeViewDataUpdates(treeModel, treeMetaModel);

  const { getMetaChildren } = useChildren();

  /**
   * Gets any nodes matched by the given function.
   * @param {Function} matcherFunction A function which takes a meta node as an argument
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
   * Gets any meta nodes with checked checkboxes.
   * @returns {Array<Object>} An array of any meta nodes with checked checkboxes
   */
  function getCheckedCheckboxes() {
    return getMatching((current) =>
      current.input
      && current.input.type === InputType.Checkbox
      && current.state.input.value);
  }

  /**
   * Gets any meta nodes with checked radio buttons.
   * @returns {Array<Object>} An array of any nodes with checked radio buttons
   */
  function getCheckedRadioButtons() {
    return getMatching((current) =>
      current.input
      && current.input.type === InputType.RadioButton
      && radioGroupValues.value[current.input.name] === current.input.value);
  }

  /**
   * Gets the meta node with the given ID
   * @param {String} targetId The ID of the node to find
   * @returns {Object} The meta node with the given ID if found, or null
   */
  function findById(targetId) {
    let node = null;

    if (typeof targetId === 'string') {
      // Do a quick check to see if it's at the root level
      node = treeMetaModel.value.find(n => n.data[n.idProperty] === targetId);

      if (!node) {
        depthFirstTraverse((current) => {
          let children = getMetaChildren(current);
          node = children.find(n => n.data[n.idProperty] === targetId);
          if (node) {
            return false;
          }
        });
      }
    }

    return node;
  }

  /**
   * Gets any selected meta nodes
   * @returns {Object[]} An array of any selected meta nodes
   */
  function getSelected() {
    return selectionMode.value === SelectionMode.None
      ? []
      : getMatching((current) => isSelectable(current) && isSelected(current));
  }

  /**
   * Removes and returns the meta node with the given ID
   * @param {String} targetId The ID of the meta node to remove
   * @returns {TreeViewNode} The meta node with the given ID if removed, or null
   */
  function removeById(targetId) {
    let node = null;

    if (typeof targetId === 'string') {
      // Do a quick check to see if it's at the root level
      let nodeIndex = treeMetaModel.value.findIndex(n => n.data[n.idProperty] === targetId);
      if (nodeIndex > -1) {
        node = spliceNodeList(nodeIndex, 1)[0];
      }
      else {
        depthFirstTraverse((current) => {
          // See if this node has a child that matches
          let children = getMetaChildren(current);
          nodeIndex = children.findIndex(n => n.data[n.idProperty] === targetId);
          if (nodeIndex > -1) {
            const { spliceChildNodeList } = useTreeViewNodeDataUpdates(current);
            node = spliceChildNodeList(nodeIndex, 1)[0];
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