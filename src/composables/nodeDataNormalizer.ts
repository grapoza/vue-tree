import { Ref, unref } from 'vue';
import { EffectAllowed } from '../types/dragDrop';
import { InputType } from '../types/inputType';
import { useObjectMethods } from './objectMethods';
import { TreeViewNodeMetaModelDefaults, TreeViewNodeMetaModelDefaultsMethod } from 'types/treeView';

const { isProbablyObject } = useObjectMethods();

const allowedEffectAllowedValues = [EffectAllowed.Copy, EffectAllowed.Move, EffectAllowed.CopyMove, EffectAllowed.None];

export function useNodeDataNormalizer(
  metaModel?: Ref<TreeViewNodeMetaModelDefaults>,
  modelDefaults?: TreeViewNodeMetaModelDefaultsMethod,
  radioGroupValues?: Ref<{ [key: string]: any }>
) {
  /**
   * Creates a new metadata model object. The object will get normalized
   * to the expected format by the normalizeNodeData method when its
   * TreeViewNode is created.
   * @param nodeData The data to be used in the node
   * @returns The metadata model object
   */
  const createMetaModel = (nodeData: object): TreeViewNodeMetaModelDefaults => ({
    data: nodeData,
    childMetaModels: [] as TreeViewNodeMetaModelDefaults[],
    _: {},
  });

  /**
   * Normalizes the data model to the format consumable by TreeViewNode.
   */
  function normalizeNodeData() {
    const rawMetaModel = unref(metaModel!);
    rawMetaModel.data = rawMetaModel.data ?? {};

    assignDefaultProps(unref(modelDefaults!)(rawMetaModel.data), rawMetaModel);

    // Set expected properties if not provided
    if (typeof rawMetaModel.idProperty !== "string") {
      rawMetaModel.idProperty = "id";
    }
    if (typeof rawMetaModel.labelProperty !== "string") {
      rawMetaModel.labelProperty = "label";
    }

    if (typeof rawMetaModel.expandable !== "boolean") {
      rawMetaModel.expandable = true;
    }
    if (typeof rawMetaModel.selectable !== "boolean") {
      rawMetaModel.selectable = false;
    }
    if (typeof rawMetaModel.deletable !== "boolean") {
      rawMetaModel.deletable = false;
    }
    if (typeof rawMetaModel.draggable !== "boolean") {
      rawMetaModel.draggable = false;
    }
    if (typeof rawMetaModel.allowDrop !== "boolean") {
      rawMetaModel.allowDrop = false;
    }
    if (
      typeof rawMetaModel.dataTransferEffectAllowed !== "string" ||
      !allowedEffectAllowedValues.includes(rawMetaModel.dataTransferEffectAllowed)
    ) {
      rawMetaModel.dataTransferEffectAllowed = EffectAllowed.CopyMove;
    }
    if (typeof rawMetaModel.focusable !== "boolean") {
      rawMetaModel.focusable = false;
    }

    if (typeof rawMetaModel.addChildCallback !== "function") {
      rawMetaModel.addChildCallback = null;
    }
    if (typeof rawMetaModel.deleteNodeCallback !== "function") {
      rawMetaModel.deleteNodeCallback = null;
    }

    if (typeof rawMetaModel.title !== "string" || rawMetaModel.title.trim().length === 0) {
      rawMetaModel.title = null;
    }
    if (
      typeof rawMetaModel.expanderTitle !== "string" ||
      rawMetaModel.expanderTitle.trim().length === 0
    ) {
      rawMetaModel.expanderTitle = null;
    }
    if (
      typeof rawMetaModel.addChildTitle !== "string" ||
      rawMetaModel.addChildTitle.trim().length === 0
    ) {
      rawMetaModel.addChildTitle = null;
    }
    if (
      typeof rawMetaModel.deleteTitle !== "string" ||
      rawMetaModel.deleteTitle.trim().length === 0
    ) {
      rawMetaModel.deleteTitle = null;
    }

    if (rawMetaModel.customizations == null || typeof rawMetaModel.customizations !== "object") {
      rawMetaModel.customizations = {};
    }

    if (typeof rawMetaModel.loadChildrenAsync !== "function") {
      rawMetaModel.loadChildrenAsync = null;
    }

    // Internal members
    rawMetaModel._ = {
      dragging: false,
    };

    normalizeNodeInputData(rawMetaModel);
    normalizeNodeStateData(rawMetaModel);
    normalizeNodeChildrenData(rawMetaModel);

    // If an addChildCallback is provided, warn the user if there is not a data children array to which the children could be added.
    if (rawMetaModel.addChildCallback && !Array.isArray(rawMetaModel.data![rawMetaModel.childrenProperty!])) {
      console.warn(`This node with an addChildCallback does not have a ${rawMetaModel.childrenProperty!} array to which children can be added.`, rawMetaModel.data);
    }

    metaModel!.value = rawMetaModel;
  }

  /**
   * Assigns any properties from the source object to the target object
   * where the target object doesn't already define that property.
   * @param source The source object from which properties are read
   * @param target The target object into which missing properties are assigned
   */
  function assignDefaultProps(
    source: TreeViewNodeMetaModelDefaults,
    target: TreeViewNodeMetaModelDefaults
  ) {
    // Make sure the defaults is an object
    if (isProbablyObject(source)) {
      // Use a copy of the source, since the props can be fubar'd by the assigns
      const sourceCopy = JSON.parse(JSON.stringify(source));

      // Assign existing values into the source
      Object.assign(sourceCopy, target);

      for (const propName of Object.keys(source)) {
        // Functions are lost on the JSON copy, so snag the original. Otherwise, use the merged value.
        const propValue =
          typeof source[propName] === "function" ? source[propName] : sourceCopy[propName];

        if (isProbablyObject(propValue)) {
          // Find object properties to deep assign them
          target[propName] = target[propName] || {};
          assignDefaultProps(propValue, target[propName]);
        } else if (typeof propValue === "function" && !target[propName]) {
          // Find function properties and assign if missing in target.
          target[propName] = propValue;
        } else {
          // Otherwise, copy from the source to the target.
          target[propName] = propValue;
        }
      }
    }
  }

  /**
   * Normalizes the data model's data related to input element generation.
   */
  function normalizeNodeInputData(rawMetaModel: TreeViewNodeMetaModelDefaults) {
    let input = rawMetaModel.input;

    // For nodes that are inputs, they must specify at least a type.
    // Only a subset of types are accepted.
    if (
      input === null ||
      typeof input !== "object" ||
      !Object.values(InputType).includes(input.type!)
    ) {
      rawMetaModel.input = null;
    } else {
      if (typeof input.name !== "string" || input.name.trim().length === 0) {
        input.name = null;
      }

      if (input.type === InputType.RadioButton) {
        if (typeof input.name !== "string" || input.name.trim().length === 0) {
          input.name = "unspecifiedRadioName";
        }
        if (typeof input.value !== "string" || input.value.trim().length === 0) {
          input.value = rawMetaModel.data![rawMetaModel.labelProperty!].replace(/[\s&<>"'\/]/g, "");
        }
        if (!radioGroupValues!.value.hasOwnProperty(input.name)) {
          radioGroupValues!.value[input.name] = "";
        }
        if (input.isInitialRadioGroupValue === true) {
          radioGroupValues!.value[input.name] = input.value;
        }
      }
    }
  }

  /**
   * Normalizes the data model's data related to the node's state.
   */
  function normalizeNodeStateData(rawMetaModel: TreeViewNodeMetaModelDefaults) {
    if (rawMetaModel.state === null || typeof rawMetaModel.state !== "object") {
      rawMetaModel.state = {};
    }
    if (rawMetaModel._!.state === null || typeof rawMetaModel._!.state !== "object") {
      rawMetaModel._!.state = {};
    }

    let state = rawMetaModel.state;
    let privateState = rawMetaModel._!.state;

    // areChildrenLoaded and areChildrenLoading are internal state used with asynchronous child
    // node loading. Any node with asynchronously loaded children starts as not expanded.
    privateState.areChildrenLoaded = typeof rawMetaModel.loadChildrenAsync !== "function";
    privateState.areChildrenLoading = false;

    if (typeof state.expanded !== "boolean" || !privateState.areChildrenLoaded) {
      state.expanded = false;
    }
    if (typeof state.selected !== "boolean") {
      state.selected = false;
    }

    if (rawMetaModel.input) {
      if (state.input === null || typeof state.input !== "object") {
        state.input = {};
      }

      if (state.input.disabled === null || typeof state.input.disabled !== "boolean") {
        state.input.disabled = false;
      }

      if (rawMetaModel.input.type === InputType.Checkbox) {
        if (typeof state.input.value !== "boolean") {
          state.input.value = false;
        }
      }
    }
  }

  /**
   * Normalizes the data model's data related to the node's children.
   */
  function normalizeNodeChildrenData(rawMetaModel: TreeViewNodeMetaModelDefaults) {
    if (typeof rawMetaModel.childrenProperty !== "string") {
      rawMetaModel.childrenProperty = "children";
    }
    if (!Array.isArray(rawMetaModel.childMetaModels)) {
      rawMetaModel.childMetaModels = [];
    }

    // Make sure each child has a meta model
    rawMetaModel.data![rawMetaModel.childrenProperty]?.forEach((childModel: object) => {
      if (
        !rawMetaModel.childMetaModels!.some((childMetaModel) => childMetaModel.data === childModel)
      ) {
        rawMetaModel.childMetaModels!.push(createMetaModel(childModel));
      }
    });
  }

  return {
    createMetaModel,
    normalizeNodeData,
  };
}