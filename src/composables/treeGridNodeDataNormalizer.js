import { unref } from 'vue';
import { useObjectMethods } from './objectMethods.js';

const { isProbablyObject } = useObjectMethods();

export function useTreeGridNodeDataNormalizer(model, modelDefaults, radioGroupValues) {

  /**
   * Normalizes the data model to the format consumable by TreeGridRow.
   */
  function normalizeNodeData() {

    if (!model.value.treeNodeSpec) {
      model.value.treeNodeSpec = {};
    }

    const tns = model.value.treeNodeSpec;

    assignDefaultProps(unref(modelDefaults), tns);

    normalizeNodeStateData(tns);
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

    if (typeof tns.state.expanded !== 'boolean') {
      tns.state.expanded = false;
    }
  }

  return {
    normalizeNodeData
  };
}