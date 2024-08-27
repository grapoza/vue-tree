import { computed, unref, watch } from 'vue'
import { useTreeViewTraversal } from '../treeViewTraversal.js'
import { useSelection } from './selection.js';
import SelectionMode from '../../enums/selectionMode.js';
import TreeEvent from '../../enums/event';

/**
 * Composable dealing with selection handling at the top level of the tree view.
 * @param {Ref<Object[]>} metaModel A Ref to the top level meta model of the tree
 * @param {Ref<SelectionMode>} selectionMode A Ref to the selection mode in use for the tree.
 * @param {Ref<Object>} focusableNodeMetaModel A Ref to the currently focusable node meta model for the tree
 * @param {Function} emit The TreeView's emit function, used to emit selection events on the tree's behalf
 * @returns {Object} Methods to deal with tree view level selection
 */
export function useTreeViewSelection(metaModel, selectionMode, focusableNodeMetaModel, emit) {

  const { depthFirstTraverse } = useTreeViewTraversal(metaModel);
  const { deselect, isSelectable, isSelected, select } = useSelection();

  watch(selectionMode, enforceSelectionMode);

  watch(focusableNodeMetaModel, (node) => {
    if (unref(selectionMode) === SelectionMode.SelectionFollowsFocus) {
      exclusivelySelectNode(node);
    }
  });

  /**
   * @returns The value for the tree's aria-multiselectable attribute
   */
  const ariaMultiselectable = computed(() => {
    // If there's no selectionMode, return null so aria-multiselectable isn't included.
    // Otherwise, return either true or false as the attribute's value.
    return selectionMode.value === SelectionMode.None ? null : selectionMode.value === SelectionMode.Multiple;
  });

  /**
   * Enforces the selection mode for the tree, ensuring only the expected
   * node or nodes are selected.
   */
  function enforceSelectionMode() {
    if (unref(selectionMode) === SelectionMode.Single) {
      enforceSingleSelectionMode();
    }
    else if (unref(selectionMode) === SelectionMode.SelectionFollowsFocus) {
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
    depthFirstTraverse((node) => {
      if (node.state && isSelected(node)) {
        if (alreadyFoundSelected) {
          deselect(node);
        }
        else {
          alreadyFoundSelected = true;
        }
      }
    });
  }

  function enforceSelectionFollowsFocusMode() {
    // Make sure the actual focusable item is selected if the mode changes, and deselect all others
    depthFirstTraverse((node) => {
      let idPropName = node.idProperty;
      let focusableIdPropName = focusableNodeMetaModel.value.idProperty;
      if (node.data[idPropName] === focusableNodeMetaModel.value.data[focusableIdPropName]) {
        if (isSelectable(node)) {
          select(node);
        }
      }
      else if (isSelected(node)) {
        deselect(node);
      }
    });
  }

  /**
   * For single selection mode, unselect any other selected node.
   * For selectionFollowsFocus mode for TreeView, selection state is handled in
   * the focus watcher in treeViewNodeSelection.js.
   * In all cases this emits treeNodeSelectedChange for the node parameter.
   * @param {Object} metaNode The meta node for which selection changed
   */
  function handleNodeSelectedChange(metaNode) {
    if (unref(selectionMode) === SelectionMode.Single && isSelected(metaNode)) {
      exclusivelySelectNode(metaNode);
    }
    emit(TreeEvent.SelectedChange, metaNode);
  }

  /**
   * Given a node that should remain selected, deselect another selected node.
   * This is used only when one node at a time can be selected (Single/SelectionFollowsFocus).
   * @param {Object} node The meta node that should remain selected
   */
  function exclusivelySelectNode(node) {
    const nodeId = node.data[node.idProperty];

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
  }
}