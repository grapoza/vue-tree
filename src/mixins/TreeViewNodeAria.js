import SelectionMode from '../enums/selectionMode';
import TvEvent from '../enums/event';

export default {
  props: {
    ariaKeyMap: {
      type: Object,
      required: true
    }
  },
  computed: {
    ariaTabIndex() {
      return this.model.treeNodeSpec.focusable ? 0 : -1;
    }
  },
  created() {
    this.$_treeViewNodeAria_normalizeNodeData();
  },
  watch: {
    'model.treeNodeSpec.focusable': function(newValue) {
      if (newValue === true) {
        // If focusable is set to true and the tree is mounted in the DOM,
        // also focus the node's element.
        if (this.isMounted) {
          this.$el.focus();
        }
        this.$emit(TvEvent.FocusableChange, this.model);
      }

      // In selectionFollowsFocus selection mode, this focus watch is responsible for updating selection.
      if (this.model.treeNodeSpec.selectable && this.selectionMode === SelectionMode.SelectionFollowsFocus) {
        this.model.treeNodeSpec.state.selected = newValue;
      }
    }
  },
  methods: {
    $_treeViewNodeAria_normalizeNodeData() {
      if (!this.model.treeNodeSpec) {
        this.$set(this.model, 'treeNodeSpec', {});
      }
      if (typeof this.model.treeNodeSpec.focusable !== 'boolean') {
        this.$set(this.model.treeNodeSpec, 'focusable', false);
      }
    },
    $_treeViewNodeAria_focus() {
      // Actual focusing happens in the "model.treeNodeSpec.focusable" watcher method
      this.model.treeNodeSpec.focusable = true;
    },
    $_treeViewNodeAria_handleChildDeletion(node) {
      if (node.treeNodeSpec.focusable) {
        // When this is the first of several siblings, focus the next node.
        // Otherwise, focus the previous node.
        if (this.children.length > 1 && this.children.indexOf(node) === 0) {
          this.$_treeViewNodeAria_handleNextFocus(node);
        }
        else {
          this.$_treeViewNodeAria_handlePreviousFocus(node);
        }
      }
    },
    $_treeViewNodeAria_onClick() {
      this.model.treeNodeSpec.focusable = true;
    },
    $_treeViewNodeAria_onKeyDown(event) {
      let eventHandled = true;

      // Do nothing when modifiers or shift are present.
      if (event.altKey || event.ctrlKey || event.metaKey || event.shift) {
        return;
      }

      if (this.ariaKeyMap.activateItem.includes(event.keyCode)) {
        // Performs the default action (e.g. onclick event) for the focused node.
        // Note that splitting activation and selection so explicitly differs from
        // https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-22 (Enter description, and Selection in multi-select trees)
        if (this.model.treeNodeSpec.input && !this.model.treeNodeSpec.state.input.disabled) {
          let tvns = this.$el.querySelector('.tree-view-node-self');
          let target = tvns.querySelector('.tree-view-node-self-input') || tvns.querySelector('input');

          if (target) {
            // Note: until there's a need, this just dumbly clicks the .t-v-n-s-i or first input if it exists.
            let clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
            target.dispatchEvent(clickEvent);
          }
        }
      }
      else if (this.ariaKeyMap.selectItem.includes(event.keyCode)) {
        // Toggles selection for the focused node.
        // Note that splitting activation and selection so explicitly differs from
        // https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-22 (Enter description, and Selection in multi-select trees)
        this.$_treeViewNode_toggleSelected(event);
      }
      else if (this.ariaKeyMap.expandFocusedItem.includes(event.keyCode)) {
        // When focus is on a closed node, opens the node; focus does not move.
        // When focus is on a open node, moves focus to the first child node.
        // When focus is on an end node, does nothing.
        if (this.canExpand) {
          if (!this.model.treeNodeSpec.state.expanded) {
            this.$_treeViewNode_onExpandedChange(event);
          }
          else {
            this.children[0].treeNodeSpec.focusable = true;
          }
        }
      }
      else if (this.ariaKeyMap.collapseFocusedItem.includes(event.keyCode)) {
        // When focus is on an open node, closes the node.
        // When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node.
        // When focus is on a root node that is also either an end node or a closed node, does nothing.
        if (this.canExpand && this.model.treeNodeSpec.state.expanded) {
          this.$_treeViewNode_onExpandedChange(event);
        }
        else {
          // Parent handles setting its own focusability.
          this.$emit(TvEvent.RequestParentFocus);
        }
      }
      else if (this.ariaKeyMap.focusFirstItem.includes(event.keyCode)) {
        // Moves focus to first node without opening or closing a node.
        // The actual change on the desired node model is handled at the TreeView level.
        this.$emit(TvEvent.RequestFirstFocus);
      }
      else if (this.ariaKeyMap.focusLastItem.includes(event.keyCode)) {
        // Moves focus to the last node that can be focused without expanding any nodes that are closed.
        // The actual change on the desired node model is handled at the TreeView level.
        this.$emit(TvEvent.RequestLastFocus);
      }
      else if (this.ariaKeyMap.focusPreviousItem.includes(event.keyCode)) {
        // Moves focus to the previous node that is focusable without opening or closing a node.
        // If focus is on the first node, does nothing
        // Parent handles setting focusability on a sibling (or child thereof) of this node, or itself.
        this.$emit(TvEvent.RequestPreviousFocus, this.model);
      }
      else if (this.ariaKeyMap.focusNextItem.includes(event.keyCode)) {
        // Moves focus to the next node that is focusable without opening or closing a node.
        // If focus is on the last node, does nothing.
        // Parent handles setting focusability on a sibling of this node, or its first child.
        this.$emit(TvEvent.RequestNextFocus, this.model, false);
      }
      else if (this.ariaKeyMap.insertItem.includes(event.keyCode)) {
        // Trigger insertion of a new child item if allowed.
        // Focus is not moved.
        this.$_treeViewNode_onAddChild(event);
      }
      else if (this.ariaKeyMap.deleteItem.includes(event.keyCode)) {
        // Trigger deletion of the current node if allowed.
        // Focus is moved to the previous node if available, or the next node.
        this.$_treeViewNode_onDelete(event);
      }
      else {
        eventHandled = false;
      }

      if (eventHandled) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    $_treeViewNodeAria_handlePreviousFocus(childNode) {
      // If focusing previous of the first child, focus this parent.
      // If focusing previous of any other node, focus the last expanded node within the previous sibling.
      let childIndex = this.children.indexOf(childNode);
      if (childIndex === 0) {
        this.model.treeNodeSpec.focusable = true;
      }
      else {
        let lastModel = this.children[childIndex - 1];
        let lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
        while (lastModelChildren.length > 0 && lastModel.treeNodeSpec.expandable && lastModel.treeNodeSpec.state.expanded) {
          lastModel = lastModelChildren[lastModelChildren.length - 1];
        }

        lastModel.treeNodeSpec.focusable = true;
      }
    },
    $_treeViewNodeAria_handleNextFocus(childNode, ignoreChild) {
      // If the node is expanded, focus first child unless we're ignoring it (this was punted from a grandchild)
      // If the node has a next sibling, focus that
      // Otherwise, punt this up to this node's parent
      let childIndex = this.children.indexOf(childNode);
      let childNodeChildrenPropName = childNode.treeNodeSpec.childrenProperty;
      if (!ignoreChild && childNode[childNodeChildrenPropName].length > 0 && childNode.treeNodeSpec.expandable && childNode.treeNodeSpec.state.expanded) {
        childNode[childNodeChildrenPropName][0].treeNodeSpec.focusable = true;
      }
      else if (childIndex < this.children.length - 1) {
        this.children[childIndex + 1].treeNodeSpec.focusable = true;
      }
      else {
        this.$emit(TvEvent.RequestNextFocus, this.model, true);
      }
    }
  }
};
