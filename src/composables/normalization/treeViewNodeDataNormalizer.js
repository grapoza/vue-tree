import InputType from '../../enums/inputType';
import { useTreeNodeDataNormalizer } from './treeNodeDataNormalizer.js'

export function useTreeViewNodeDataNormalizer(model, modelDefaults, radioGroupValues) {

  const { normalizeNodeData } = useTreeNodeDataNormalizer(model, modelDefaults);

  /**
   * Normalizes the data model to the format consumable by TreeViewNode.
   * @returns {boolean} true if the data was normalized, false otherwise.
   */
  function normalizeTreeViewNodeData() {

    if (!normalizeNodeData()) {
      return false;
    }

    const tns = model.value.treeNodeSpec;

    // Set expected properties if not provided
    if (typeof tns.labelProperty !== 'string') {
      tns.labelProperty = 'label';
    }

    if (typeof tns.focusable !== 'boolean') {
      tns.focusable = false;
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

    normalizeNodeInputData(tns);
    normalizeNodeStateData(tns);

    model.value.treeNodeSpec = tns;

    return true;
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
    let state = tns.state;

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
    normalizeTreeViewNodeData
  };
}