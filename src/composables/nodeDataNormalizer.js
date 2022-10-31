import { unref } from 'vue';
import { effectAllowed as EffectAllowed } from '../enums/dragDrop.js'
import InputType from '../enums/inputType';
import { useObjectMethods } from './objectMethods.js';

const { isProbablyObject } = useObjectMethods();

const allowedEffectAllowedValues = [EffectAllowed.Copy, EffectAllowed.Move, EffectAllowed.CopyMove, EffectAllowed.None];

export function useNodeDataNormalizer(model, modelDefaults, radioGroupValues) {

  /**
   * Normalizes the data model to the format consumable by TreeViewNode.
   */
  function normalizeNodeData() {

    if (!model.value.treeNodeSpec) {
      model.value.treeNodeSpec = {};
    }

    const tns = model.value.treeNodeSpec;

    assignDefaultProps(unref(modelDefaults), tns);

    // Set expected properties if not provided
    if (typeof tns.childrenProperty !== 'string') {
      tns.childrenProperty = 'children';
    }
    if (typeof tns.idProperty !== 'string') {
      tns.idProperty = 'id';
    }
    if (typeof tns.labelProperty !== 'string') {
      tns.labelProperty = 'label';
    }

    if (!Array.isArray(model.value[tns.childrenProperty])) {
      model.value[tns.childrenProperty] = [];
    }
    if (typeof tns.expandable !== 'boolean') {
      tns.expandable = true;
    }
    if (typeof tns.selectable !== 'boolean') {
      tns.selectable = false;
    }
    if (typeof tns.deletable !== 'boolean') {
      tns.deletable = false;
    }
    if (typeof tns.draggable !== 'boolean') {
      tns.draggable = false;
    }
    if (typeof tns.allowDrop !== 'boolean') {
      tns.allowDrop = false;
    }
    if (typeof tns.dataTransferEffectAllowed !== 'string' || !allowedEffectAllowedValues.includes(tns.dataTransferEffectAllowed)) {
      tns.dataTransferEffectAllowed = EffectAllowed.CopyMove;
    }
    if (typeof tns.focusable !== 'boolean') {
      tns.focusable = false;
    }

    if (typeof tns.addChildCallback !== 'function') {
      tns.addChildCallback = null;
    }

    if (typeof tns.title !== 'string' || tns.title.trim().length === 0) {
      tns.title = null;
    }
    if (typeof tns.expanderTitle !== 'string' || tns.expanderTitle.trim().length === 0) {
      tns.expanderTitle = null;
    }
    if (typeof tns.addChildTitle !== 'string' || tns.addChildTitle.trim().length === 0) {
      tns.addChildTitle = null;
    }
    if (typeof tns.deleteTitle !== 'string' || tns.deleteTitle.trim().length === 0) {
      tns.deleteTitle = null;
    }

    if (tns.customizations == null || typeof tns.customizations !== 'object') {
      tns.customizations = {};
    }

    if (typeof tns.loadChildrenAsync !== 'function') {
      tns.loadChildrenAsync = null;
    }

    // Internal members
    tns._ = {};
    tns._.dragging = false;

    normalizeNodeInputData(tns);
    normalizeNodeStateData(tns);

    model.value.treeNodeSpec = tns;
  }

  /**
   * Assigns any properties from the source object to the target object
   * where the target object doesn't already define that property.
   * @param {Object} source The source object from which properties are read
   * @param {Object} target The target object into which missing properties are assigned
   */
  function assignDefaultProps(source, target) {

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
          assignDefaultProps(propValue, target[propName]);
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
  }

  /**
   * Normalizes the data model's data related to input element generation.
   */
  function normalizeNodeInputData(tns) {

    let input = tns.input;

    // For nodes that are inputs, they must specify at least a type.
    // Only a subset of types are accepted.
    if (input === null || typeof input !== 'object' || !Object.values(InputType).includes(input.type)) {
      tns.input = null;
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
          input.value = model.value[tns.labelProperty].replace(/[\s&<>"'\/]/g, '');
        }
        if (!radioGroupValues.value.hasOwnProperty(input.name)) {
          radioGroupValues.value[input.name] = '';
        }
        if (input.isInitialRadioGroupValue === true) {
          radioGroupValues.value[input.name] = input.value;
        }
      }
    }
  }

  /**
   * Normalizes the data model's data related to the node's state.
   */
  function normalizeNodeStateData(tns) {
    if (tns.state === null || typeof tns.state !== 'object') {
      tns.state = {};
    }
    if (tns._.state === null || typeof tns._.state !== 'object') {
      tns._.state = {};
    }

    let state = tns.state;
    let privateState = tns._.state;

    // areChildrenLoaded and areChildrenLoading are internal state used with asynchronous child
    // node loading. Any node with asynchronously loaded children starts as not expanded.
    privateState.areChildrenLoaded = typeof tns.loadChildrenAsync !== 'function';
    privateState.areChildrenLoading = false;

    if (typeof state.expanded !== 'boolean' || !privateState.areChildrenLoaded) {
      state.expanded = false;
    }
    if (typeof state.selected !== 'boolean') {
      state.selected = false;
    }

    if (tns.input) {
      if (state.input === null || typeof state.input !== 'object') {
        state.input = {};
      }

      if (state.input.disabled === null || typeof state.input.disabled !== 'boolean') {
        state.input.disabled = false;
      }

      if (tns.input.type === InputType.Checkbox) {

        if (typeof state.input.value !== 'boolean') {
          state.input.value = false;
        }
      }
    }
  }

  return {
    normalizeNodeData
  };
}