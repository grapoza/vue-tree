import { ComponentPublicInstance, computed, inject, MaybeRef, Ref, unref, watchEffect } from "vue";
import { useTreeViewNodeChildren } from '../children/treeViewNodeChildren';
import { useFilter } from "./filter";
import { useFocus } from "../focus/focus";
import { TreeEvent } from '../../types/event';
import { TreeViewFilterMethod, TreeViewNodeMetaModel } from "types/treeView";
import TreeViewNode from "../../components/TreeViewNode.vue";

/**
 * Composable dealing with filtering at the tree view node.
 * @param metaModel A Ref to the metadata model of the node
 * @returns Methods to deal with filtering for a tree view node
 */
export function useTreeViewNodeFilter(
  metaModel: Ref<TreeViewNodeMetaModel>,
  emit: ComponentPublicInstance<typeof TreeViewNode>["emits"]
) {
  const filterMethod = inject<MaybeRef<TreeViewFilterMethod>>("filterMethod");

  const { isFocused, unfocus } = useFocus();

  const { areChildrenLoaded } = useTreeViewNodeChildren(metaModel, emit);

  const { getFilteredChildren } = useFilter();

  const filteredChildren = computed(() => getFilteredChildren(metaModel));

  const isFilteringEnabled = computed(() => typeof unref(filterMethod) === "function");

  const filterIncludesNode = computed(
    () =>
      metaModel.value._.state.matchesFilter || metaModel.value._.state.subnodeMatchesFilter || false
  );

  const hasFilteredChildren = computed(
    () => filteredChildren.value && filteredChildren.value.length > 0
  );

  const mayHaveFilteredChildren = computed(
    () => hasFilteredChildren.value || !areChildrenLoaded.value
  );

  watchEffect(() => {
    metaModel.value._.state.matchesFilter =
      !isFilteringEnabled.value || unref(filterMethod!)(metaModel.value);
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