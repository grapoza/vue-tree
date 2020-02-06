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
  created() {
    if (this.model.length > 0) {
      // Walk the model looking for focusable attributes.
      // If none are found, set to true for the first root, or the first selected node if one exists.
      // If one is found, set any subsequent to false.
      let firstSelectedNode = null;
      this.$_treeView_depthFirstTraverse((node) => {
        if (node.focusable) {
          if (this.focusableNodeModel) {
            node.focusable = false;
          }
          else {
            this.$set(this, 'focusableNodeModel', node);
          }
        }
        if (this.selectionMode !== null && firstSelectedNode === null && node.state.selected) {
          firstSelectedNode = node;
        }
      });

      if (!this.focusableNodeModel) {
        this.$set(this, 'focusableNodeModel', firstSelectedNode || this.model[0]);
        this.$set(this.focusableNodeModel, 'focusable', true);
      }

      // Also default the selection to the focused node if no selected node was found
      // and the selection mode is selectionFollowsFocus.
      if (firstSelectedNode === null && this.focusableNodeModel.selectable && this.selectionMode === 'selectionFollowsFocus') {
        this.focusableNodeModel.state.selected = true;
      }
    }
  },
  watch: {
    selectionMode(newValue) {
      if (newValue === 'single') {
        // This is in TreeViewAria instead of TreeView because the default mixin merge strategy only keeps one 'watch' per prop.
        this.$_treeView_enforceSingleSelectionMode();
      }
      else if (newValue === 'selectionFollowsFocus') {
        // Make sure the actual focused item is selected if the mode changes, and deselect all others
        this.$_treeView_depthFirstTraverse((node) => {
          let idPropName = this.$_treeView_getIdPropName(node);
          let focusableIdPropName = this.$_treeView_getIdPropName(this.focusableNodeModel);
          if (node[idPropName] === this.focusableNodeModel[focusableIdPropName]) {
            if (node.selectable) {
              node.state.selected = true;
            }
          }
          else if (node.state.selected) {
            node.state.selected = false;
          }
        });
      }
    }
  },
  methods: {
    $_treeViewAria_handleFocusableChange(newNodeModel) {
      if (this.focusableNodeModel) {
        this.focusableNodeModel.focusable = false;
      }

      this.$set(this, 'focusableNodeModel', newNodeModel);
    },
    $_treeViewAria_focusFirstNode() {
      this.model[0].focusable = true;
    },
    $_treeViewAria_focusLastNode() {
      let lastModel = this.model[this.model.length - 1];
      let lastModelChildren = lastModel[this.$_treeView_getChildrenPropName(lastModel)];
      while (lastModelChildren.length > 0 && lastModel.expandable && lastModel.state.expanded) {
        lastModel = lastModelChildren[lastModelChildren.length - 1];
        lastModelChildren = lastModel[this.$_treeView_getChildrenPropName(lastModel)];
      }

      lastModel.focusable = true;
    },
    $_treeViewAria_handleNodeDeletion(node) {
      if (node.focusable) {
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
        let lastModelChildren = lastModel[this.$_treeView_getChildrenPropName(lastModel)];
        while (lastModelChildren.length > 0 && lastModel.expandable && lastModel.state.expanded) {
          lastModel = lastModelChildren[lastModelChildren.length - 1];
          lastModelChildren = lastModel[this.$_treeView_getChildrenPropName(lastModel)];
        }

        lastModel.focusable = true;
      }
    },
    $_treeViewAria_handleNextFocus(childNode, ignoreChild) {
      // If the node is expanded, focus first child unless we're ignoring it (this was punted from a grandchild)
      // If the node has a next sibling, focus that
      // Otherwise, do nothing
      let childIndex = this.model.indexOf(childNode);
      let childNodeChildren = childNode[this.$_treeView_getChildrenPropName(childNode)];

      if (!ignoreChild && childNodeChildren.length > 0 && childNode.expandable && childNode.state.expanded) {
        childNodeChildren[0].focusable = true;
      }
      else if (childIndex < this.model.length - 1) {
        this.model[childIndex + 1].focusable = true;
      }
    }
  }
};
