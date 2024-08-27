import { computed, unref, watch } from 'vue'
import { useFocus } from './focus.js';
import { useChildren } from '../children/children.js';
import TreeEvent from '../../enums/event.js';

/**
 * Composable dealing with focus handling at the tree view node.
 * @param {Ref<Object>} metaModel A Ref to the meta model of the node
 * @param {Ref<Element>} nodeElement A Ref to the HTML Element for the node
 * @param {Function} emit The TreeViewNode's emit function, used to emit selection events on the node's behalf
 * @param {Ref<Boolean>} isMounted A Ref to the isMounted property of the node
 * @returns {Object} Methods to deal with tree view node level focus
 */
export function useTreeViewNodeFocus(metaModel, nodeElement, emit, isMounted) {

  const { focus, focusFirst, focusLast, focusNext, focusPrevious, isFocused, unfocus } = useFocus();

  const { getMetaChildren } = useChildren();

  const metaModelChildren = computed(() => getMetaChildren(metaModel));

  watch(() => metaModel.value.focusable, function (newValue) {

    if (newValue === true) {
      // If focusable is set to true and the tree is mounted in the DOM,
      // also focus the node's element unless explicitly told not to do so.
      if (isMounted.value && !metaModel.value._.keepCurrentDomFocus) {
        nodeElement.value.focus();
      }

      delete metaModel.value._.keepCurrentDomFocus;

      emit(TreeEvent.FocusableChange, metaModel.value);
    }
  });

  /**
   * Marks the node as the focusable node in the tree
   * @param {boolean} keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   */
  function focusNode(keepCurrentDomFocus = false) {
    focus(metaModel, keepCurrentDomFocus);
  }

  function unfocusNode() {
    unfocus(metaModel);
  }

  function isFocusedNode() {
    return isFocused(metaModel);
  }

  /**
   * Sets the first node in the node's children as focusable.
   * @param {boolean} keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   */
  function focusFirstChild(keepCurrentDomFocus = false) {
    focusFirst(metaModelChildren.value, keepCurrentDomFocus);
  }

  /**
   * Sets the last expanded node in this part of the hierarchy as focusable.
   * @param {boolean} keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   */
  function focusLastChild(keepCurrentDomFocus = false) {
    focusLast(metaModelChildren.value, keepCurrentDomFocus);
  }

  /**
   * Focuses the next node in the tree.
   * @param {Object} childMetaNode The meta node from which focusable should be moved
   * @param {Boolean} ignoreChild True to not consider child nodes. This would be true if a user
   * requests to focus the next node while on the last child of this node; the next sibling of
   * this node should gain focus in that case, or the parent node if there is no next sibling.
   * @param {boolean} keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   */
  function focusNextNode(childMetaNode, ignoreChild, keepCurrentDomFocus = false) {
    // Call focusNext and see if it succeeds in focusing.
    // If not, punt this up to this node's parent.
    if (!focusNext(metaModelChildren.value, childMetaNode, ignoreChild, keepCurrentDomFocus)) {
      emit(TreeEvent.RequestNextFocus, unref(metaModel), true);
    }
  }

  /**
   * Focuses the previous node in the tree
   * @param {TreeViewNode} childMetaNode The meta node from which focusable should be moved
   * @param {boolean} keepCurrentDomFocus If true, does not try to focus the node's element in the DOM
   */
  function focusPreviousNode(childMetaNode, keepCurrentDomFocus = false) {
    // If focusing previous of the first child, focusPrevious returns false. Focus this node.
    if (!focusPrevious(metaModelChildren.value, childMetaNode, keepCurrentDomFocus)) {
      focusNode(keepCurrentDomFocus);
    }
  }

  return {
    focusNode,
    unfocusNode,
    isFocusedNode,
    focusFirstChild,
    focusLastChild,
    focusNextNode,
    focusPreviousNode,
  }
}