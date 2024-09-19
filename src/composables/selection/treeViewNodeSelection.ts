import { ComponentPublicInstance, computed, Ref, watch } from 'vue'
import { useSelection } from './selection';
import { SelectionMode } from '../../types/selectionMode';
import { TreeEvent } from '../../types/event';
import { TreeViewNodeMetaModel } from 'types/treeView';
import TreeViewNode from "../../components/TreeViewNode.vue";

/**
 * Composable dealing with selection handling at the tree view node.
 * @param metaModel A Ref to the meta model of the node
 * @param selectionMode A Ref to the selection mode in use for the tree
 * @param emit The TreeViewNode's emit function, used to emit selection events on the node's behalf
 * @returns Methods to deal with tree view node level selection
 */
export function useTreeViewNodeSelection(
  metaModel: Ref<TreeViewNodeMetaModel>,
  selectionMode: Ref<SelectionMode>,
  emit: ComponentPublicInstance<typeof TreeViewNode>["emits"]
) {

  const { deselect, isSelectable, isSelected, setSelected, select } = useSelection();

  watch(
    () => metaModel.value.state.selected,
    () => {
      emit(TreeEvent.SelectedChange, metaModel.value);
    }
  );

  watch(
    () => metaModel.value.focusable,
    function (newValue) {
      // In selectionFollowsFocus selection mode, this focus watch is responsible for updating selection.
      if (isNodeSelectable() && selectionMode.value === SelectionMode.SelectionFollowsFocus) {
        setNodeSelected(newValue);
      }
    }
  );

  function selectNode() {
    select(metaModel);
  }

  function deselectNode() {
    deselect(metaModel);
  }

  function setNodeSelected(newValue: boolean) {
    setSelected(metaModel, newValue);
  }

  /**
   * Handle toggling the selected state for this node for Single and Multiple selection modes.
   * Note that for SelectionFollowsFocus mode the selection change is already handled by the
   * "model.treeNodeSpec.focusable" watcher method above.
   */
  function toggleNodeSelected() {
    if (
      isSelectable(metaModel) &&
      [SelectionMode.Single, SelectionMode.Multiple].includes(selectionMode.value)
    ) {
      setSelected(metaModel, !isNodeSelected());
    }
  }

  function isNodeSelectable() {
    return isSelectable(metaModel);
  }

  function isNodeSelected() {
    return isSelected(metaModel);
  }

  const ariaSelected = computed(() => {
    // If selection isn't allowed, don't add an aria-selected attribute.
    // If the tree contains nodes that are not selectable, those nodes do not have the aria-selected state.
    if (selectionMode.value === SelectionMode.None || !isNodeSelectable()) {
      return undefined;
    }

    // https://www.w3.org/TR/wai-aria-practices-1.1/#tree_roles_states_props
    // If the tree does not support multiple selection, aria-selected is set to true
    // for the selected node and it is not present on any other node in the tree.
    if (selectionMode.value !== SelectionMode.Multiple) {
      return isNodeSelected() ? true : undefined;
    }

    // If the tree supports multiple selection:
    //   All selected nodes have aria-selected set to true.
    //   All nodes that are selectable but not selected have aria-selected set to false.
    return isNodeSelected();
  });

  return {
    ariaSelected,
    deselectNode,
    isNodeSelectable,
    isNodeSelected,
    setNodeSelected,
    selectNode,
    toggleNodeSelected,
  };
}