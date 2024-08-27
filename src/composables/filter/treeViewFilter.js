import { watch } from 'vue';
import { useFilter } from './filter.js';
import { useFocus } from '../focus/focus.js';

/**
 * Composable dealing with filter handling at the top level of the tree view.
 * @param {Ref<Object[]>} metaModel A Ref to the top level meta model of the tree
 * @returns {Object} Methods to deal with tree view level filtering
 */
export function useTreeViewFilter(metaModel) {

  const { getFilteredNodes } = useFilter();

  const { focusFirst } = useFocus();

  let needsRefocusing = false;

  // When the filter changes, see if all nodes were removed.
  // If they were, manually restore focus the next time the filtered list changes.
  watch(() => getFilteredNodes(metaModel), () => {
    if (getFilteredNodes(metaModel).length > 0) {
      if (needsRefocusing) {
        focusFirst(metaModel, true);
      }

      needsRefocusing = false;
    }
    else {
      needsRefocusing = true;
    }
  })

  // All this composable really does is set up the watcher and internally handle the refocusing logic.
  return {};
}