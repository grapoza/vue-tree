export default {
  props: {
    customAriaKeyMap: {
      type: Object,
      required: false,
      default: function () { return {}; },
      validator: function (value) {
        // All properties must be non-empty arrays of numbers
        for (const prop in value) {
          if (!Array.isArray(value[prop]) || value[prop].some((e) => !Number.isInteger(e))) {
            console.error(`customAriaKeyMap properties must be Arrays of numbers (corresponding to keyCodes); property '${prop}' fails check.`);
            return false;
          }
        }

        return true;
      }
    }
  },
  data() {
    return {
      defaultAriaKeyMap: {
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
      },
      focusableNodeModel: null
    };
  },
  computed: {
    ariaKeyMap() {
      return Object.assign({}, this.defaultAriaKeyMap, this.customAriaKeyMap);
    }
  },
  mounted() {
    if (this.model.length > 0) {
      // Walk the model looking for focusable attributes.
      // If none are found, set to true for the first root, or the first selected node if one exists.
      // If one is found, set any subsequent to false.
      let firstSelectedNode = null;
      this.$_treeView_depthFirstTraverse((node) => {
        if (node.treeNodeSpec.focusable) {
          if (this.focusableNodeModel) {
            node.treeNodeSpec.focusable = false;
          }
          else {
            this.$set(this, 'focusableNodeModel', node);
          }
        }
        if (this.selectionMode !== null && firstSelectedNode === null && node.treeNodeSpec.state.selected) {
          firstSelectedNode = node;
        }
      });

      if (!this.focusableNodeModel) {
        this.$set(this, 'focusableNodeModel', firstSelectedNode || this.model[0]);
        this.$set(this.focusableNodeModel.treeNodeSpec, 'focusable', true);
      }

      // Also default the selection to the focused node if no selected node was found
      // and the selection mode is selectionFollowsFocus.
      if (firstSelectedNode === null && this.focusableNodeModel.treeNodeSpec.selectable && this.selectionMode === 'selectionFollowsFocus') {
        this.focusableNodeModel.treeNodeSpec.state.selected = true;
      }

      this.$_treeViewNode_enforceSelectionMode();
    }
  },
  watch: {
    selectionMode() {
      this.$_treeViewNode_enforceSelectionMode();
    }
  },
  methods: {
    $_treeViewNode_enforceSelectionMode() {
      if (this.selectionMode === 'single') {
        // This is in TreeViewAria instead of TreeView because the default mixin merge strategy only keeps one 'watch' per prop.
        this.$_treeView_enforceSingleSelectionMode();
      }
      else if (this.selectionMode === 'selectionFollowsFocus') {
        // Make sure the actual focusable item is selected if the mode changes, and deselect all others
        this.$_treeView_depthFirstTraverse((node) => {
          let idPropName = node.treeNodeSpec.idProperty;
          let focusableIdPropName = this.focusableNodeModel.treeNodeSpec.idProperty;
          if (node[idPropName] === this.focusableNodeModel[focusableIdPropName]) {
            if (node.treeNodeSpec.selectable) {
              node.treeNodeSpec.state.selected = true;
            }
          }
          else if (node.treeNodeSpec.state.selected) {
            node.treeNodeSpec.state.selected = false;
          }
        });
      }
    },
    $_treeViewAria_handleFocusableChange(newNodeModel) {
      if (this.focusableNodeModel !== newNodeModel) {
        if (this.focusableNodeModel) {
          this.focusableNodeModel.treeNodeSpec.focusable = false;
        }

        this.$set(this, 'focusableNodeModel', newNodeModel);
      }
    },
    $_treeViewAria_focusFirstNode() {
      this.model[0].treeNodeSpec.focusable = true;
    },
    $_treeViewAria_focusLastNode() {
      let lastModel = this.model[this.model.length - 1];
      let lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
      while (lastModelChildren.length > 0 && lastModel.treeNodeSpec.expandable && lastModel.treeNodeSpec.state.expanded) {
        lastModel = lastModelChildren[lastModelChildren.length - 1];
        lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
      }

      lastModel.treeNodeSpec.focusable = true;
    },
    $_treeViewAria_handleNodeDeletion(node) {
      if (node.treeNodeSpec.focusable) {
        if (this.model.indexOf(node) === 0) {
          if (this.model.length > 0) {
            this.$_treeViewAria_handleNextFocus(node);
          }
        }
        else {
          this.$_treeViewAria_handlePreviousFocus(node);
        }
      }
    },
    $_treeViewAria_handlePreviousFocus(childNode) {
      // If focusing previous of the first child, do nothing.
      // If focusing previous of any other node, focus the last expanded node within the previous sibling.
      let childIndex = this.model.indexOf(childNode);
      if (childIndex > 0) {
        let lastModel = this.model[childIndex - 1];
        let lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
        while (lastModelChildren.length > 0 && lastModel.treeNodeSpec.expandable && lastModel.treeNodeSpec.state.expanded) {
          lastModel = lastModelChildren[lastModelChildren.length - 1];
          lastModelChildren = lastModel[lastModel.treeNodeSpec.childrenProperty];
        }

        lastModel.treeNodeSpec.focusable = true;
      }
    },
    $_treeViewAria_handleNextFocus(childNode, ignoreChild) {
      // If the node is expanded, focus first child unless we're ignoring it (this was punted from a grandchild)
      // If the node has a next sibling, focus that
      // Otherwise, do nothing
      let childIndex = this.model.indexOf(childNode);
      let childNodeChildren = childNode[childNode.treeNodeSpec.childrenProperty];

      if (!ignoreChild && childNodeChildren.length > 0 && childNode.treeNodeSpec.expandable && childNode.treeNodeSpec.state.expanded) {
        childNodeChildren[0].treeNodeSpec.focusable = true;
      }
      else if (childIndex < this.model.length - 1) {
        this.model[childIndex + 1].treeNodeSpec.focusable = true;
      }
    }
  }
};
