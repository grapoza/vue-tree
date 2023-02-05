import { computed, inject, unref, watchEffect } from "vue";
import { useTreeViewNodeChildren } from '../children/treeViewNodeChildren.js';
import { useFilter } from "./filter.js";
import { useFocus } from "../focus/focus.js";
import TreeEvent from '../../enums/event.js';

/**
 * Composable dealing with filtering at the tree view node.
 * @param {Ref<TreeViewNode>} nodeModel A Ref to the model of the node
 * @returns {Object} Methods to deal with filtering for a tree view node
 */
export function useTreeViewNodeFilter(nodeModel, emit) {

  const filterMethod = inject("filterMethod");

  const {
    isFocused,
    unfocus
  } = useFocus();

  const {
    areChildrenLoaded,
  } = useTreeViewNodeChildren(nodeModel);

  const {
    getFilteredChildren
  } = useFilter();

  const filteredChildren = computed(() => getFilteredChildren(nodeModel));

  const isFilteringEnabled = computed(() => typeof unref(filterMethod) === 'function');

  const filterIncludesNode = computed(() => nodeModel.value.treeNodeSpec._.state.matchesFilter || nodeModel.value.treeNodeSpec._.state.subnodeMatchesFilter || false);

  const hasFilteredChildren = computed(() => filteredChildren.value && filteredChildren.value.length > 0);

  const mayHaveFilteredChildren = computed(() => hasFilteredChildren.value || !areChildrenLoaded.value);

  watchEffect(() => {
    const tns = nodeModel.value.treeNodeSpec;
    tns._.state.matchesFilter = !isFilteringEnabled.value || unref(filterMethod)(nodeModel.value);
    tns._.state.subnodeMatchesFilter = filteredChildren.value.length > 0;

    if (!filterIncludesNode.value && isFocused(nodeModel)) {
      unfocus(nodeModel);
      emit(TreeEvent.RequestFirstFocus, true);
    }
  });

  return {
    filteredChildren,
    filterIncludesNode,
    isFilteringEnabled,
    mayHaveFilteredChildren,
  };
}