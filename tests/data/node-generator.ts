import { InputType } from '../../src/types/inputType';
import type { TreeViewAddChildCallbackMethod, TreeViewLoadChildNodesAsyncMethod, TreeViewNodeMetaModel, TreeViewNodeMetaModelDefaults, TreeViewNodeMetaModelDefaultsMethod } from "../../src/types/treeView";

type NodeSpec = Array<string|NodeSpec>;

export type TestTreeViewNode = {
  id: string;
  label: string;
  children: TestTreeViewNode[];
};

/**
 * Generates nodes, one per array element that is not itself an array.
 * Array elements that are arrays recursively generate child nodes
 * of the last created node.
 *
 * The node spec's node string should be matched by the regex:
 *  `[eE]?[sS]?[d]?[f]?[[cCrR]!?]?`
 *
 * This identifies if the node is:
 *  e: expandable. If capitalized, .treeNodeSpec.state.expanded is set to true.
 *  s: selectable. If capitalized, .treeNodeSpec.state.selected is set to true.
 *  d: deletable
 *  f: focusable
 *  c: is a checkbox node. If capitalized, it's checked. If followed by '!', it's disabled. Cannot be used with 'r'.
 *  r: is a radiobutton node. If capitalized, it's checked. If followed by '!', it's disabled. Cannot be used with 'c'.
 *
 * A node that allows adds will use the addChildCallback function passed to generateNodes.
 * A node that loads children asynchronously will use the loadChildrenAsync function passed to generateNodes.
 *
 * @param nodeSpec The node specification array.
 * @param baseId The base string used in the node IDs.
 * @param addChildCallback A method that returns a Promise that resolves to the node data to add as a subnode.
 * @param loadChildrenAsync A method that returns a Promise that resolves to child nodes to set as the children.
 * @returns The requested nodes and a function to define model defaults. These can be used as the v-model and modelDefaults props of the TreeView component.
 */
export function generateNodes(
  nodeSpec: NodeSpec,
  baseId: string = "",
  addChildCallback: TreeViewAddChildCallbackMethod | null = null,
  loadChildrenAsync: TreeViewLoadChildNodesAsyncMethod | null = null
) {
  let nodes: TestTreeViewNode[] = [];
  let prevNode: TestTreeViewNode | null = null;
  let modelDefaultMap: Map<string, TreeViewNodeMetaModelDefaults> = new Map();

  nodeSpec.forEach(function (item, index) {
    if (Array.isArray(item)) {
      // Generate child nodes for Arrays
      if (prevNode === null) {
        return;
      }
      const result = generateNodes(item, prevNode.id, addChildCallback);
      prevNode.children = result.nodes;
      result.modelDefaultMap.forEach((value, key) => modelDefaultMap.set(key, value));
    } else {
      let lowerItem = item.toLowerCase();
      let idString = baseId + "n" + index;

      prevNode = {
        id: idString,
        label: "Node " + index,
        children: [],
      };

      const prevMeta: TreeViewNodeMetaModelDefaults = {
        _: {
          dragging: false,
          state: {
            areChildrenLoaded: loadChildrenAsync === null,
            matchesFilter: true,
          },
        },
        childrenProperty: "children",
        idProperty: "id",
        labelProperty: "label",
        loadChildrenAsync,
        expandable: lowerItem.includes("e"),
        selectable: lowerItem.includes("s"),
        deletable: lowerItem.includes("d"),
        focusable: lowerItem.includes("f"),
        input: lowerItem.includes("c")
          ? { type: InputType.Checkbox, name: `${idString}-cbx` }
          : lowerItem.includes("r")
          ? {
              type: InputType.RadioButton,
              name: `${baseId || "root"}-rb`,
              value: `${idString}-val`,
            }
          : null,
        state: {
          expanded: item.includes("E"),
          selected: item.includes("S"),
        },
        addChildCallback,
      };

      // Set up input state if needed
      if (prevMeta.input) {
        // Disable inputs
        prevMeta.state!.input = {
          disabled: item.includes("!"),
        };

        // Set up checkbox state
        if (lowerItem.includes("c")) {
          prevMeta.state!.input.value = item.includes("C");
        }

        // Set up the radiobutton state in the radioState
        if (item.includes("R")) {
          prevMeta.input.isInitialRadioGroupValue = true;
        }
      }

      nodes.push(prevNode);
      modelDefaultMap.set(idString, prevMeta);
    }
  });

  const modelDefaults: TreeViewNodeMetaModelDefaultsMethod = (node: TestTreeViewNode) =>
    modelDefaultMap.get(node.id) ?? ({} as TreeViewNodeMetaModelDefaults);
  return { nodes, modelDefaultMap, modelDefaults };
}

export function generateMetaNodes(
  nodeSpec: NodeSpec,
  baseId: string = "",
  addChildCallback: TreeViewAddChildCallbackMethod | null = null,
  loadChildrenAsync: TreeViewLoadChildNodesAsyncMethod | null = null
) {
  const { nodes, modelDefaults } = generateNodes(
    nodeSpec,
    baseId,
    addChildCallback,
    loadChildrenAsync
  );
  return generateMetaNodesForList(nodes, modelDefaults);
}

export function generateNodesAndMetaNodes(
  nodeSpec: NodeSpec,
  baseId: string = "",
  addChildCallback: TreeViewAddChildCallbackMethod | null = null,
  loadChildrenAsync: TreeViewLoadChildNodesAsyncMethod | null = null
) {
  const { nodes, modelDefaults } = generateNodes(
    nodeSpec,
    baseId,
    addChildCallback,
    loadChildrenAsync
  );
  return { nodes, metaNodes: generateMetaNodesForList(nodes, modelDefaults) };
}

function generateMetaNodesForList(
  nodes: TestTreeViewNode[],
  modelDefaults: TreeViewNodeMetaModelDefaultsMethod
) {
  let metaNodes: TreeViewNodeMetaModel[] = [];

  nodes.forEach(function (item) {
    const metaNode: TreeViewNodeMetaModel = {
      data: item,
      childMetaModels: generateMetaNodesForList(item.children, modelDefaults),
      ...modelDefaults(item)!,
    } as TreeViewNodeMetaModel;

    metaNodes.push(metaNode);
  });

  return metaNodes;
}