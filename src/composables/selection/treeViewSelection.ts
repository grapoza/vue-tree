import { ComponentPublicInstance, computed, Ref, unref, watch } from 'vue'
import { useTreeViewTraversal } from '../treeViewTraversal'
import { useSelection } from './selection';
import { SelectionMode } from '../../types/selectionMode';
import { TreeEvent } from '../../types/event';
import { TreeViewNodeMetaModel } from 'types/treeView';
import TreeView from "../../components/TreeView.vue";

/**
 * Composable dealing with selection handling at the top level of the tree view.
 * @param metaModel A Ref to the top level meta model of the tree
 * @param selectionMode A Ref to the selection mode in use for the tree.
 * @param focusableNodeMetaModel A Ref to the currently focusable node meta model for the tree
 * @param emit The TreeView's emit function, used to emit selection events on the tree's behalf
 * @returns Methods to deal with tree view level selection
 */
export function useTreeViewSelection(
  metaModel: Ref<TreeViewNodeMetaModel[]>,
  selectionMode: Ref<SelectionMode>,
  focusableNodeMetaModel: Ref<TreeViewNodeMetaModel | null>,
  emit: ComponentPublicInstance<typeof TreeView>["emits"]
) {
  const { depthFirstTraverse } = useTreeViewTraversal(metaModel);
  const { deselect, isSelectable, isSelected, select } = useSelection();

  watch(selectionMode, enforceSelectionMode);

  watch(focusableNodeMetaModel, (metaNode) => {
    if (unref(selectionMode) === SelectionMode.SelectionFollowsFocus) {
      exclusivelySelectNode(metaNode!);
    }
  });

  /**
   * @returns The value for the tree's aria-multiselectable attribute
   */
  const ariaMultiselectable = computed(() => {
    // If there's no selectionMode, return null so aria-multiselectable isn't included.
    // Otherwise, return either true or false as the attribute's value.
    return selectionMode.value === SelectionMode.None
      ? undefined
      : selectionMode.value === SelectionMode.Multiple;
  });

  /**
   * Enforces the selection mode for the tree, ensuring only the expected
   * node or nodes are selected.
   */
  function enforceSelectionMode() {
    if (unref(selectionMode) === SelectionMode.Single) {
      enforceSingleSelectionMode();
    } else if (unref(selectionMode) === SelectionMode.SelectionFollowsFocus) {
      enforceSelectionFollowsFocusMode();
    }
  }

  /**
   * Enforce single selection mode by deselecting anything except
   * the first (by depth-first) selected node.
   */
  function enforceSingleSelectionMode() {
    // For single selection mode, only allow one selected node.
    let alreadyFoundSelected = false;
    depthFirstTraverse((metaNode) => {
      if (metaNode.state && isSelected(metaNode)) {
        if (alreadyFoundSelected) {
          deselect(metaNode);
        } else {
          alreadyFoundSelected = true;
        }
      }
    });
  }

  function enforceSelectionFollowsFocusMode() {
    // Make sure the actual focusable item is selected if the mode changes, and deselect all others
    depthFirstTraverse((metaNode) => {
      let idPropName = metaNode.idProperty;
      let focusableIdPropName = focusableNodeMetaModel.value!.idProperty;
      if (metaNode.data[idPropName] === focusableNodeMetaModel.value!.data[focusableIdPropName]) {
        if (isSelectable(metaNode)) {
          select(metaNode);
        }
      } else if (isSelected(metaNode)) {
        deselect(metaNode);
      }
    });
  }

  /**
   * For single selection mode, unselect any other selected node.
   * For selectionFollowsFocus mode for TreeView, selection state is handled in
   * the focus watcher in treeViewNodeSelection.
   * In all cases this emits treeNodeSelectedChange for the node parameter.
   * @param metaNode The meta node for which selection changed
   */
  function handleNodeSelectedChange(metaNode: TreeViewNodeMetaModel) {
    if (unref(selectionMode) === SelectionMode.Single && isSelected(metaNode)) {
      exclusivelySelectNode(metaNode);
    }
    emit(TreeEvent.SelectedChange, metaNode);
  }

  /**
   * Given a node that should remain selected, deselect another selected node.
   * This is used only when one node at a time can be selected (Single/SelectionFollowsFocus).
   * @param metaNode The meta node that should remain selected
   */
  function exclusivelySelectNode(metaNode: TreeViewNodeMetaModel) {
    const nodeId = metaNode.data[metaNode.idProperty];

    depthFirstTraverse((current) => {
      if (isSelected(current) && current.data[current.idProperty] !== nodeId) {
        deselect(current);
        return false;
      }
      return true;
    });
  }

  return {
    ariaMultiselectable,
    enforceSelectionMode,
    handleNodeSelectedChange,
  };
}