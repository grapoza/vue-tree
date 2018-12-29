<template>
  <!--
      A Component meant to be used internally by the TreeView component.
      Node objects should be of the form
      {
        id: string,              // An ID that uniquely identifies this node within the tree
        label: string,           // The text to show in the treeview
        children: Array<Object>  // The child nodes of this node
        expandable: boolean,     // True to show a toggle for expanding nodes' subnode lists
        checkable: boolean,      // True to show a checkbox for the node
        selectable: boolean,     // True to allow the node to be selected
        state: {
          checked: boolean,      // True if this node's checkbox is checked
          expanded: boolean,     // True if this node's subnode list is expanded
          selected: boolean      // True if the node is selected
        }
      }
  -->
  <li :id="nodeId" class="tree-view-node">
    <div class="tree-view-node-self">
      <!-- Expander -->
      <button type="button"
              v-if="model.children.length > 0 && model.expandable"
              class="tree-view-node-expander"
              :class="{ 'tree-view-node-expanded': model.state.expanded }"
              @click="$_treeViewNode_toggleExpanded">
              <i class="tree-view-node-expanded-indicator"></i></button>
      <span v-else class="spacer"></span>

      <!-- Checkbox and label -->
      <label v-if="model.checkable"
             :for="checkboxId"
             class="tree-view-node-label">
        <input :id="checkboxId"
              class="tree-view-node-checkbox"
              type="checkbox"
              v-model="model.state.checked" />
        {{ model.label }}
      </label>

      <!-- Text (if not checkable) -->
      <span v-else class="tree-view-node-text">{{ model.label }}</span>
    </div>

    <!-- Children -->
    <ul v-show="model.state.expanded" 
        v-if="model.children.length > 0 && model.expandable" 
        class="tree-view-node-children">
      <TreeViewNode v-for="(nodeModel) in model.children"
                      :key="nodeModel.id"
                      :depth="depth + 1"
                      :model="nodeModel"
                      :tree-id="treeId">
      </TreeViewNode>
    </ul>
  </li>
</template>

<script>
  export default {
    name: 'TreeViewNode',
    props: {
      model: {
        type: Object,
        required: true,
        validator: function (value) {
          // id and label are required
          return value.id !== null && typeof value.id !== 'undefined' 
              && value.label !== null && typeof value.label !== 'undefined';
        }
      },
      depth: {
        type: Number,
        required: true
      },
      treeId: {
        type: String,
        required: false
      },
    },
    data() {
      return {};
    },
    created() {
      this.$_treeViewNode_normalizeNodeData();
    },
    computed: {
      nodeId() {
        return this.treeId ? `${this.treeId}-${this.model.id}` : null;
      },
      checkboxId() {
        return this.nodeId ? `${this.nodeId}-cbx` : null;
      }
    },
    methods: {
      /*
       * Normalizes the raw data model to the format consumable by TreeViewNode.
       */
      $_treeViewNode_normalizeNodeData() {

        // Set expected properties if not provided
        if (!Array.isArray(this.model.children)) {
          this.model.children = [];
        }
        if (typeof this.model.expandable !== 'boolean') {
          this.model.expandable = true;
        }
        if (typeof this.model.checkable !== 'boolean') {
          this.model.checkable = false;
        }
        if (typeof this.model.selectable !== 'boolean') {
          this.model.selectable = false;
        }
        if (this.model.state === null || typeof this.model.state !== 'object') {
          this.model.state = {};
        }
        if (typeof this.model.state.expanded !== 'boolean') {
          this.model.state.expanded = false;
        }
        if (typeof this.model.state.checked !== 'boolean') {
          this.model.state.checked = false;
        }
        if (typeof this.model.state.selected !== 'boolean') {
          this.model.state.selected = false;
        }
      },
      $_treeViewNode_toggleExpanded(e) {
        // TODO All behaviors need to be overridable
        if (this.model.children.length > 0 && !e.target.matches("input[type='checkbox']")) {
          this.model.state.expanded = !this.model.state.expanded;
        }
      },
    },
  };
</script>

<style lang="scss">
  .tree-view {

    .tree-view-node {
      padding-left: 0;

      &:first-child {
        margin-top: 0;
      }

      .tree-view-node-self {
        display: flex;
        align-items: center;
        line-height: 1.2rem;

        .tree-view-node-expander {
          padding: 0;
          background: none;
          border: none;

          i.tree-view-node-expanded-indicator {
            font-style: normal;
            
            &::before {
              content: '+';
            }
          }

          &.tree-view-node-expanded {

            i.tree-view-node-expanded-indicator {

              &::before {
                content: '-';
              }
            }
          }
        }

        .tree-view-node-expander, .tree-view-node-checkbox, .spacer {
          min-width: 1rem;
          margin: 0;
        }

        .tree-view-node-text {
          margin-left: 1.2rem;
        }
      }

      .tree-view-node-children {
        margin: 0 0 0 2.2rem;
        padding: 0;
        list-style: none;
      }
    }
  }
</style>
