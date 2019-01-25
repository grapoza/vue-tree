<template>
  <!--
      A Component meant to be used internally by the TreeView component. See README.md
      for a description of the expected data format.
  -->
  <li :id="nodeId" class="tree-view-node">
    <div class="tree-view-node-self"
         @click="$_treeViewNode_onClick"
         @dblclick="$_treeViewNode_onDblclick">

      <!-- Expander -->
      <button :id="expanderId"
              type="button"
              v-if="model.children.length > 0 && model.expandable"
              class="tree-view-node-self-expander"
              :class="{ 'tree-view-node-self-expanded': model.state.expanded }"
              @click="$_treeViewNode_onExpandedChange">
              <i class="tree-view-node-self-expanded-indicator"></i></button>
      <span v-else class="tree-view-node-self-spacer"></span>

      <!-- Input and label -->
      <label v-if="model.input"
             :for="inputId"
             class="tree-view-node-self-label">

        <input v-if="model.input.type === 'checkbox'"
              :id="inputId"
              :class="inputClass"
              :type="model.input.type"
              :disabled="model.state.input.disabled"
              v-model="model.state.input.value"
              @change="$_treeViewNode_onCheckboxChange" />

        <input v-if="model.input.type === 'radio'"
              :id="inputId"
              :class="inputClass"
              :type="model.input.type"
              :name="model.input.name"
              :value="model.input.value"
              :disabled="model.state.input.disabled"
              v-model="radioGroupValues[model.input.name]"
              @change="$_treeViewNode_onRadioChange" />

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
                      :parent-id="model.id"
                      :tree-id="treeId"
                      :radio-group-values="radioGroupValues"
                      @treeViewNodeClick="(t, e)=>$emit('treeViewNodeClick', t, e)"
                      @treeViewNodeDblclick="(t, e)=>$emit('treeViewNodeDblclick', t, e)"
                      @treeViewNodeCheckboxChange="(t, e)=>$emit('treeViewNodeCheckboxChange', t, e)"
                      @treeViewNodeRadioChange="(t, e)=>$emit('treeViewNodeRadioChange', t, e)"
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
      radioGroupValues: {
        type: Object,
        required: true
      },
      parentId: {
        type: [String, Number],
        required: false
      },
      treeId: {
        type: String,
        required: false
      }
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
      inputId() {
        return this.nodeId ? `${this.nodeId}-input` : null;
      },
      inputClass() {
        if (!this.model.input || typeof this.model.input !== 'object') {
          return null;
        }

        let nodeInputClass = 'tree-view-node-self-input ';

        switch (this.model.input.type) {
          case 'checkbox':
            nodeInputClass += 'tree-view-node-self-checkbox';
            break;
          case 'radio':
            nodeInputClass += 'tree-view-node-self-radio';
            break;
          default:
            nodeInputClass = null;
            break;
        }

        return nodeInputClass;
      },
      expanderId() {
        return this.nodeId ? `${this.nodeId}-exp` : null;
      }
    },
    methods: {
      /*
       * Normalizes the data model to the format consumable by TreeViewNode.
       */
      $_treeViewNode_normalizeNodeData() {

        // Set expected properties if not provided
        if (!Array.isArray(this.model.children)) {
          this.$set(this.model, 'children', []);
        }

        // Set basic node options
        if (typeof this.model.expandable !== 'boolean') {
          this.$set(this.model, 'expandable', true);
        }
        if (typeof this.model.selectable !== 'boolean') {
          this.$set(this.model, 'selectable', false);
        }

        this.$_treeViewNode_normalizeNodeInputData();
        this.$_treeViewNode_normalizeNodeStateData();
      },
      /**
       * Normalizes the data model's data related to input element generation.
       */
      $_treeViewNode_normalizeNodeInputData() {

        let input = this.model.input;

        // For nodes that are inputs, they must specify at least a type.
        // Only a subset of types are accepted.
        if (input === null || typeof input !== 'object' || !['checkbox', 'radio'].includes(input.type)) {
          this.$set(this.model, 'input', null);
        }
        else {
          if (typeof input.name !== 'string' || input.name.trim().length === 0) {
            this.$set(input, 'name', null);
          }

          if (input.type === 'radio') {
            if (typeof input.name !== 'string' || input.name.trim().length === 0) {
              this.$set(input, 'name', 'unspecifiedRadioName');
            }
            if (typeof input.value !== 'string' || input.value.trim().length === 0) {
              this.$set(input, 'value', this.model.label.replace(/[\s&<>"'\/]/g, ''));
            }
            if (!this.radioGroupValues.hasOwnProperty(input.name)) {
              this.$set(this.radioGroupValues, input.name, '');
            }
          }
        }
      },
      /**
       * Normalizes the data model's data related to the node's state.
       */
      $_treeViewNode_normalizeNodeStateData() {
        if (this.model.state === null || typeof this.model.state !== 'object') {
          this.$set(this.model, 'state', {});
        }

        let state = this.model.state;

        if (typeof state.expanded !== 'boolean') {
          this.$set(state, 'expanded', false);
        }
        if (typeof state.selected !== 'boolean') {
          this.$set(state, 'selected', false);
        }

        if (this.model.input) {
          if (state.input === null || typeof state.input !== 'object') {
            this.$set(state, 'input', {});
          }

          if (state.input.disabled === null || typeof state.input.disabled !== 'boolean') {
            this.$set(state.input, 'disabled', false);
          }

          if (this.model.input.type === 'checkbox') {

            if (typeof state.input.value !== 'boolean') {
              this.$set(state.input, 'value', false);
            }
          }
        }
      },
      $_treeViewNode_onCheckboxChange(event) {
        this.$emit('treeViewNodeCheckboxChange', this.model, event);
      },
      $_treeViewNode_onRadioChange(event) {
        this.$emit('treeViewNodeRadioChange', this.model, event);
      },
      $_treeViewNode_onExpandedChange(event) {
        this.model.state.expanded = !this.model.state.expanded;
        this.$emit('treeViewNodeExpandedChange', this.model, event);
      },
      $_treeViewNode_onClick(event) {
        // Don't fire this if the target is the input or expander, which have their own events
        if (!event.target.matches("input, .tree-view-node-self-expander")) {
          this.$emit('treeViewNodeClick', this.model, event);
        }
      },
      $_treeViewNode_onDblclick(event) {
        // Don't fire this if the target is the input or expander, which have their own events
        if (!event.target.matches("input, .tree-view-node-self-expander")) {
          this.$emit('treeViewNodeDblclick', this.model, event);
        }
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

        .tree-view-node-self-expander,
        .tree-view-node-self-checkbox,
        .tree-view-node-self-radio,
        .tree-view-node-self-spacer {
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
