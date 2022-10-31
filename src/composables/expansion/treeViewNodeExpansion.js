import { computed, watch } from 'vue';
import { useExpansion } from './expansion.js';
import { useTreeViewNodeChildren } from '../children/treeViewNodeChildren.js';
import TreeEvent from '../../enums/event.js';

/**
 * Composable dealing with expansion handling at the tree view node.
 * @param {Ref<TreeViewNode>} nodeModel A Ref to the model of the node
 * @param {Function} emit The TreeViewNode's emit function, used to emit selection events on the node's behalf
 * @returns {Object} Methods to deal with tree view node level expansion
 */
export function useTreeViewNodeExpansion(nodeModel, emit) {

  const {
    isExpandable,
    isExpanded,
  } = useExpansion();

  const {
    loadChildren,
    mayHaveChildren,
  } = useTreeViewNodeChildren(nodeModel, emit);

  const ariaExpanded = computed(() => canExpand.value ? isNodeExpanded() : null);

  const canExpand = computed(() => {
    return mayHaveChildren.value && isNodeExpandable();
  });

  watch(() => nodeModel.value.treeNodeSpec.state.expanded, async function () {

    emit(TreeEvent.ExpandedChange, nodeModel.value);

    // If children need to be loaded asynchronously, load them.
    if (isNodeExpanded()) {
      await loadChildren();
    }
  });

  function isNodeExpandable() {
    return isExpandable(nodeModel);
  }

  function isNodeExpanded() {
    return isExpanded(nodeModel);
  }

  function collapseNode() {
    if (canExpand.value && isNodeExpanded()) {
      nodeModel.value.treeNodeSpec.state.expanded = false;
      return true;
    }
    return false;
  }

  function expandNode() {
    if (canExpand.value && !isNodeExpanded()) {
      nodeModel.value.treeNodeSpec.state.expanded = true;
      return true;
    }
    return false;
  }

  function toggleNodeExpanded() {
    return isNodeExpanded() ? collapseNode() : expandNode();
  }

  return {
    ariaExpanded,
    canExpand,
    collapseNode,
    expandNode,
    isNodeExpandable,
    isNodeExpanded,
    toggleNodeExpanded,
  };
}