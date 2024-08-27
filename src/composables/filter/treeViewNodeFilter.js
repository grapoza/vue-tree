import { computed, inject, unref, watchEffect } from "vue";
import { useTreeViewNodeChildren } from '../children/treeViewNodeChildren.js';
import { useFilter } from "./filter.js";
import { useFocus } from "../focus/focus.js";
import TreeEvent from '../../enums/event.js';

/**
 * Composable dealing with filtering at the tree view node.
 * @param {Ref<Object>} metaModel A Ref to the metadata model of the node
 * @returns {Object} Methods to deal with filtering for a tree view node
 */
export function useTreeViewNodeFilter(metaModel, emit) {

  const filterMethod = inject("filterMethod");

  const {
    isFocused,
    unfocus
  } = useFocus();

  const {
    areChildrenLoaded,
  } = useTreeViewNodeChildren(metaModel, emit);

  const {
    getFilteredChildren
  } = useFilter();

  const filteredChildren = computed(() => getFilteredChildren(metaModel));

  const isFilteringEnabled = computed(() => typeof unref(filterMethod) === 'function');

  const filterIncludesNode = computed(() => metaModel.value._.state.matchesFilter || metaModel.value._.state.subnodeMatchesFilter || false);

  const hasFilteredChildren = computed(() => filteredChildren.value && filteredChildren.value.length > 0);

  const mayHaveFilteredChildren = computed(() => hasFilteredChildren.value || !areChildrenLoaded.value);

  watchEffect(() => {
    metaModel.value._.state.matchesFilter = !isFilteringEnabled.value || unref(filterMethod)(metaModel.value);
    metaModel.value._.state.subnodeMatchesFilter = filteredChildren.value.length > 0;

    if (!filterIncludesNode.value && isFocused(metaModel)) {
      unfocus(metaModel);
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