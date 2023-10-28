import { computed, inject, unref, watchEffect } from "vue";
import { useTreeNodeChildren } from '../children/treeNodeChildren.js';
import { useFilter } from "./filter.js";
import { useFocus } from "../focus/focus.js";
import TreeEvent from '../../enums/event.js';

/**
 * Composable dealing with filtering at the tree node.
 * @param {Ref<TreeNode>} nodeModel A Ref to the model of the node
 * @param {Function} emit The node's emit function, used to emit focus events on the node's behalf
 * @returns {Object} Methods to deal with filtering for a tree node
 */
export function useTreeNodeFilter(nodeModel, emit) {

  const filterMethod = inject("filterMethod");

  const {
    isFocused,
    unfocus
  } = useFocus();

  const {
    areChildrenLoaded,
  } = useTreeNodeChildren(nodeModel);

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