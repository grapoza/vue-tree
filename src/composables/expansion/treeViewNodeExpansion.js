import { computed, watch } from 'vue';
import { useExpansion } from './expansion.js';
import { useTreeViewNodeChildren } from '../children/treeViewNodeChildren.js';
import { useTreeViewNodeFilter } from '../filter/treeViewNodeFilter.js';
import TreeEvent from '../../enums/event.js';

/**
 * Composable dealing with expansion handling at the tree view node.
 * @param {Ref<Object>} metaModel A Ref to the metadata model of the node
 * @param {Function} emit The TreeViewNode's emit function, used to emit selection events on the node's behalf
 * @returns {Object} Methods to deal with tree view node level expansion
 */
export function useTreeViewNodeExpansion(metaModel, emit) {

  const {
    isExpandable,
    isExpanded,
  } = useExpansion();

  const {
    loadChildren,
  } = useTreeViewNodeChildren(metaModel, emit);

  const {
    mayHaveFilteredChildren,
  } = useTreeViewNodeFilter(metaModel, emit);

  const ariaExpanded = computed(() => canExpand.value ? isNodeExpanded() : null);

  const canExpand = computed(() => isNodeExpandable() && mayHaveFilteredChildren.value);

  watch(() => metaModel.value.state.expanded, async function () {

    emit(TreeEvent.ExpandedChange, metaModel.value);

    // If children need to be loaded asynchronously, load them.
    if (isNodeExpanded()) {
      await loadChildren();
    }
  });

  function isNodeExpandable() {
    return isExpandable(metaModel);
  }

  function isNodeExpanded() {
    return isExpanded(metaModel);
  }

  function collapseNode() {
    if (canExpand.value && isNodeExpanded()) {
      metaModel.value.state.expanded = false;
      return true;
    }
    return false;
  }

  function expandNode() {
    if (canExpand.value && !isNodeExpanded()) {
      metaModel.value.state.expanded = true;
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