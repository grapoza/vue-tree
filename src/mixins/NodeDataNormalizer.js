import InputType from '../enums/inputType';
import { isProbablyObject } from '../objectMethods';

export default {
  created() {
    this.$_grndn_normalizeNodeData();
  },
  methods: {
    /**
     * Normalizes the data model to the format consumable by TreeViewNode.
     */
    $_grndn_normalizeNodeData() {

      if (!this.tns) {
        this.model.treeNodeSpec = {};
      }

      this.$grndn_assignDefaultProps(this.modelDefaults, this.tns);

      // Set expected properties if not provided
      if (typeof this.tns.childrenProperty !== 'string') {
        this.tns.childrenProperty = 'children';
      }
      if (typeof this.tns.idProperty !== 'string') {
        this.tns.idProperty = 'id';
      }
      if (typeof this.tns.labelProperty !== 'string') {
        this.tns.labelProperty = 'label';
      }

      if (!Array.isArray(this.children)) {
        this.model[this.childrenPropName] = [];
      }
      if (typeof this.tns.expandable !== 'boolean') {
        this.tns.expandable = true;
      }
      if (typeof this.tns.selectable !== 'boolean') {
        this.tns.selectable = false;
      }
      if (typeof this.tns.deletable !== 'boolean') {
        this.tns.deletable = false;
      }
      if (typeof this.tns.draggable !== 'boolean') {
        this.tns.draggable = false;
      }
      if (typeof this.tns.allowDrop !== 'boolean') {
        this.tns.allowDrop = false;
      }
      if (typeof this.tns.focusable !== 'boolean') {
        this.tns.focusable = false;
      }

      if (typeof this.tns.addChildCallback !== 'function') {
        this.tns.addChildCallback = null;
      }

      if (typeof this.tns.title !== 'string' || this.tns.title.trim().length === 0) {
        this.tns.title = null;
      }
      if (typeof this.tns.expanderTitle !== 'string' || this.tns.expanderTitle.trim().length === 0) {
        this.tns.expanderTitle = null;
      }
      if (typeof this.tns.addChildTitle !== 'string' || this.tns.addChildTitle.trim().length === 0) {
        this.tns.addChildTitle = null;
      }
      if (typeof this.tns.deleteTitle !== 'string' || this.tns.deleteTitle.trim().length === 0) {
        this.tns.deleteTitle = null;
      }

      if (this.tns.customizations == null || typeof this.tns.customizations !== 'object') {
        this.tns.customizations = {};
      }

      if (typeof this.tns.loadChildrenAsync !== 'function') {
        this.tns.loadChildrenAsync = null;
      }

      // Internal members
      this.tns._ = {};
      this.tns._.dragging = false;

      this.$grndn_normalizeNodeInputData();
      this.$grndn_normalizeNodeStateData();
    },
    /**
     * Assigns any properties from the source object to the target object
     * where the target object doesn't already define that property.
     * @param {Object} source The source object from which properties are read
     * @param {Object} target The target object into which missing properties are assigned
     */
    $grndn_assignDefaultProps(source, target) {

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
            target[propName] = target[propName] || {};
            this.$grndn_assignDefaultProps(propValue, target[propName]);
          }
          else if (typeof propValue === 'function' && !target[propName]) {
            // Find function properties and assign if missing in target.
            target[propName] = propValue;
          }
          else {
            // Otherwise, copy from the source to the target.
            target[propName] = propValue;
          }
        }
      }
    },
    /**
     * Normalizes the data model's data related to input element generation.
     */
    $grndn_normalizeNodeInputData() {

      let input = this.tns.input;

      // For nodes that are inputs, they must specify at least a type.
      // Only a subset of types are accepted.
      if (input === null || typeof input !== 'object' || !Object.values(InputType).includes(input.type)) {
        this.tns.input = null;
      }
      else {
        if (typeof input.name !== 'string' || input.name.trim().length === 0) {
          input.name = null;
        }

        if (input.type === InputType.RadioButton) {
          if (typeof input.name !== 'string' || input.name.trim().length === 0) {
            input.name = 'unspecifiedRadioName';
          }
          if (typeof input.value !== 'string' || input.value.trim().length === 0) {
            input.value = this.label.replace(/[\s&<>"'\/]/g, '');
          }
          if (!this.radioGroupValues.hasOwnProperty(input.name)) {
            this.radioGroupValues[input.name] = '';
          }
          if (input.isInitialRadioGroupValue === true) {
            this.radioGroupValues[input.name] = input.value;
          }
        }
      }
    },
    /**
     * Normalizes the data model's data related to the node's state.
     */
    $grndn_normalizeNodeStateData() {
      if (this.tns.state === null || typeof this.tns.state !== 'object') {
        this.tns.state = {};
      }
      if (this.tns._.state === null || typeof this.tns._.state !== 'object') {
        this.tns._.state = {};
      }

      let state = this.tns.state;
      let privateState = this.tns._.state;

      // areChildrenLoaded and areChildrenLoading are internal state used with asynchronous child
      // node loading. Any node with asynchronously loaded children starts as not expanded.
      privateState.areChildrenLoaded = typeof this.tns.loadChildrenAsync !== 'function';
      privateState.areChildrenLoading = false;

      if (typeof state.expanded !== 'boolean' || !privateState.areChildrenLoaded) {
        state.expanded = false;
      }
      if (typeof state.selected !== 'boolean') {
        state.selected = false;
      }

      if (this.tns.input) {
        if (state.input === null || typeof state.input !== 'object') {
          state.input = {};
        }

        if (state.input.disabled === null || typeof state.input.disabled !== 'boolean') {
          state.input.disabled = false;
        }

        if (this.tns.input.type === InputType.Checkbox) {

          if (typeof state.input.value !== 'boolean') {
            state.input.value = false;
          }
        }
      }
    }
  }
};