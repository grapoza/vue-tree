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
        activateItem: [13, 32], // Return, Space
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
      // If none are found, set to true for the first root.
      // If one is found, set any subsequent to false.
      let nodeQueue = this.model.slice();

      while (nodeQueue.length > 0) {
        let current = nodeQueue.shift();

        // Push children to the front (depth first traversal)
        if (Array.isArray(current.children)) {
          nodeQueue = current.children.concat(nodeQueue);
        }

        if (current.focusable === true) {
          if (this.focusableNodeModel) {
            current.focusable = false;
          }
          else {
            this.$set(this, 'focusableNodeModel', current);
          }
        }
      }

      if (!this.focusableNodeModel) {
        this.$set(this, 'focusableNodeModel', this.model[0]);
        this.$set(this.focusableNodeModel, 'focusable', true);
      }
    }
  },
  methods: {
    $_treeViewAria_handleFocusableChange(newNodeModel) {
      if (this.focusableNodeModel) {
        this.focusableNodeModel.focusable = false;
      }
      this.focusableNodeModel = newNodeModel
    },
    $_treeViewAria_focusFirstNode() {
      this.model[0].focusable = true;
    },
    $_treeViewAria_focusLastNode() {
      let lastModel = this.model[this.model.length - 1];
      while (lastModel.children.length > 0 && lastModel.expandable && lastModel.state.expanded) {
        lastModel = lastModel.children[lastModel.children.length - 1];
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
        while (lastModel.children.length > 0 && lastModel.expandable && lastModel.state.expanded) {
          lastModel = lastModel.children[lastModel.children.length - 1];
        }

        lastModel.focusable = true;
      }
    },
    $_treeViewAria_handleNextFocus(childNode, ignoreChild) {
      // If the node is expanded, focus first child unless we're ignoring it (this was punted from a grandchild)
      // If the node has a next sibling, focus that
      // Otherwise, do nothing
      let childIndex = this.model.indexOf(childNode);
      if (!ignoreChild && childNode.children.length > 0 && childNode.expandable && childNode.state.expanded) {
        childNode.children[0].focusable = true;
      }
      else if (childIndex < this.model.length - 1) {
        this.model[childIndex + 1].focusable = true;
      }
    }
  }
};
