import { useTreeViewTraversal } from './treeViewTraversal'
import { useSelection } from './selection/selection';
import { useTreeViewDataUpdates } from './treeViewDataUpdates';
import { useTreeViewNodeDataUpdates } from './treeViewNodeDataUpdates';
import { useChildren } from './children/children';
import { InputType } from '../types/inputType';
import { SelectionMode } from '../types/selectionMode';
import { Ref } from 'vue';
import { TreeViewNodeMetaModel } from 'types/treeView';

/**
 * Composable dealing with convenience methods at the top level of the tree view.
 * @param treeModel The top level model of the tree
 * @param treeMetaModel The Ref to the top level meta model of the tree
 * @param radioGroupValues The Ref to the tree's radioGroupValues
 * @param selectionMode The Ref to the tree's selectionMode
 * @returns Convenience methods to deal with tree view
 */
export function useTreeViewConvenienceMethods(
  treeModel: Ref<object[]>,
  treeMetaModel: Ref<TreeViewNodeMetaModel[]>,
  radioGroupValues: Ref<{ [key: string]: any }>,
  selectionMode: Ref<SelectionMode>
) {
  const { depthFirstTraverse } = useTreeViewTraversal(treeMetaModel);

  const { isSelectable, isSelected } = useSelection();

  const { spliceNodeList } = useTreeViewDataUpdates(treeModel, treeMetaModel);

  const { getMetaChildren } = useChildren();

  /**
   * Gets any nodes matched by the given function.
   * @param matcherFunction A function which takes a meta node as an argument
   * and returns a boolean indicating a match for some condition
   * @param maxMatches The maximum number of matches to return
   * @returns An array of any nodes matched by the given function
   */
  function getMatching(matcherFunction: (current: TreeViewNodeMetaModel) => boolean, maxMatches: number = 0) {
    let matches: TreeViewNodeMetaModel[] = [];

    if (typeof matcherFunction === "function") {
      depthFirstTraverse((current: TreeViewNodeMetaModel) => {
        if (matcherFunction(current)) {
          matches.push(current);
          return maxMatches < 1 || matches.length < maxMatches;
        }
        return true;
      });
    }

    return matches;
  }

  /**
   * Gets any meta nodes with checked checkboxes.
   * @returns An array of any meta nodes with checked checkboxes
   */
  function getCheckedCheckboxes() {
    return getMatching(
      (current) =>
        !!current.input && current.input.type === InputType.Checkbox && !!current.state.input.value
    );
  }

  /**
   * Gets any meta nodes with checked radio buttons.
   * @returns An array of any nodes with checked radio buttons
   */
  function getCheckedRadioButtons() {
    return getMatching(
      (current) =>
        !!current.input &&
        current.input.type === InputType.RadioButton &&
        radioGroupValues.value[current.input.name!] === current.input.value
    );
  }

  /**
   * Gets the meta node with the given ID
   * @param targetId The ID of the node to find
   * @returns The meta node with the given ID if found, or null
   */
  function findById(targetId: string | null) {
    let node: TreeViewNodeMetaModel | null = null;

    if (typeof targetId === "string") {
      // Do a quick check to see if it's at the root level
      node = treeMetaModel.value.find((n) => n.data[n.idProperty] === targetId) ?? null;

      if (!node) {
        depthFirstTraverse((current) => {
          let children = getMetaChildren(current);
          node = children.find((n) => n.data[n.idProperty] === targetId) ?? null;
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
   * @returns An array of any selected meta nodes
   */
  function getSelected() {
    return selectionMode.value === SelectionMode.None
      ? []
      : getMatching((current) => isSelectable(current) && isSelected(current));
  }

  /**
   * Removes and returns the meta node with the given ID
   * @param targetId The ID of the meta node to remove
   * @returns The meta node with the given ID if removed, or null
   */
  function removeById(targetId: string) {
    let node = null;

    if (typeof targetId === "string") {
      // Do a quick check to see if it's at the root level
      let nodeIndex = treeMetaModel.value.findIndex((n) => n.data[n.idProperty] === targetId);
      if (nodeIndex > -1) {
        node = spliceNodeList(nodeIndex, 1)[0] as TreeViewNodeMetaModel;
      } else {
        depthFirstTraverse((current) => {
          // See if this node has a child that matches
          let children = getMetaChildren(current);
          nodeIndex = children.findIndex((n) => n.data[n.idProperty] === targetId);
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