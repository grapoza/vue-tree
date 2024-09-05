import { ComponentPublicInstance, computed, Ref, watch } from 'vue';
import { useExpansion } from './expansion';
import { useTreeViewNodeChildren } from '../children/treeViewNodeChildren';
import { useTreeViewNodeFilter } from '../filter/treeViewNodeFilter';
import { TreeEvent } from '../../types/event';
import { TreeViewNodeMetaModel } from 'types/treeView';
import TreeViewNode from "../../components/TreeViewNode.vue";

/**
 * Composable dealing with expansion handling at the tree view node.
 * @param metaModel A Ref to the metadata model of the node
 * @param emit The TreeViewNode's emit function, used to emit selection events on the node's behalf
 * @returns Methods to deal with tree view node level expansion
 */
export function useTreeViewNodeExpansion(
  metaModel: Ref<TreeViewNodeMetaModel>,
  emit: ComponentPublicInstance<typeof TreeViewNode>["emits"]
) {
  const { isExpandable, isExpanded } = useExpansion();

  const { loadChildren } = useTreeViewNodeChildren(metaModel, emit);

  const { mayHaveFilteredChildren } = useTreeViewNodeFilter(metaModel, emit);

  const ariaExpanded = computed(() => (canExpand.value ? isNodeExpanded() : undefined));

  const canExpand = computed(() => isNodeExpandable() && mayHaveFilteredChildren.value);

  watch(
    () => metaModel.value.state.expanded,
    async function () {
      emit(TreeEvent.ExpandedChange, metaModel.value);

      // If children need to be loaded asynchronously, load them.
      if (isNodeExpanded()) {
        await loadChildren();
      }
    }
  );

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