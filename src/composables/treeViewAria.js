import { computed, ref, unref, readonly, onMounted } from 'vue'
import SelectionMode from '../enums/selectionMode.js';

export function useTreeViewAria(model, customAriaKeyMap, selectionMode, depthFirstTraverse, enforceSingleSelectionMode) {

  // CONSTANTS
  const defaultAriaKeyMap = readonly({
    activateItem: [32], // Space
    selectItem: [13], // Enter
    focusLastItem: [35], // End
    focusFirstItem: [36], // Home
    collapseFocusedItem: [37], // Left
    expandFocusedItem: [39], // Right
    focusPreviousItem: [38], // Up
    focusNextItem: [40], // Down
    insertItem: [45], // Insert
    deleteItem: [46] // Delete
  });

  // DATA
  const focusableNodeModel = ref(null);

  // COMPUTED
  const ariaKeyMap = computed(() =>
    Object.assign({}, defaultAriaKeyMap, unref(customAriaKeyMap)));

  // HOOKS
  onMounted(() => {
    if (model.value.length > 0) {
      // Walk the model looking for focusable attributes.
      // If none are found, set to true for the first root, or the first selected node if one exists.
      // If one is found, set any subsequent to false.
      let firstSelectedNode = null;
      depthFirstTraverse((node) => {
        if (node.treeNodeSpec.focusable) {
          if (focusableNodeModel.value) {
            node.treeNodeSpec.focusable = false;
          }
          else {
            focusableNodeModel.value = node;
          }
        }
        if (selectionMode !== SelectionMode.None && firstSelectedNode === null && node.treeNodeSpec.state.selected) {
          firstSelectedNode = node;
        }
      });

      if (!focusableNodeModel.value) {
        focusableNodeModel.value = firstSelectedNode || model.value[0];
        focusableNodeModel.value.treeNodeSpec.focusable = true;
      }

      // Also default the selection to the focused node if no selected node was found
      // and the selection mode is selectionFollowsFocus.
      if (firstSelectedNode === null && focusableNodeModel.value.treeNodeSpec.selectable && selectionMode === SelectionMode.SelectionFollowsFocus) {
        focusableNodeModel.value.treeNodeSpec.state.selected = true;
      }

      enforceSelectionMode(selectionMode);
    }
  });

  // METHODS

  /**
   * Enforces the selection mode for the tree, ensuring only the expected
   * node or nodes are selected.
   */
  function enforceSelectionMode(mode) {
    if (mode === SelectionMode.Single) {
      // This is in TreeViewAria instead of TreeView because the default mixin merge strategy only keeps one 'watch' per prop.  TODO: CAN PROBABLY MOVE THIS NOW
      enforceSingleSelectionMode();
    }
    else if (mode === SelectionMode.SelectionFollowsFocus) {
      // Make sure the actual focusable item is selected if the mode changes, and deselect all others
      depthFirstTraverse((node) => {
        let idPropName = node.treeNodeSpec.idProperty;
        let focusableIdPropName = focusableNodeModel.value.treeNodeSpec.idProperty;
        if (node[idPropName] === focusableNodeModel.value[focusableIdPropName]) {
          if (node.treeNodeSpec.selectable) {
            node.treeNodeSpec.state.selected = true;
          }
        }
        else if (node.treeNodeSpec.state.selected) {
          node.treeNodeSpec.state.selected = false;
        }
      });
    }
  }

  /**
   * Handles changes to the node on which the focusable property is true.
   * A tree can only have one focusable node; that is, one node to which
   * focus is given when the treeview as a whole is given focus, e.g., by
   * tabbing into it.
   * @param {TreeViewNode} newNodeModel The newly focusable node
   */
  function handleFocusableChange(newNodeModel) {
    if (focusableNodeModel.value !== newNodeModel) {
      if (focusableNodeModel.value) {
        focusableNodeModel.value.treeNodeSpec.focusable = false;
      }

      focusableNodeModel.value = newNodeModel;
    }
  }

  /**
   * Sets the first node in the tree as focusable.
   */
  function focusFirstNode() {
    model.value[0].treeNodeSpec.focusable = true;
  }

  /**
   * Sets the last expanded node in the tree as focusable.
   */
  function focusLastNode() {
    let lastModel = model.value[model.value.length - 1];
    let lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
    while (lastModelChildren.length > 0 && lastModel.treeNodeSpec.state.expanded) {
      lastModel = lastModelChildren[lastModelChildren.length - 1];
      lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
    }

    lastModel.treeNodeSpec.focusable = true;
  }

  /**
   * Handles setting the focusable node in the tree when the
   * currently focuable node is deleted.
   * @param {TreeViewNode} node The node that was deleted
   */
  function handleNodeDeletion(node) {
    if (node.treeNodeSpec.focusable) {
      if (model.value.indexOf(node) === 0) {
        if (model.value.length > 0) {
          handleNextFocus(node);
        }
      }
      else {
        handlePreviousFocus(node);
      }
    }
  }

  /**
   * Focuses the previous node in the tree
   * @param {TreeViewNode} childNode The node from which focusable should be moved
   */
  function handlePreviousFocus(childNode) {
    // If focusing previous of the first child, do nothing.
    // If focusing previous of any other node, focus the last expanded node within the previous sibling.
    let childIndex = model.value.indexOf(childNode);
    if (childIndex > 0) {
      let lastModel = model.value[childIndex - 1];
      let lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
      while (lastModelChildren.length > 0 && lastModel.treeNodeSpec.state.expanded) {
        lastModel = lastModelChildren[lastModelChildren.length - 1];
        lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
      }

      lastModel.treeNodeSpec.focusable = true;
    }
  }

  /**
   * Focuses the next node in the tree.
   * @param {TreeViewNode} childNode The node from which focusable should be moved
   * @param {Boolean} ignoreChild True to not consider child nodes. This would be true if a user
   * requests to focus the next node while on the last child of this node; the next sibling of
   * this node should gain focus in that case.
   */
  function handleNextFocus(childNode, ignoreChild) {
    // If the node is expanded, focus first child unless we're ignoring it (this was punted from a grandchild)
    // If the node has a next sibling, focus that
    // Otherwise, do nothing
    let childIndex = model.value.indexOf(childNode);
    let childNodeChildren = childNode[childNode.treeNodeSpec.childrenProperty];

    if (!ignoreChild && childNodeChildren.length > 0 && childNode.treeNodeSpec.state.expanded) {
      childNodeChildren[0].treeNodeSpec.focusable = true;
    }
    else if (childIndex < model.value.length - 1) {
      model.value[childIndex + 1].treeNodeSpec.focusable = true;
    }
  }

  // EXPORT
  return {
    ariaKeyMap,
    enforceSelectionMode,
    handleFocusableChange,
    focusFirstNode,
    focusLastNode,
    handleNodeDeletion,
    handlePreviousFocus,
    handleNextFocus
  };
}