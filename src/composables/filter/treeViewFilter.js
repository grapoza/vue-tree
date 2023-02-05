import { watch } from 'vue';
import { useFilter } from './filter.js';
import { useFocus } from '../focus/focus.js';

/**
 * Composable dealing with filter handling at the top level of the tree view.
 * @param {Ref<TreeViewNode[]>} treeModel A Ref to the top level model of the tree
 * @returns {Object} Methods to deal with tree view level filtering
 */
export function useTreeViewFilter(treeModel) {

  const { getFilteredNodes } = useFilter();

  const { focusFirst } = useFocus();

  let needsRefocusing = getFilteredNodes(treeModel).length === 0;

  // When the filter changes, see if all nodes were removed.
  // If they were, manually restore focus the next time the filtered list changes.
  watch(() => getFilteredNodes(treeModel), () => {
    if (getFilteredNodes(treeModel).length > 0) {
      if (needsRefocusing) {
        focusFirst(treeModel, true);
      }

      needsRefocusing = false;
    }
    else {
      needsRefocusing = true;
    }
  })

  return {};
}