<template>
  <!--
      A Component meant to be used internally by the TreeView component. See README.md
      for a description of the expected data format.
  -->
  <li :id="nodeId" class="tree-view-node">
    <div class="tree-view-node-self"
         @click="onClick"
         @dblclick="onDblclick">

      <!-- Expander -->
      <button type="button"
              v-if="model.children.length > 0 && model.expandable"
              class="tree-view-node-self-expander"
              :class="{ 'tree-view-node-self-expanded': model.state.expanded }"
              @click="onExpandedChange">
              <i class="tree-view-node-self-expanded-indicator"></i></button>
      <span v-else class="tree-view-node-self-spacer"></span>

      <!-- Checkbox and label -->
      <label v-if="model.checkable"
             :for="checkboxId"
             class="tree-view-node-self-label">
        <input :id="checkboxId"
              class="tree-view-node-self-checkbox"
              type="checkbox"
              v-model="model.state.checked"
              @change="onCheckedChange" />
        {{ model.label }}
      </label>

      <!-- Text (if not checkable) -->
      <span v-else class="tree-view-node-self-text">{{ model.label }}</span>
    </div>

    <!-- Children -->
    <ul v-show="model.state.expanded" 
        v-if="model.children.length > 0 && model.expandable" 
        class="tree-view-node-children">
      <TreeViewNode v-for="nodeModel in model.children"
                      :key="nodeModel.id"
                      :depth="depth + 1"
                      :model="nodeModel"
                      :tree-id="treeId"
                      @treeViewNodeClick="(t, e)=>$emit('treeViewNodeClick', t, e)"
                      @treeViewNodeDblclick="(t, e)=>$emit('treeViewNodeDblclick', t, e)"
                      @treeViewNodeCheckedChange="(t, e)=>$emit('treeViewNodeCheckedChange', t, e)"
                      @treeViewNodeExpandedChange="(t, e)=>$emit('treeViewNodeExpandedChange', t, e)">
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
          if (typeof value.id !== 'number' && typeof value.id !== 'string') {
            console.error("model.id is required and must be a number or string.");
            return false;
          } 
          else if(typeof value.label !== 'string') {
            console.error("model.label is required and must be a string.");
            return false;
          }

          return true;
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
       * Normalizes the data model to the format consumable by TreeViewNode.
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
      onExpandedChange(event) {
        if (this.model.children.length > 0) {
          this.model.state.expanded = !this.model.state.expanded;
          this.$emit('treeViewNodeExpandedChange', this.model, event);
        }
      },
      onClick(event) {
        // Don't fire this if the target is the checkbox or expander, which have their own events
        if (!event.target.matches(".tree-view-node-self-checkbox, .tree-view-node-self-expander")) {
          this.$emit('treeViewNodeClick', this.model, event);
        }
      },
      onDblclick(event) {
        // Don't fire this if the target is the checkbox or expander, which have their own events
        if (!event.target.matches(".tree-view-node-self-checkbox, .tree-view-node-self-expander")) {
          this.$emit('treeViewNodeDblclick', this.model, event);
        }
      },
      onCheckedChange(event) {
        this.$emit('treeViewNodeCheckedChange', this.model, event);
      }
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

        .tree-view-node-self-expander {
          padding: 0;
          background: none;
          border: none;

          i.tree-view-node-self-expanded-indicator {
            font-style: normal;
            
            &::before {
              content: '+';
            }
          }

          &.tree-view-node-self-expanded {

            i.tree-view-node-self-expanded-indicator {

              &::before {
                content: '-';
              }
            }
          }
        }

        .tree-view-node-self-expander, .tree-view-node-self-checkbox, .tree-view-node-self-spacer {
          min-width: 1rem;
          margin: 0;
        }

        .tree-view-node-self-text {
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
