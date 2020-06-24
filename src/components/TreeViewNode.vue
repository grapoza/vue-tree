<template>
  <!--
      A Component meant to be used internally by the TreeView component. See README.md
      for a description of the expected data format.
  -->
  <li :id="nodeId"
      class="tree-view-node"
      :class="customClasses.treeViewNode"
      role="treeitem"
      :tabindex="ariaTabIndex"
      :aria-expanded="ariaExpanded"
      :aria-selected="ariaSelected"
      @keydown="$_treeViewNodeAria_onKeyDown">
    <div class="tree-view-node-self"
         :class="[customClasses.treeViewNodeSelf,
                  isEffectivelySelected ? 'tree-view-node-self-selected' : '',
                  isEffectivelySelected ? customClasses.treeViewNodeSelfSelected : '']"
         @click="$_treeViewNode_onClick"
         @dblclick="$_treeViewNode_onDblclick">

      <!-- Expander -->
      <button :id="expanderId"
              type="button"
              v-if="canExpand"
              aria-hidden="true"
              tabindex="-1"
              :title="model.treeNodeSpec.expanderTitle"
              class="tree-view-node-self-expander"
              :class="[customClasses.treeViewNodeSelfExpander,
                       model.treeNodeSpec.state.expanded ? 'tree-view-node-self-expanded' : '',
                       model.treeNodeSpec.state.expanded ? customClasses.treeViewNodeSelfExpanded : '']"
              @click="$_treeViewNode_onExpandedChange">
              <i class="tree-view-node-self-expanded-indicator"
                 :class="customClasses.treeViewNodeSelfExpandedIndicator"></i></button>
      <span v-else
            class="tree-view-node-self-spacer"
            :class="customClasses.treeViewNodeSelfSpacer"></span>

      <!-- Inputs and labels -->
      <!-- Checkbox -->
      <slot v-if="model.treeNodeSpec.input && model.treeNodeSpec.input.type === 'checkbox'"
            name="checkbox"
            :model="model"
            :customClasses="customClasses"
            :inputId="inputId"
            :checkboxChangeHandler="$_treeViewNode_onCheckboxChange">

        <label :for="inputId"
               :title="model.treeNodeSpec.title"
               class="tree-view-node-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 tabindex="-1"
                 class="tree-view-node-self-input tree-view-node-self-checkbox"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfCheckbox]"
                 type="checkbox"
                 :disabled="model.treeNodeSpec.state.input.disabled"
                 v-model="model.treeNodeSpec.state.input.value"
                 @change="$_treeViewNode_onCheckboxChange" />

          {{ model[labelPropName] }}
        </label>
      </slot>

      <!-- Radiobutton -->
      <slot v-else-if="model.treeNodeSpec.input && model.treeNodeSpec.input.type === 'radio'"
            name="radio"
            :model="model"
            :customClasses="customClasses"
            :inputId="inputId"
            :inputModel="radioGroupValues[model.treeNodeSpec.input.name]"
            :radioChangeHandler="$_treeViewNode_onRadioChange">

        <label :for="inputId"
               :title="model.treeNodeSpec.title"
               class="tree-view-node-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 tabindex="-1"
                 class="tree-view-node-self-input tree-view-node-self-radio"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfRadio]"
                 type="radio"
                 :name="model.treeNodeSpec.input.name"
                 :value="model.treeNodeSpec.input.value"
                 :disabled="model.treeNodeSpec.state.input.disabled"
                 v-model="radioGroupValues[model.treeNodeSpec.input.name]"
                 @change="$_treeViewNode_onRadioChange" />

          {{ model[labelPropName] }}
        </label>
      </slot>

      <!-- Text (if not an input) -->
      <slot v-else
            name="text"
            :model="model"
            :customClasses="customClasses">

        <span :title="model.treeNodeSpec.title"
              class="tree-view-node-self-text"
              :class="customClasses.treeViewNodeSelfText">
          {{ model[labelPropName] }}
        </span>
      </slot>

      <!-- Add Child button -->
      <button :id="addChildId"
              type="button"
              v-if="model.treeNodeSpec.addChildCallback"
              aria-hidden="true"
              tabindex="-1"
              :title="model.treeNodeSpec.addChildTitle"
              class="tree-view-node-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfAddChild]"
              @click="$_treeViewNode_onAddChild">
        <i class="tree-view-node-self-add-child-icon"
            :class="customClasses.treeViewNodeSelfAddChildIcon"></i>
      </button>

      <!-- Delete button -->
      <button :id="deleteId"
              type="button"
              v-if="model.treeNodeSpec.deletable"
              aria-hidden="true"
              tabindex="-1"
              :title="model.treeNodeSpec.deleteTitle"
              class="tree-view-node-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfDelete]"
              @click="$_treeViewNode_onDelete">
        <i class="tree-view-node-self-delete-icon"
            :class="customClasses.treeViewNodeSelfDeleteIcon"></i>
      </button>
    </div>

    <!-- Children and Loading Placholder -->
    <slot v-if="model.treeNodeSpec.state.expanded && canExpand && !areChildrenLoaded"
          name="loading"
          :model="model"
          :customClasses="customClasses">

      <span class="tree-view-node-loading"
            :class="customClasses.treeViewNodeLoading">
        ...
      </span>
    </slot>
    <ul v-show="model.treeNodeSpec.state.expanded"
        v-if="canExpand && areChildrenLoaded"
        class="tree-view-node-children"
        :class="customClasses.treeViewNodeChildren"
        role="group"
        :aria-hidden="(!model.treeNodeSpec.state.expanded).toString()">
      <TreeViewNode v-for="nodeModel in model[childrenPropName]"
                    :key="nodeModel[nodeModel.treeNodeSpec && nodeModel.treeNodeSpec.idProperty ? nodeModel.treeNodeSpec.idProperty : 'id']"
                    :depth="depth + 1"
                    :initial-model="nodeModel"
                    :model-defaults="modelDefaults"
                    :parent-id="model[idPropName]"
                    :selection-mode="selectionMode"
                    :tree-id="treeId"
                    :initial-radio-group-values="radioGroupValues"
                    :aria-key-map="ariaKeyMap"
                    :is-mounted="isMounted"
                    @treeViewNodeClick="(t, e)=>$emit('treeViewNodeClick', t, e)"
                    @treeViewNodeDblclick="(t, e)=>$emit('treeViewNodeDblclick', t, e)"
                    @treeViewNodeCheckboxChange="(t, e)=>$emit('treeViewNodeCheckboxChange', t, e)"
                    @treeViewNodeRadioChange="(t, e)=>$emit('treeViewNodeRadioChange', t, e)"
                    @treeViewNodeExpandedChange="(t, e)=>$emit('treeViewNodeExpandedChange', t, e)"
                    @treeViewNodeChildrenLoaded="(t, e)=>$emit('treeViewNodeChildrenLoaded', t, e)"
                    @treeViewNodeSelectedChange="(t, e)=>$emit('treeViewNodeSelectedChange', t, e)"
                    @treeViewNodeAdd="(t, p, e)=>$emit('treeViewNodeAdd', t, p, e)"
                    @treeViewNodeDelete="(t, e)=>$_treeViewNode_handleChildDeletion(t, e)"
                    @treeViewNodeAriaFocusable="(t)=>$emit('treeViewNodeAriaFocusable', t)"
                    @treeViewNodeAriaRequestParentFocus="$_treeViewNodeAria_focus()"
                    @treeViewNodeAriaRequestFirstFocus="()=>$emit('treeViewNodeAriaRequestFirstFocus')"
                    @treeViewNodeAriaRequestLastFocus="()=>$emit('treeViewNodeAriaRequestLastFocus')"
                    @treeViewNodeAriaRequestPreviousFocus="$_treeViewNodeAria_handlePreviousFocus"
                    @treeViewNodeAriaRequestNextFocus="$_treeViewNodeAria_handleNextFocus">
        <template #checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
          <slot name="checkbox" :model="model" :customClasses="customClasses" :inputId="inputId" :checkboxChangeHandler="checkboxChangeHandler"></slot>
        </template>
        <template #radio="{ model, customClasses, inputId, inputModel, radioChangeHandler }">
          <slot name="radio" :model="model" :customClasses="customClasses" :inputId="inputId" :inputModel="inputModel" :radioChangeHandler="radioChangeHandler"></slot>
        </template>
        <template #text="{ model, customClasses }">
          <slot name="text" :model="model" :customClasses="customClasses"></slot>
        </template>
        <template #loading="{ model, customClasses }">
          <slot name="loading" :model="model" :customClasses="customClasses"></slot>
        </template>
      </TreeViewNode>
    </ul>
  </li>
</template>

<script>
  import TreeViewNodeAria from '../mixins/TreeViewNodeAria';
  import SelectionMode from '../enums/selectionMode';

  export default {
    name: 'TreeViewNode',
    mixins: [
      TreeViewNodeAria
    ],
    props: {
      depth: {
        type: Number,
        required: true
      },
      initialModel: {
        type: Object,
        required: true
      },
      isMounted: {
        type: Boolean,
        required: true
      },
      modelDefaults: {
        type: Object,
        required: true
      },
      initialRadioGroupValues: {
        type: Object,
        required: true
      },
      selectionMode: {
        type: String,
        required: false,
        default: SelectionMode.None,
        validator: function (value) {
          return Object.values(SelectionMode).includes(value);
        }
      },
      treeId: {
        type: String,
        required: false,
        default: null
      }
    },
    data() {
      return {
        elementsThatIgnoreClicks: 'input, .tree-view-node-self-expander, .tree-view-node-self-expander *, .tree-view-node-self-action, .tree-view-node-self-action *',
        model: this.initialModel,
        radioGroupValues: this.initialRadioGroupValues
      }
    },
    computed: {
      addChildId() {
        return this.nodeId ? `${this.nodeId}-add-child` : null;
      },
      ariaExpanded() {
        return this.canExpand ? this.model.treeNodeSpec.state.expanded.toString() : false;
      },
      ariaSelected() {
        // If selection isn't allowed, don't add an aria-selected attribute.
        // If the tree contains nodes that are not selectable, those nodes do not have the aria-selected state.
        if (this.selectionMode === SelectionMode.None || !this.model.treeNodeSpec.selectable) {
          return false;
        }

        // https://www.w3.org/TR/wai-aria-practices-1.1/#tree_roles_states_props
        // If the tree does not support multiple selection, aria-selected is set to true
        // for the selected node and it is not present on any other node in the tree.
        if (this.selectionMode !== SelectionMode.Multiple) {
          return this.model.treeNodeSpec.state.selected ? 'true' : false;
        }

        // If the tree supports multiple selection:
        //   All selected nodes have aria-selected set to true.
        //   All nodes that are selectable but not selected have aria-selected set to false.
        return this.model.treeNodeSpec.state.selected.toString();
      },
      canExpand() {
        // A node can be expanded if it is expandable and either has children or has not
        // yet had the asynchronous loader for children called.
        return (this.model[this.childrenPropName].length > 0 || !this.areChildrenLoaded) && this.model.treeNodeSpec.expandable;
      },
      areChildrenLoaded() {
        const tns = this.model.treeNodeSpec;
        return typeof tns.loadChildrenAsync !== 'function' || tns.state.areChildrenLoaded;
      },
      childrenPropName() {
        return this.model.treeNodeSpec.childrenProperty || 'children';
      },
      customClasses() {
        return (this.model.treeNodeSpec.customizations || {}).classes || {};
      },
      deleteId() {
        return this.nodeId ? `${this.nodeId}-delete` : null;
      },
      expanderId() {
        return this.nodeId ? `${this.nodeId}-exp` : null;
      },
      idPropName() {
        return this.model.treeNodeSpec.idProperty || 'id';
      },
      inputId() {
        return this.nodeId ? `${this.nodeId}-input` : null;
      },
      isEffectivelySelected() {
        return this.selectionMode !== SelectionMode.None && this.model.treeNodeSpec.selectable && this.model.treeNodeSpec.state.selected;
      },
      labelPropName() {
        return this.model.treeNodeSpec.labelProperty || 'label';
      },
      nodeId() {
        return this.treeId ? `${this.treeId}-${this.model[this.idPropName]}` : null;
      }
    },
    created() {
      this.$_treeViewNode_normalizeNodeData();

      // id and label are required; notify the user. Validation is done here instead
      // of at the prop level due to dependency on multiple props at once and defaulting
      // that takes place in the normalization process
      if (!this.model[this.idPropName] || (typeof this.model[this.idPropName] !== 'number' && typeof this.model[this.idPropName] !== 'string')) {
        console.error(`initialModel id is required and must be a number or string. Expected prop ${this.idPropName} to exist on the model.`);
      }
      if(!this.model[this.labelPropName] || typeof this.model[this.labelPropName] !== 'string') {
        console.error(`initialModel label is required and must be a string. Expected prop ${this.labelPropName} to exist on the model.`);
      }
    },
    watch: {
      'model.treeNodeSpec.state.selected': function(newValue) {
          this.$emit('treeViewNodeSelectedChange', this.model);
      }
    },
    methods: {
      /*
       * Normalizes the data model to the format consumable by TreeViewNode.
       */
      $_treeViewNode_normalizeNodeData() {
        // The target model must have a treeNodeSpec property to assign defaults into
        if (!this.$_treeViewNode_isProbablyObject(this.model.treeNodeSpec)) {
          this.$set(this.model, 'treeNodeSpec', {});
        }

        this.$_treeViewNode_assignDefaultProps(this.modelDefaults, this.model.treeNodeSpec);

        // Set expected properties if not provided
        if (typeof this.model.treeNodeSpec.childrenProperty !== 'string') {
          this.$set(this.model.treeNodeSpec, 'childrenProperty', 'children');
        }
        if (typeof this.model.treeNodeSpec.idProperty !== 'string') {
          this.$set(this.model.treeNodeSpec, 'idProperty', 'id');
        }
        if (typeof this.model.treeNodeSpec.labelProperty !== 'string') {
          this.$set(this.model.treeNodeSpec, 'labelProperty', 'label');
        }

        if (!Array.isArray(this.model[this.childrenPropName])) {
          this.$set(this.model, this.childrenPropName, []);
        }
        if (typeof this.model.treeNodeSpec.expandable !== 'boolean') {
          this.$set(this.model.treeNodeSpec, 'expandable', true);
        }
        if (typeof this.model.treeNodeSpec.selectable !== 'boolean') {
          this.$set(this.model.treeNodeSpec, 'selectable', false);
        }
        if (typeof this.model.treeNodeSpec.deletable !== 'boolean') {
          this.$set(this.model.treeNodeSpec, 'deletable', false);
        }

        if (typeof this.model.treeNodeSpec.addChildCallback !== 'function') {
          this.$set(this.model.treeNodeSpec, 'addChildCallback', null);
        }

        if (typeof this.model.treeNodeSpec.title !== 'string' || this.model.treeNodeSpec.title.trim().length === 0) {
          this.$set(this.model.treeNodeSpec, 'title', null);
        }
        if (typeof this.model.treeNodeSpec.expanderTitle !== 'string' || this.model.treeNodeSpec.expanderTitle.trim().length === 0) {
          this.$set(this.model.treeNodeSpec, 'expanderTitle', null);
        }
        if (typeof this.model.treeNodeSpec.addChildTitle !== 'string' || this.model.treeNodeSpec.addChildTitle.trim().length === 0) {
          this.$set(this.model.treeNodeSpec, 'addChildTitle', null);
        }
        if (typeof this.model.treeNodeSpec.deleteTitle !== 'string' || this.model.treeNodeSpec.deleteTitle.trim().length === 0) {
          this.$set(this.model.treeNodeSpec, 'deleteTitle', null);
        }

        if (this.model.treeNodeSpec.customizations == null || typeof this.model.treeNodeSpec.customizations !== 'object') {
          this.$set(this.model.treeNodeSpec, 'customizations', {});
        }

        if(typeof this.model.treeNodeSpec.loadChildrenAsync !== 'function') {
          this.$set(this.model.treeNodeSpec, 'loadChildrenAsync', null);
        }

        this.$_treeViewNode_normalizeNodeInputData();
        this.$_treeViewNode_normalizeNodeStateData();
      },
      /**
       * Normalizes the data model's data related to input element generation.
       */
      $_treeViewNode_normalizeNodeInputData() {

        let input = this.model.treeNodeSpec.input;

        // For nodes that are inputs, they must specify at least a type.
        // Only a subset of types are accepted.
        if (input === null || typeof input !== 'object' || !['checkbox', 'radio'].includes(input.type)) {
          this.$set(this.model.treeNodeSpec, 'input', null);
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
              this.$set(input, 'value', this.model[this.labelPropName].replace(/[\s&<>"'\/]/g, ''));
            }
            if (!this.radioGroupValues.hasOwnProperty(input.name)) {
              this.$set(this.radioGroupValues, input.name, '');
            }

            if (input.isInitialRadioGroupValue === true) {
              this.$set(this.radioGroupValues, input.name, input.value);
            }
          }
        }
      },
      /**
       * Normalizes the data model's data related to the node's state.
       */
      $_treeViewNode_normalizeNodeStateData() {
        if (this.model.treeNodeSpec.state === null || typeof this.model.treeNodeSpec.state !== 'object') {
          this.$set(this.model.treeNodeSpec, 'state', {});
        }

        let state = this.model.treeNodeSpec.state;

        // areChildrenLoaded and areChildrenLoading are internal state used with asynchronous child
        // node loading. Any node with asynchronously loaded children starts as not expanded.
        this.$set(state, 'areChildrenLoaded', typeof this.model.treeNodeSpec.loadChildrenAsync !== 'function');
        this.$set(state, 'areChildrenLoading', false);

        if (typeof state.expanded !== 'boolean' || !state.areChildrenLoaded) {
          this.$set(state, 'expanded', false);
        }
        if (typeof state.selected !== 'boolean') {
          this.$set(state, 'selected', false);
        }

        if (this.model.treeNodeSpec.input) {
          if (state.input === null || typeof state.input !== 'object') {
            this.$set(state, 'input', {});
          }

          if (state.input.disabled === null || typeof state.input.disabled !== 'boolean') {
            this.$set(state.input, 'disabled', false);
          }

          if (this.model.treeNodeSpec.input.type === 'checkbox') {

            if (typeof state.input.value !== 'boolean') {
              this.$set(state.input, 'value', false);
            }
          }
        }
      },
      $_treeViewNode_assignDefaultProps(source, target) {

        // Make sure the defaults is an object
        if (this.$_treeViewNode_isProbablyObject(source)) {

          // Use a copy of the source, since the props can be fubar'd by the assigns
          const sourceCopy = JSON.parse(JSON.stringify(source));

          // Assign existing values into the source
          Object.assign(sourceCopy, target);

          for (const propName of Object.keys(source)) {
            // Functions are lost on the JSON copy, so snag the original.
            const propValue = typeof source[propName] === 'function' ? source[propName] : sourceCopy[propName];

            if (this.$_treeViewNode_isProbablyObject(propValue)) {
              // Find object properties to deep assign them
              this.$set(target, propName, target[propName] || {});
              this.$_treeViewNode_assignDefaultProps(propValue, target[propName]);
            }
            else if (typeof propValue === 'function' && !target[propName]) {
              // Find function properties and assign if missing in target.
              target[propName] = propValue;
            }
            else {
              // Otherwise, copy from the source to the target.
              this.$set(target, propName, propValue);
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
      async $_treeViewNode_onExpandedChange(event) {
        let spec = this.model.treeNodeSpec;

        // First expand the node (to show either children or a "loading" indicator)
        spec.state.expanded = !spec.state.expanded;
        this.$emit('treeViewNodeExpandedChange', this.model, event);

        // If children need to be loaded asynchronously, load them.
        if (spec.state.expanded && !spec.state.areChildrenLoaded && !spec.state.areChildrenLoading) {

          spec.state.areChildrenLoading = true;
          var childrenResult = await spec.loadChildrenAsync(this.model);

          if (childrenResult) {
            spec.state.areChildrenLoaded = true;
            this.model[this.childrenPropName].splice(0, this.model[this.childrenPropName].length, ...childrenResult);
            this.$emit('treeViewNodeChildrenLoaded', this.model, event);
          }

          spec.state.areChildrenLoading = false;
        }
      },
      $_treeViewNode_toggleSelected(event) {
        // Note that selection change is already handled by the "model.treeNodeSpec.focusable" watcher
        // method in TreeViewNodeAria if selectionMode is SelectionFollowsFocus.
        if (this.model.treeNodeSpec.selectable && [SelectionMode.Single, SelectionMode.Multiple].includes(this.selectionMode)) {
          this.model.treeNodeSpec.state.selected = !this.model.treeNodeSpec.state.selected;
        }
      },
      $_treeViewNode_onClick(event) {
        // Don't fire this if the target is an element which has its own events
        if (!this.$_treeViewNode_matches(event.target, this.elementsThatIgnoreClicks)) {
          this.$emit('treeViewNodeClick', this.model, event);
          this.$_treeViewNode_toggleSelected(event);
        }

        this.$_treeViewNodeAria_onClick();
      },
      $_treeViewNode_onDblclick(event) {
        // Don't fire this if the target is an element which has its own events
        if (!this.$_treeViewNode_matches(event.target, this.elementsThatIgnoreClicks)) {
          this.$emit('treeViewNodeDblclick', this.model, event);
        }
      },
      /*
       * Add a child node to the end of the child nodes list. The child node data is
       * supplied by an async callback which is the addChildCallback parameter of this node's model.
       */
      async $_treeViewNode_onAddChild(event) {
        if (this.model.treeNodeSpec.addChildCallback) {
          var childModel = await this.model.treeNodeSpec.addChildCallback(this.model);

          if (childModel) {
            this.model[this.childrenPropName].push(childModel);
            this.$emit('treeViewNodeAdd', this.childModel, this.model, event);
          }
        }
      },
      $_treeViewNode_onDelete(event) {
        if (this.model.treeNodeSpec.deletable) {
          this.$emit('treeViewNodeDelete', this.model, event);
        }
      },
      $_treeViewNode_handleChildDeletion(node, event) {
        // Remove the node from the array of children if this is an immediate child.
        // Note that only the node that was deleted fires these, not any subnode.
        let targetIndex = this.model[this.childrenPropName].indexOf(node);
        if (targetIndex > -1) {
          this.$_treeViewNodeAria_handleChildDeletion(node);
          this.model[this.childrenPropName].splice(targetIndex, 1);
        }

        this.$emit('treeViewNodeDelete', node, event);
      },
      $_treeViewNode_matches(target, selector) {
        if (Element.prototype.matches) {
          return target.matches(selector);
        }
        else if (Element.prototype.msMatchesSelector) {
          return target.msMatchesSelector(selector);
        }
        else if (Element.prototype.webkitMatchesSelector) {
          return target.webkitMatchesSelector(selector);
        }

        return false;
      },
      $_treeViewNode_isProbablyObject(obj) {
        return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
      }
    },
  };

</script>

<style lang="scss">
  $baseHeight: 1.2rem;
  $itemSpacing: 1.2rem;

  // Everything's in a .tree-view (embedded SCSS is the 'default-tree-view-skin' skin)
  .tree-view.default-tree-view-skin {

    // The node, including its content and children list
    .tree-view-node {
      padding-left: 0;

      &:first-child {
        margin-top: 0;
      }

      // ARIA styles
      &[role="treeitem"]:focus {
        outline: 0;

        >.tree-view-node-self {
          outline: black dotted 1px;
        }
      }
    }

    // The node's content, excluding the list of child nodes
    .tree-view-node-self {
      display: flex;
      align-items: flex-start;
      line-height: $baseHeight;
    }

    // The expander button and indicator content
    .tree-view-node-self-expander {
      padding: 0;
      background: none;
      border: none;
      height: $baseHeight;

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

    // The styling for when the node is selected
    .tree-view-node-self-selected {
      background-color: #f0f0f8;
    }

    // Spacing
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

    // Action buttons section
    .tree-view-node-self-action {
      padding: 0;
      background: none;
      border: none;
      height: $baseHeight;
    }

    // Action buttons (add, delete, etc)
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

    // Loading slot content
    .tree-view-node-loading {
      margin: 0 0 0 (1rem + $itemSpacing);
    }

    // The node's child list
    .tree-view-node-children {
      margin: 0 0 0 (1rem + $itemSpacing);
      padding: 0;
      list-style: none;
    }
  }
</style>
