<template>
  <!--
      A Component meant to be used internally by the TreeView component. See README.md
      for a description of the expected data format.
  -->
  <li :id="nodeId"
      class="tree-view-node"
      :class="customClasses.treeViewNode">
    <div class="tree-view-node-self"
         :class="customClasses.treeViewNodeSelf"
         @click="$_treeViewNode_onClick"
         @dblclick="$_treeViewNode_onDblclick">

      <!-- Expander -->
      <button :id="expanderId"
              type="button"
              v-if="model.children.length > 0 && model.expandable"
              class="tree-view-node-self-expander"
              :class="[customClasses.treeViewNodeSelfExpander,
                       model.state.expanded ? 'tree-view-node-self-expanded' : '',
                       model.state.expanded ? customClasses.treeViewNodeSelfExpanded : '']"
              @click="$_treeViewNode_onExpandedChange">
              <i class="tree-view-node-self-expanded-indicator"
                 :class="customClasses.treeViewNodeSelfExpandedIndicator"></i></button>
      <span v-else
            class="tree-view-node-self-spacer"
            :class="customClasses.treeViewNodeSelfSpacer"></span>

      <!-- Inputs and labels -->
      <!-- Checkbox -->
      <slot v-if="model.input && model.input.type === 'checkbox'"
            name="checkbox"
            :model="model"
            :customClasses="customClasses"
            :inputId="inputId"
            :checkboxChangeHandler="$_treeViewNode_onCheckboxChange">

        <label :for="inputId"
               :title="model.title"
               class="tree-view-node-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 class="tree-view-node-self-input tree-view-node-self-checkbox"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfCheckbox]"
                 type="checkbox"
                 :disabled="model.state.input.disabled"
                 v-model="model.state.input.value"
                 @change="$_treeViewNode_onCheckboxChange" />

          {{ model.label }}
        </label>
      </slot>

      <!-- Radiobutton -->
      <slot v-else-if="model.input && model.input.type === 'radio'"
            name="radio"
            :model="model"
            :customClasses="customClasses"
            :inputId="inputId"
            :inputModel="radioGroupValues[model.input.name]"
            :radioChangeHandler="$_treeViewNode_onRadioChange">

        <label :for="inputId"
               :title="model.title"
               class="tree-view-node-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 class="tree-view-node-self-input tree-view-node-self-radio"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfRadio]"
                 type="radio"
                 :name="model.input.name"
                 :value="model.input.value"
                 :disabled="model.state.input.disabled"
                 v-model="radioGroupValues[model.input.name]"
                 @change="$_treeViewNode_onRadioChange" />

          {{ model.label }}
        </label>
      </slot>

      <!-- Text (if not an input) -->
      <slot v-else
            name="text"
            :model="model"
            :customClasses="customClasses">

        <span :title="model.title"
              class="tree-view-node-self-text"
              :class="customClasses.treeViewNodeSelfText">
          {{ model.label }}
        </span>
      </slot>

      <!-- Add Child button -->
      <button :id="addChildId"
              type="button"
              v-if="model.addChildCallback"
              class="tree-view-node-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfAddChild]"
              @click="$_treeViewNode_onAddChild">
        <i class="tree-view-node-self-add-child-icon"
            :class="customClasses.treeViewNodeSelfAddChildIcon"></i>
      </button>

      <!-- Delete button -->
      <button :id="deleteId"
              type="button"
              v-if="model.deletable"
              class="tree-view-node-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfDelete]"
              @click="$_treeViewNode_onDelete">
        <i class="tree-view-node-self-delete-icon"
            :class="customClasses.treeViewNodeSelfDeleteIcon"></i>
      </button>
    </div>

    <!-- Children -->
    <ul v-show="model.state.expanded"
        v-if="model.children.length > 0 && model.expandable"
        class="tree-view-node-children"
        :class="customClasses.treeViewNodeChildren">
      <TreeViewNode v-for="nodeModel in model.children"
                      :key="nodeModel.id"
                      :depth="depth + 1"
                      :model="nodeModel"
                      :model-defaults="modelDefaults"
                      :parent-id="model.id"
                      :tree-id="treeId"
                      :radio-group-values="radioGroupValues"
                      @treeViewNodeClick="(t, e)=>$emit('treeViewNodeClick', t, e)"
                      @treeViewNodeDblclick="(t, e)=>$emit('treeViewNodeDblclick', t, e)"
                      @treeViewNodeCheckboxChange="(t, e)=>$emit('treeViewNodeCheckboxChange', t, e)"
                      @treeViewNodeRadioChange="(t, e)=>$emit('treeViewNodeRadioChange', t, e)"
                      @treeViewNodeExpandedChange="(t, e)=>$emit('treeViewNodeExpandedChange', t, e)"
                      @treeViewNodeAdd="(t, p, e)=>$emit('treeViewNodeAdd', t, p, e)"
                      @treeViewNodeDelete="(t, e)=>$_treeViewNode_handleChildDeletion(t, e)">
        <template v-slot:checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
          <slot name="checkbox" :model="model" :customClasses="customClasses" :inputId="inputId" :checkboxChangeHandler="checkboxChangeHandler"></slot>
        </template>
        <template v-slot:radio="{ model, customClasses, inputId, inputModel, radioChangeHandler }">
          <slot name="radio" :model="model" :customClasses="customClasses" :inputId="inputId" :inputModel="inputModel" :radioChangeHandler="radioChangeHandler"></slot>
        </template>
        <template v-slot:text="{ model, customClasses }">
          <slot name="text" :model="model" :customClasses="customClasses"></slot>
        </template>
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
      modelDefaults: {
        type: Object,
        required: true
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
      addChildId() {
        return this.nodeId ? `${this.nodeId}-add-child` : null;
      },
      customClasses() {
        return (this.model.customizations || {}).classes || {};
      },
      deleteId() {
        return this.nodeId ? `${this.nodeId}-delete` : null;
      },
      expanderId() {
        return this.nodeId ? `${this.nodeId}-exp` : null;
      },
      nodeId() {
        return this.treeId ? `${this.treeId}-${this.model.id}` : null;
      },
      inputId() {
        return this.nodeId ? `${this.nodeId}-input` : null;
      }
    },
    methods: {
      /*
       * Normalizes the data model to the format consumable by TreeViewNode.
       */
      $_treeViewNode_normalizeNodeData() {

        if (Object.getOwnPropertyNames(this.modelDefaults).length > 0) {
          // Copy the defaults object.
          // Then, write the defaults into model, overriding them with anything model specifies.
          const defaultsCopy = Object.assign({}, this.modelDefaults);
          Object.assign(defaultsCopy, this.model);
          Object.assign(this.model, defaultsCopy);
        }

        // Set expected properties if not provided
        if (!Array.isArray(this.model.children)) {
          this.$set(this.model, 'children', []);
        }
        if (typeof this.model.expandable !== 'boolean') {
          this.$set(this.model, 'expandable', true);
        }
        if (typeof this.model.selectable !== 'boolean') {
          this.$set(this.model, 'selectable', false);
        }
        if (typeof this.model.deletable !== 'boolean') {
          this.$set(this.model, 'deletable', false);
        }

        if (typeof this.model.addChildCallback !== 'function') {
          this.$set(this.model, 'addChildCallback', null);
        }

        if (typeof this.model.title !== 'string' || this.model.title.trim().length === 0) {
          this.$set(this.model, 'title', null);
        }

        if (this.model.customizations == null || typeof this.model.customizations !== 'object') {
          this.$set(this.model, 'customizations', {});
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
        // Don't fire this if the target is an element which has its own events
        if (!event.target.matches("input, .tree-view-node-self-expander, .tree-view-node-self-action")) {
          this.$emit('treeViewNodeClick', this.model, event);
        }
      },
      $_treeViewNode_onDblclick(event) {
        // Don't fire this if the target is an element which has its own events
        if (!event.target.matches("input, .tree-view-node-self-expander, .tree-view-node-self-action")) {
          this.$emit('treeViewNodeDblclick', this.model, event);
        }
      },
      /*
       * Add a child node to the end of the child nodes list. The child node data is
       * supplied by an async callback which is the addChildCallback parameter of this node's model.
       */
      async $_treeViewNode_onAddChild(event) {
        if (this.model.addChildCallback) {
          var childModel = await this.model.addChildCallback(this.model);

          if (childModel) {
            this.model.children.push(childModel);
            this.$emit('treeViewNodeAdd', this.childModel, this.model, event);
          }
        }
      },
      $_treeViewNode_onDelete(event) {
        this.$emit('treeViewNodeDelete', this.model, event);
      },
      $_treeViewNode_handleChildDeletion(node, event) {
        // Remove the node from the array of children if this is an immediate child.
        // Note that only the node that was deleted fires these, not any subnode.
        let targetIndex = this.model.children.indexOf(node);
        if (targetIndex > -1) {
          this.model.children.splice(targetIndex, 1);
        }

        this.$emit('treeViewNodeDelete', node, event);
      }
    },
  };
</script>

<style lang="scss">
  $baseHeight: 1.2rem;
  $itemSpacing: 1.2rem;

  .tree-view {

    .tree-view-node {
      padding-left: 0;

      &:first-child {
        margin-top: 0;
      }

      .tree-view-node-self {
        display: flex;
        align-items: flex-start;
        line-height: $baseHeight;

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
        .tree-view-node-self-spacer,
        .tree-view-node-self-action {
          min-width: 1rem;
        }

        .tree-view-node-self-expander,
        .tree-view-node-self-spacer {
          margin: 0;
        }

        .tree-view-node-self-checkbox,
        .tree-view-node-self-radio {
          margin: 0 0 0 (-$itemSpacing);
        }

        .tree-view-node-self-text,
        .tree-view-node-self-label {
          margin-left: $itemSpacing;
        }

        .tree-view-node-self-action {
          padding: 0;
          background: none;
          border: none;
          height: $baseHeight;

          i.tree-view-node-self-add-child-icon {
            font-style: normal;

            &::before {
              content: '+';
            }
          }

          i.tree-view-node-self-delete-icon {
            font-style: normal;

            &::before {
              content: 'x';
            }
          }
        }
      }

      .tree-view-node-children {
        margin: 0 0 0 (1rem + $itemSpacing);
        padding: 0;
        list-style: none;
      }
    }
  }
</style>
