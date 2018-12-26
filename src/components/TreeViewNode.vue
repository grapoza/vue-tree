<template>
  <!--
      A Component meant to be used internally by the TreeView component.
      Node objects should be of the form
      {
        id: string,              // An ID that uniquely identifies this node within the tree
        label: string,           // The text to show in the treeview
        children: Array<Object>  // The child nodes of this node
        depth: Number,           // The depth of the node in the tree
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
              @click="toggle">
              <i class="tree-view-node-expanded-indicator"></i></button>
      <span v-else class="spacer"></span>

      <!-- Checkbox -->
      <input :id="'cbx-'+nodeId"
             class="tree-view-node-checkbox"
             type="checkbox"
             v-if="model.checkable"
             v-model="model.state.checked" />
      <span v-else class="spacer"></span>

      <!-- Text (or label, if checkable) -->
      <label v-if="model.checkable"
             :for="'cbx-'+nodeId"
             class="tree-view-node-text">{{ model.label }}</label>
      <span v-else class="tree-view-node-text">{{ model.label }}</span>
    </div>

    <!-- Children -->
    <ul v-show="model.state.expanded" 
        v-if="model.children.length > 0 && model.expandable" 
        class="tree-view-node-children">
      <tree-view-node v-for="(model, index) in model.children"
                      :key="index"
                      :model="model"
                      :tree-id="treeId">
      </tree-view-node>
    </ul>
  </li>
</template>

<script>
  export default {
    name: 'tree-view-node',
    props: {
      model: {
        type: Object,
        required: true,
      },
      treeId: {
        type: String,
        required: false,
      },
    },
    data() {
      return {};
    },
    computed: {
      nodeId() {
        return this.treeId ? `${this.treeId}-${this.model.id}` : null;
      },
    },
    methods: {
      toggle(e) {
        // TODO All behaviors need to be overridable
        if (this.model.children.length > 0 && !e.target.matches("input[type='checkbox']")) {
          this.model.state.expanded = !this.model.state.expanded;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
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
        margin-left: .2rem;
      }
    }

    .tree-view-node-children {
      margin: 0 0 0 2.2rem;
      padding: 0;
      list-style: none;
    }
  }
</style>
