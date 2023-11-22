import { unref } from 'vue';
import { effectAllowed as EffectAllowed } from '../../enums/dragDrop.js'
import { useObjectMethods } from '../objectMethods.js';

const { isProbablyObject } = useObjectMethods();

const allowedEffectAllowedValues = [EffectAllowed.Copy, EffectAllowed.Move, EffectAllowed.CopyMove, EffectAllowed.None];

export function useTreeNodeDataNormalizer(model, modelDefaults) {

  /**
   * Normalizes the data model to the format consumable by a tree node.
   * @returns {boolean} true if the data was normalized, false otherwise.
   */
  function normalizeNodeData() {
    const unrefModel = unref(model);

    if (!unrefModel.treeNodeSpec) {
      unrefModel.treeNodeSpec = {};
    }

    const tns = unrefModel.treeNodeSpec;

    // If internal state has already been created then this node has been normalized. Short circuit.
    if (isProbablyObject(tns._)) {
      return false;
    }

    // Internal members
    tns._ = {};
    tns._.dragging = false;

    assignDefaultProps(unref(modelDefaults), tns);

    // Set expected properties if not provided
    if (typeof tns.childrenProperty !== 'string') {
      tns.childrenProperty = 'children';
    }
    if (typeof tns.idProperty !== 'string') {
      tns.idProperty = 'id';
    }

    if (!Array.isArray(unrefModel[tns.childrenProperty])) {
      unrefModel[tns.childrenProperty] = [];
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

    if (typeof tns.addChildCallback !== 'function') {
      tns.addChildCallback = null;
    }
    if (typeof tns.deleteNodeCallback !== 'function') {
      tns.deleteNodeCallback = null;
    }

    if (typeof tns.loadChildrenAsync !== 'function') {
      tns.loadChildrenAsync = null;
    }

    normalizeNodeStateData(tns);

    unrefModel.treeNodeSpec = tns;

    return true;
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

    // matchesFilter and subnodeMatchesFilter are internal state used for filtering. These will
    // end up getting set by a watchEffect in the treeNodeFilter composable.
    privateState.matchesFilter = true;
    privateState.subnodeMatchesFilter = true;

    if (typeof state.expanded !== 'boolean' || !privateState.areChildrenLoaded) {
      state.expanded = false;
    }
    if (typeof state.selected !== 'boolean') {
      state.selected = false;
    }
  }

  return {
    normalizeNodeData
  };
}