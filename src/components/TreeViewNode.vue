<template>
  <!--
      A Component meant to be used internally by the TreeView component. See the documentation
      for a description of the expected data format.
  -->
  <li :id="nodeId"
      class="grtvn"
      :class="[customClasses.treeViewNode,
               tns._.dragging ? 'grtvn-dragging' : '']"
      role="treeitem"
      :tabindex="ariaTabIndex"
      :aria-expanded="ariaExpanded"
      :aria-selected="ariaSelected"
      @keydown="$_grtvnAria_onKeyDown">

    <div class="grtvn-self"
         :class="[customClasses.treeViewNodeSelf,
                  isEffectivelySelected ? 'grtvn-self-selected' : '',
                  isEffectivelySelected ? customClasses.treeViewNodeSelfSelected : '',
                  tns._.isDropTarget ? 'grtvn-self-drop-target': '',
                  tns._.isChildDropTarget ? 'grtvn-self-child-drop-target': '']"
         :draggable="tns.draggable"
         :dragging="tns._.dragging"
         @click="$_grtvn_onClick"
         @dblclick="$_grtvn_onDblclick"
         @dragend="$_grtvnDnd_onDragend"
         @dragenter="$_grtvnDnd_onDragenter"
         @dragleave="$_grtvnDnd_onDragleave"
         @dragover="$_grtvnDnd_onDragover"
         @dragstart="$_grtvnDnd_onDragstart"
         @drop="$_grtvnDnd_onDrop">

      <!-- Top Drop Target -->
      <div class="grtvn-self-sibling-drop-target grtvn-self-prev-target"
           :class="[tns._.isPrevDropTarget ? 'grtvn-self-sibling-drop-target-hover': '']"></div>

      <!-- Expander -->
      <button :id="expanderId"
              type="button"
              v-if="canExpand"
              aria-hidden="true"
              tabindex="-1"
              :title="tns.expanderTitle"
              class="grtvn-self-expander"
              :class="[customClasses.treeViewNodeSelfExpander,
                       tns.state.expanded ? 'grtvn-self-expanded' : '',
                       tns.state.expanded ? customClasses.treeViewNodeSelfExpanded : '']"
              @click="$_grtvn_onExpandedChange">
              <i class="grtvn-self-expanded-indicator"
                 :class="customClasses.treeViewNodeSelfExpandedIndicator"></i></button>
      <span v-else
            class="grtvn-self-spacer"
            :class="customClasses.treeViewNodeSelfSpacer"></span>

      <!-- Inputs and labels -->
      <!-- Checkbox -->
      <slot v-if="tns.input && tns.input.type === 'checkbox'"
            name="checkbox"
            :model="model"
            :customClasses="customClasses"
            :inputId="inputId"
            :checkboxChangeHandler="$_grtvn_onCheckboxChange">

        <label :for="inputId"
               :title="tns.title"
               class="grtvn-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 tabindex="-1"
                 class="grtvn-self-input grtvn-self-checkbox"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfCheckbox]"
                 type="checkbox"
                 :disabled="tns.state.input.disabled"
                 v-model="tns.state.input.value"
                 @change="$_grtvn_onCheckboxChange" />

          {{ label }}
        </label>
      </slot>

      <!-- Radiobutton -->
      <slot v-else-if="tns.input && tns.input.type === 'radio'"
            name="radio"
            :model="model"
            :customClasses="customClasses"
            :inputId="inputId"
            :inputModel="radioGroupValues[tns.input.name]"
            :radioChangeHandler="$_grtvn_onRadioChange">

        <label :for="inputId"
               :title="tns.title"
               class="grtvn-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 tabindex="-1"
                 class="grtvn-self-input grtvn-self-radio"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfRadio]"
                 type="radio"
                 :name="tns.input.name"
                 :value="tns.input.value"
                 :disabled="tns.state.input.disabled"
                 v-model="radioGroupValues[tns.input.name]"
                 @change="$_grtvn_onRadioChange" />

          {{ label }}
        </label>
      </slot>

      <!-- Text (if not an input) -->
      <slot v-else
            name="text"
            :model="model"
            :customClasses="customClasses">

        <span :title="tns.title"
              class="grtvn-self-text"
              :class="customClasses.treeViewNodeSelfText">
          {{ label }}
        </span>
      </slot>

      <!-- Add Child button -->
      <button :id="addChildId"
              type="button"
              v-if="tns.addChildCallback"
              aria-hidden="true"
              tabindex="-1"
              :title="tns.addChildTitle"
              class="grtvn-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfAddChild]"
              @click="$_grtvn_onAddChild">
        <i class="grtvn-self-add-child-icon"
            :class="customClasses.treeViewNodeSelfAddChildIcon"></i>
      </button>

      <!-- Delete button -->
      <button :id="deleteId"
              type="button"
              v-if="tns.deletable"
              aria-hidden="true"
              tabindex="-1"
              :title="tns.deleteTitle"
              class="grtvn-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfDelete]"
              @click="$_grtvn_onDelete">
        <i class="grtvn-self-delete-icon"
            :class="customClasses.treeViewNodeSelfDeleteIcon"></i>
      </button>

      <!-- Bottom Drop Target -->
      <div class="grtvn-self-sibling-drop-target grtvn-self-next-target"
           :class="[tns._.isNextDropTarget ? 'grtvn-self-sibling-drop-target-hover': '']"></div>
    </div>

    <!-- Children and Loading Placholder -->
    <div class="grtvn-children-wrapper"
            :class="customClasses.treeViewNodeChildrenWrapper">
      <slot v-if="tns.state.expanded && !areChildrenLoaded"
            name="loading"
            :model="model"
            :customClasses="customClasses">

        <span class="grtvn-loading"
              :class="customClasses.treeViewNodeLoading">
          ...
        </span>
      </slot>
      <ul v-show="tns.state.expanded"
          v-if="this.hasChildren"
          class="grtvn-children"
          :class="customClasses.treeViewNodeChildren"
          role="group"
          :aria-hidden="(!tns.state.expanded).toString()">
        <TreeViewNode v-for="nodeModel in children"
                      :key="nodeModel[tns && tns.idProperty ? tns.idProperty : 'id']"
                      :depth="depth + 1"
                      :initial-model="nodeModel"
                      :model-defaults="modelDefaults"
                      :parent-id="id"
                      :selection-mode="selectionMode"
                      :tree-id="treeId"
                      :initial-radio-group-values="radioGroupValues"
                      :aria-key-map="ariaKeyMap"
                      :is-mounted="isMounted"
                      @treeViewNodeClick="(t, e)=>$emit(TvEvent.Click, t, e)"
                      @treeViewNodeDblclick="(t, e)=>$emit(TvEvent.DoubleClick, t, e)"
                      @treeViewNodeCheckboxChange="(t, e)=>$emit(TvEvent.CheckboxChange, t, e)"
                      @treeViewNodeRadioChange="(t, e)=>$emit(TvEvent.RadioChange, t, e)"
                      @treeViewNodeExpandedChange="(t, e)=>$emit(TvEvent.ExpandedChange, t, e)"
                      @treeViewNodeChildrenLoad="(t, e)=>$emit(TvEvent.ChildrenLoad, t, e)"
                      @treeViewNodeSelectedChange="(t, e)=>$emit(TvEvent.SelectedChange, t, e)"
                      @treeViewNodeAdd="(t, p, e)=>$emit(TvEvent.Add, t, p, e)"
                      @treeViewNodeDelete="$_grtvn_handleChildDeletion"
                      @treeViewNodeAriaFocusableChange="(t)=>$emit(TvEvent.FocusableChange, t)"
                      @treeViewNodeAriaRequestParentFocus="$_grtvnAria_focus"
                      @treeViewNodeAriaRequestFirstFocus="()=>$emit(TvEvent.RequestFirstFocus)"
                      @treeViewNodeAriaRequestLastFocus="()=>$emit(TvEvent.RequestLastFocus)"
                      @treeViewNodeAriaRequestPreviousFocus="$_grtvnAria_handlePreviousFocus"
                      @treeViewNodeAriaRequestNextFocus="$_grtvnAria_handleNextFocus"
                      @treeViewNodeDragMove="$_grtvnDnd_dragMoveChild"
                      @treeViewNodeDrop="$_grtvnDnd_drop">
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
    </div>
  </li>
</template>

<script>
  import TreeViewNodeAria from '../mixins/TreeViewNodeAria';
  import TreeViewNodeDragAndDrop from '../mixins/TreeViewNodeDragAndDrop';
  import SelectionMode from '../enums/selectionMode';
  import InputType from '../enums/inputType';
  import TvEvent from '../enums/event';
  import ChildrenLoadPrecedence from '../enums/childrenLoadPrecedence.js';
  import { isProbablyObject } from '../objectMethods';

  export default {
    name: 'TreeViewNode',
    mixins: [
      TreeViewNodeAria,
      TreeViewNodeDragAndDrop
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
        required: true
      }
    },
    data() {
      return {
        elementsThatIgnoreClicks: 'input, .grtvn-self-expander, .grtvn-self-expander *, .grtvn-self-action, .grtvn-self-action *',
        model: this.initialModel,
        radioGroupValues: this.initialRadioGroupValues
      }
    },
    computed: {
      addChildId() {
        return `${this.nodeId}-add-child`;
      },
      areChildrenLoaded() {
        const tns = this.tns;
        return typeof tns.loadChildrenAsync !== 'function' || tns._.state.areChildrenLoaded;
      },
      ariaExpanded() {
        return this.canExpand ? this.tns.state.expanded.toString() : false;
      },
      ariaSelected() {
        // If selection isn't allowed, don't add an aria-selected attribute.
        // If the tree contains nodes that are not selectable, those nodes do not have the aria-selected state.
        if (this.selectionMode === SelectionMode.None || !this.tns.selectable) {
          return false;
        }

        // https://www.w3.org/TR/wai-aria-practices-1.1/#tree_roles_states_props
        // If the tree does not support multiple selection, aria-selected is set to true
        // for the selected node and it is not present on any other node in the tree.
        if (this.selectionMode !== SelectionMode.Multiple) {
          return this.tns.state.selected ? 'true' : false;
        }

        // If the tree supports multiple selection:
        //   All selected nodes have aria-selected set to true.
        //   All nodes that are selectable but not selected have aria-selected set to false.
        return this.tns.state.selected.toString();
      },
      canExpand() {
        // A node can be expanded if it is expandable and either has children or has not
        // yet had the asynchronous loader for children called.
        return this.mayHaveChildren && this.tns.expandable;
      },
      children() {
        return this.model[this.childrenPropName];
      },
      childrenPropName() {
        return this.tns.childrenProperty || 'children';
      },
      customClasses() {
        return (this.tns.customizations || {}).classes || {};
      },
      deleteId() {
        return `${this.nodeId}-delete`;
      },
      expanderId() {
        return `${this.nodeId}-exp`;
      },
      hasChildren() {
        return this.children && this.children.length > 0;
      },
      id() {
        return this.model[this.idPropName];
      },
      idPropName() {
        return this.tns.idProperty || 'id';
      },
      inputId() {
        return `${this.nodeId}-input`;
      },
      isEffectivelySelected() {
        return this.selectionMode !== SelectionMode.None && this.tns.selectable && this.tns.state.selected;
      },
      label() {
        return this.model[this.labelPropName];
      },
      labelPropName() {
        return this.tns.labelProperty || 'label';
      },
      mayHaveChildren() {
        return this.hasChildren || !this.areChildrenLoaded;
      },
      nodeId() {
        return `${this.treeId}-${this.id}`;
      },
      tns() {
        return this.model.treeNodeSpec;
      },
      TvEvent() {
        return TvEvent;
      }
    },
    created() {
      this.$_grtvn_normalizeNodeData();

      // id and label are required; notify the user. Validation is done here instead
      // of at the prop level due to dependency on multiple props at once and defaulting
      // that takes place in the normalization process
      if (!this.id || (typeof this.id !== 'number' && typeof this.id !== 'string')) {
        console.error(`initialModel id is required and must be a number or string. Expected prop ${this.idPropName} to exist on the model.`);
      }
      if(!this.label || typeof this.label !== 'string') {
        console.error(`initialModel label is required and must be a string. Expected prop ${this.labelPropName} to exist on the model.`);
      }
    },
    watch: {
      'model.treeNodeSpec.state.selected': function(newValue) {
          this.$emit(TvEvent.SelectedChange, this.model);
      }
    },
    methods: {
      /*
       * Normalizes the data model to the format consumable by TreeViewNode.
       */
      $_grtvn_normalizeNodeData() {
        // The target model must have a treeNodeSpec property to assign defaults into; if missing,
        // it will be normalized into existence in $_grtvnAria_normalizeNodeData().
        this.$_grtvn_assignDefaultProps(this.modelDefaults, this.tns);

        // Internal members
        if (this.tns._ === null || typeof this.tns._ !== 'object') {
          this.$set(this.tns, '_', {});
        }
        this.$set(this.tns._, 'dragging', false);

        // Set expected properties if not provided
        if (typeof this.tns.childrenProperty !== 'string') {
          this.$set(this.tns, 'childrenProperty', 'children');
        }
        if (typeof this.tns.idProperty !== 'string') {
          this.$set(this.tns, 'idProperty', 'id');
        }
        if (typeof this.tns.labelProperty !== 'string') {
          this.$set(this.tns, 'labelProperty', 'label');
        }

        if(typeof this.tns.childrenLoadPrecedence !== 'string'
          || !Object.values(ChildrenLoadPrecedence).includes(this.tns.childrenLoadPrecedence)) {
          this.$set(this.tns, 'childrenLoadPrecedence', ChildrenLoadPrecedence.AsyncBeforeStatic);
        }

        if (!Array.isArray(this.children)) {
          this.tns._.initializedWithoutChildren = true;
          this.$set(this.model, this.childrenPropName, []);
        }
        if (typeof this.tns.expandable !== 'boolean') {
          this.$set(this.tns, 'expandable', true);
        }
        if (typeof this.tns.selectable !== 'boolean') {
          this.$set(this.tns, 'selectable', false);
        }
        if (typeof this.tns.deletable !== 'boolean') {
          this.$set(this.tns, 'deletable', false);
        }
        if (typeof this.tns.draggable !== 'boolean') {
          this.$set(this.tns, 'draggable', false);
        }
        if (typeof this.tns.allowDrop !== 'boolean') {
          this.$set(this.tns, 'allowDrop', false);
        }

        if (typeof this.tns.addChildCallback !== 'function') {
          this.$set(this.tns, 'addChildCallback', null);
        }

        if (typeof this.tns.title !== 'string' || this.tns.title.trim().length === 0) {
          this.$set(this.tns, 'title', null);
        }
        if (typeof this.tns.expanderTitle !== 'string' || this.tns.expanderTitle.trim().length === 0) {
          this.$set(this.tns, 'expanderTitle', null);
        }
        if (typeof this.tns.addChildTitle !== 'string' || this.tns.addChildTitle.trim().length === 0) {
          this.$set(this.tns, 'addChildTitle', null);
        }
        if (typeof this.tns.deleteTitle !== 'string' || this.tns.deleteTitle.trim().length === 0) {
          this.$set(this.tns, 'deleteTitle', null);
        }

        if (this.tns.customizations == null || typeof this.tns.customizations !== 'object') {
          this.$set(this.tns, 'customizations', {});
        }

        if(typeof this.tns.loadChildrenAsync !== 'function') {
          this.$set(this.tns, 'loadChildrenAsync', null);
        }

        this.$_grtvn_normalizeNodeInputData();
        this.$_grtvn_normalizeNodeStateData();
      },
      /**
       * Normalizes the data model's data related to input element generation.
       */
      $_grtvn_normalizeNodeInputData() {

        let input = this.tns.input;

        // For nodes that are inputs, they must specify at least a type.
        // Only a subset of types are accepted.
        if (input === null || typeof input !== 'object' || !Object.values(InputType).includes(input.type)) {
          this.$set(this.tns, 'input', null);
        }
        else {
          if (typeof input.name !== 'string' || input.name.trim().length === 0) {
            this.$set(input, 'name', null);
          }

          if (input.type === InputType.RadioButton) {
            if (typeof input.name !== 'string' || input.name.trim().length === 0) {
              this.$set(input, 'name', 'unspecifiedRadioName');
            }
            if (typeof input.value !== 'string' || input.value.trim().length === 0) {
              this.$set(input, 'value', this.label.replace(/[\s&<>"'\/]/g, ''));
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
      $_grtvn_normalizeNodeStateData() {
        if (this.tns.state === null || typeof this.tns.state !== 'object') {
          this.$set(this.tns, 'state', {});
        }
        if (this.tns._.state === null || typeof this.tns._.state !== 'object') {
          this.$set(this.tns._, 'state', {});
        }

        let state = this.tns.state;
        let privateState = this.tns._.state;

        // areChildrenLoaded and areChildrenLoading are internal state used with asynchronous child
        // node loading. Any node with asynchronously loaded children starts as not expanded
        // unless the childrenLoadPrecedence is StaticOverAsync and children exist. To facilitate
        // determining if the children are not yet loaded or a properly loaded empty list, use private
        // state set during base node initialization.
        let childrenLoaded = true;
        if (typeof this.tns.loadChildrenAsync === 'function') {
          if (this.tns.childrenLoadPrecedence === ChildrenLoadPrecedence.AsyncBeforeStatic || this.tns._.initializedWithoutChildren) {
            childrenLoaded = false;
          }
        }

        this.$set(privateState, 'areChildrenLoaded', childrenLoaded);
        this.$set(privateState, 'areChildrenLoading', false);

        if (typeof state.expanded !== 'boolean' || !privateState.areChildrenLoaded) {
          this.$set(state, 'expanded', false);
        }

        // Remove temp variable set by children initialization
        if (this.tns._.initializedWithoutChildren) {
          delete this.tns._.initializedWithoutChildren;
        }

        if (typeof state.selected !== 'boolean') {
          this.$set(state, 'selected', false);
        }

        if (this.tns.input) {
          if (state.input === null || typeof state.input !== 'object') {
            this.$set(state, 'input', {});
          }

          if (state.input.disabled === null || typeof state.input.disabled !== 'boolean') {
            this.$set(state.input, 'disabled', false);
          }

          if (this.tns.input.type === InputType.Checkbox) {

            if (typeof state.input.value !== 'boolean') {
              this.$set(state.input, 'value', false);
            }
          }
        }
      },
      /**
       * Assigns any properties from the source object to the target object
       * where the target object doesn't already define that property.
       * @param {Object} source The source object from which properties are read
       * @param {Object} target The target object into which missing properties are assigned
       */
      $_grtvn_assignDefaultProps(source, target) {

        // Make sure the defaults is an object
        if (isProbablyObject(source)) {

          // Use a copy of the source, since the props can be fubar'd by the assigns
          const sourceCopy = JSON.parse(JSON.stringify(source));

          // Assign existing values into the source
          Object.assign(sourceCopy, target);

          for (const propName of Object.keys(source)) {
            // Functions are lost on the JSON copy, so snag the original. Otherwise, use the merged value.
            const propValue = typeof source[propName] === 'function' ? source[propName] : sourceCopy[propName];

            if (isProbablyObject(propValue)) {
              // Find object properties to deep assign them
              this.$set(target, propName, target[propName] || {});
              this.$_grtvn_assignDefaultProps(propValue, target[propName]);
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
      /**
       * Pass the event for checkbox changes up from the node.
       * Emits a treeViewNodeCheckboxChange event
       * @param {Event} event The event that triggered the change
       */
      $_grtvn_onCheckboxChange(event) {
        this.$emit(TvEvent.CheckboxChange, this.model, event);
      },
      /**
       * Pass the event for radio button changes up from the node.
       * Emits a treeViewNodeRadioChange event
       * @param {Event} event The event that triggered the change
       */
      $_grtvn_onRadioChange(event) {
        this.$emit(TvEvent.RadioChange, this.model, event);
      },
      /**
       * Expand the children of this node, starting an asynchronous load if needed.
       * Emits a treeViewNodeExpandedChange event. When children are loaded asynchronously,
       * Emits a treeViewNodeChildrenLoad event.
       * @param {Event} event The event that triggered the expansion toggle
       */
      async $_grtvn_onExpandedChange(event) {
        let spec = this.tns;

        // First expand the node (to show either children or a "loading" indicator)
        spec.state.expanded = !spec.state.expanded;
        this.$emit(TvEvent.ExpandedChange, this.model, event);

        // If children need to be loaded asynchronously, load them.
        if (spec.state.expanded && !spec._.state.areChildrenLoaded && !spec._.state.areChildrenLoading) {

          spec._.state.areChildrenLoading = true;
          const childrenResult = await spec.loadChildrenAsync(this.model);

          if (childrenResult) {
            spec._.state.areChildrenLoaded = true;
            this.children.splice(0, this.children.length, ...childrenResult);
            this.$emit(TvEvent.ChildrenLoad, this.model, event);
          }

          spec._.state.areChildrenLoading = false;
        }
      },
      /**
       * Handle toggling the selected state for this node for Single and Multiple selection modes.
       * Note that for SelectionFollowsFocus mode the selection change is already handled by the
       * "model.treeNodeSpec.focusable" watcher method in TreeViewNodeAria.
       * @param {Event} event The event that triggered the selection toggle
       */
      $_grtvn_toggleSelected(event) {
        if (this.tns.selectable && [SelectionMode.Single, SelectionMode.Multiple].includes(this.selectionMode)) {
          this.tns.state.selected = !this.tns.state.selected;
        }
      },
      /**
       * Handles clicks on the node. It only performs actions if the click happened on an element
       * that does not have node clicks explicitly ingored (e.g., the expander button).
       * Emits a treeViewNodeClick event.
       * @param {Event} event The click event
       */
      $_grtvn_onClick(event) {
        // Don't fire this if the target is an element which has its own events
        if (!matches(event.target, this.elementsThatIgnoreClicks)) {
          this.$emit(TvEvent.Click, this.model, event);
          this.$_grtvn_toggleSelected(event);
        }

        this.$_grtvnAria_onClick();
      },
      /**
       * Handles double clicks on the node. It only performs actions if the double click happened on an
       * element that does not have node clicks explicitly ingored (e.g., the expander button).
       * Emits a treeViewNodeDblclick event.
       * @param {Event} event The dblclick event
       */
      $_grtvn_onDblclick(event) {
        // Don't fire this if the target is an element which has its own events
        if (!matches(event.target, this.elementsThatIgnoreClicks)) {
          this.$emit(TvEvent.DoubleClick, this.model, event);
        }
      },
      /**
       * Add a child node to the end of the child nodes list. The child node data is
       * supplied by an async callback which is the addChildCallback parameter of this node's model.
       * Emits a treeViewNodeAdd if a node is added
       * @param {Event} event The event that triggered the add
       */
      async $_grtvn_onAddChild(event) {
        if (this.tns.addChildCallback) {
          const childModel = await this.tns.addChildCallback(this.model);

          if (childModel) {
            this.children.push(childModel);
            this.$emit(TvEvent.Add, childModel, this.model, event);
          }
        }
      },
      $_grtvn_onDelete(event) {
        if (this.tns.deletable) {
          this.$emit(TvEvent.Delete, this.model, event);
        }
      },
      /**
       * Removes the given node from the array of children if found.
       * Note that only the node that was deleted fires these, not any subnode, so
       * this comes from a request from the child node for this node to delete it.
       * This emits the treeViewNodeDelete event.
       * @param node {TreeViewNode} The node to remove
       * @param event {Event} The initial event that triggered the deletion
       */
      $_grtvn_handleChildDeletion(node, event) {
        // Remove the node from the array of children if this is an immediate child.
        // Note that only the node that was deleted fires these, not any subnode.
        let targetIndex = this.children.indexOf(node);
        if (targetIndex > -1) {
          this.$_grtvnAria_handleChildDeletion(node);
          this.children.splice(targetIndex, 1);
        }

        this.$emit(TvEvent.Delete, node, event);
      }
    },
  };

  /**
   * Returns true if the given element matches the given selector.
   * @param {Element} target The target element to check
   * @param {string} selector The selector to check the target against
   * @returns {Boolean} True if the target element matches the selector, false otherwise.
   */
  function matches(target, selector) {
    let matchFn = target.matches || target.msMatchesSelector || target.webkitMatchesSelector;
    return matchFn && matchFn.call(target, selector);
  }

</script>

<style lang="scss">
  $baseHeight: 1.2rem;
  $itemSpacing: 1.2rem;

  // Everything's in a .grtv (embedded SCSS is the 'grtv-default-skin' skin)
  .grtv-wrapper.grtv-default-skin {

    // The node, including its content and children list
    .grtvn {
      padding-left: 0;

      &:first-child {
        margin-top: 0;
      }

      // ARIA styles
      &[role="treeitem"]:focus {
        outline: 0;

        >.grtvn-self {
          outline: black dotted 1px;
        }
      }
    }

    // The node's content, excluding the list of child nodes
    .grtvn-self {
      display: flex;
      align-items: flex-start;
      line-height: $baseHeight;
    }

    // Drag and Drop styles
    .grtvn-dragging .grtvn-self {
      opacity: 0.5;
    }

    .grtvn-self-drop-target {
      flex-wrap: wrap;

      &.grtvn-self-child-drop-target {
        opacity: .5;
      }

      .grtvn-self-sibling-drop-target {
        width: 100%;
        height: 7px;
        background-color: #dddddd;

        &.grtvn-self-sibling-drop-target-hover {
          background-color: #bbbbbb;
        }
      }
    }

    // The expander button and indicator content
    .grtvn-self-expander {
      padding: 0;
      background: none;
      border: none;
      height: $baseHeight;

      i.grtvn-self-expanded-indicator {
        font-style: normal;

        &::before {
          content: '+';
        }
      }

      &.grtvn-self-expanded {

        i.grtvn-self-expanded-indicator {

          &::before {
            content: '-';
          }
        }
      }
    }

    // The styling for when the node is selected
    .grtvn-self-selected {
      background-color: #f0f0f8;
    }

    // Spacing
    .grtvn-self-expander,
    .grtvn-self-checkbox,
    .grtvn-self-radio,
    .grtvn-self-spacer,
    .grtvn-self-action {
      min-width: 1rem;
    }

    .grtvn-self-expander,
    .grtvn-self-spacer {
      margin: 0;
    }

    .grtvn-self-checkbox,
    .grtvn-self-radio {
      margin: 0 0 0 (-$itemSpacing);
    }

    .grtvn-self-text,
    .grtvn-self-label {
      margin-left: $itemSpacing;
    }

    // Action buttons section
    .grtvn-self-action {
      padding: 0;
      background: none;
      border: none;
      height: $baseHeight;
    }

    // Action buttons (add, delete, etc)
    i.grtvn-self-add-child-icon {
      font-style: normal;

      &::before {
        content: '+';
      }
    }

    i.grtvn-self-delete-icon {
      font-style: normal;

      &::before {
        content: 'x';
      }
    }

    .grtvn-children-wrapper {
      margin: 0 0 0 (1rem + $itemSpacing);
    }

    // The node's child list
    .grtvn-children {
      padding: 0;
      list-style: none;
    }
  }
</style>
