export default {
  props: {
    ariaKeyMap: {
      type: Object,
      required: true
    }
  },
  computed: {
    ariaTabIndex() {
      return this.model.focusable ? 0 : -1;
    }
  },
  created() {
    this.$_treeViewNodeAria_normalizeNodeData();
  },
  watch: {
    'model.focusable': function(newValue) {
      // If focusable is set to true, also focus the treeitem element.
      if (newValue === true) {
        this.$el.focus();
        this.$emit('treeViewNodeAriaFocusable', this.model);
      }

      // In selectionFollowsFocus selection mode, this focus watch is responsible for updating selection.
      if (this.model.selectable && this.selectionMode === 'selectionFollowsFocus') {
        this.model.state.selected = newValue;
      }
    }
  },
  methods: {
    $_treeViewNodeAria_normalizeNodeData() {
      if (typeof this.model.focusable !== 'boolean') {
        this.$set(this.model, 'focusable', false);
      }
    },
    $_treeViewNodeAria_focus() {
      // Actual focusing happens in the "model.focusable" watcher method
      this.model.focusable = true;
    },
    $_treeViewNodeAria_handleChildDeletion(node) {
      if (node.focusable) {
        // When this is the first of several siblings, focus the next node.
        // Otherwise, focus the previous node.
        if (this.model.children.length > 1 && this.model.children.indexOf(node) === 0) {
          this.$_treeViewNodeAria_handleNextFocus(node);
        }
        else {
          this.$_treeViewNodeAria_handlePreviousFocus(node);
        }
      }
    },
    $_treeViewNodeAria_onClick() {
      this.model.focusable = true;
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
        if (this.model.input && !this.model.state.input.disabled) {
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
          if (!this.model.state.expanded) {
            this.$_treeViewNode_onExpandedChange(event);
          }
          else {
            this.model.children[0].focusable = true;
          }
        }
      }
      else if (this.ariaKeyMap.collapseFocusedItem.includes(event.keyCode)) {
        // When focus is on an open node, closes the node.
        // When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node.
        // When focus is on a root node that is also either an end node or a closed node, does nothing.
        if (this.canExpand && this.model.state.expanded) {
          this.$_treeViewNode_onExpandedChange(event);
        }
        else {
          // Parent handles setting its own focusability.
          this.$emit("treeViewNodeAriaRequestParentFocus");
        }
      }
      else if (this.ariaKeyMap.focusFirstItem.includes(event.keyCode)) {
        // Moves focus to first node without opening or closing a node.
        // The actual change on the desired node model is handled at the TreeView level.
        this.$emit("treeViewNodeAriaRequestFirstFocus");
      }
      else if (this.ariaKeyMap.focusLastItem.includes(event.keyCode)) {
        // Moves focus to the last node that can be focused without expanding any nodes that are closed.
        // The actual change on the desired node model is handled at the TreeView level.
        this.$emit("treeViewNodeAriaRequestLastFocus");
      }
      else if (this.ariaKeyMap.focusPreviousItem.includes(event.keyCode)) {
        // Moves focus to the previous node that is focusable without opening or closing a node.
        // If focus is on the first node, does nothing
        // Parent handles setting focusability on a sibling (or child thereof) of this node, or itself.
        this.$emit("treeViewNodeAriaRequestPreviousFocus", this.model);
      }
      else if (this.ariaKeyMap.focusNextItem.includes(event.keyCode)) {
        // Moves focus to the next node that is focusable without opening or closing a node.
        // If focus is on the last node, does nothing.
        // Parent handles setting focusability on a sibling of this node, or its first child.
        this.$emit("treeViewNodeAriaRequestNextFocus", this.model, false);
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
      let childIndex = this.model.children.indexOf(childNode);
      if (childIndex === 0) {
        this.model.focusable = true;
      }
      else {
        let lastModel = this.model.children[childIndex - 1];
        while (lastModel.children.length > 0 && lastModel.expandable && lastModel.state.expanded) {
          lastModel = lastModel.children[lastModel.children.length - 1];
        }

        lastModel.focusable = true;
      }
    },
    $_treeViewNodeAria_handleNextFocus(childNode, ignoreChild) {
      // If the node is expanded, focus first child unless we're ignoring it (this was punted from a grandchild)
      // If the node has a next sibling, focus that
      // Otherwise, punt this up to this node's parent
      let childIndex = this.model.children.indexOf(childNode);
      if (!ignoreChild && childNode.children.length > 0 && childNode.expandable && childNode.state.expanded) {
        childNode.children[0].focusable = true;
      }
      else if (childIndex < this.model.children.length - 1) {
        this.model.children[childIndex + 1].focusable = true;
      }
      else {
        this.$emit('treeViewNodeAriaRequestNextFocus', this.model, true);
      }
    }
  }
};
