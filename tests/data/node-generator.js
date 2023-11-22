import InputType from '../../src/enums/inputType';
import { useTreeNodeDataNormalizer } from '../../src/composables/normalization/treeNodeDataNormalizer';

/**
 * Functions to create node data that can be fed to trees.
 *
 * @param {Boolean} normalizeNodes True to normalize the generated node data (useful for testing composables that expect normalized data). Defaults to true.
 * @returns {Object} Functions for generating node data.
 */
export function useNodeGenerator(normalizeNodes = true) {

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
     * @param {Array<String|Array>} nodeSpec The node specification array.
     * @param {String} baseId The base string used in the node IDs.
     * @param {Object} modelDefaults The default values for the nodes' model data.
     * @param {Boolean} normalizeNodes True to normalize the node data after it is generated
     * @returns {TreeViewNode[]} The requested nodes
     */
    function generateNodes(nodeSpec, baseId = "", modelDefaults = {}) {
        let nodes = [];
        let prevNode = null;

        nodeSpec.forEach(function (item, index) {
            if (Array.isArray(item)) {
                // Generate child nodes for Arrays
                if (prevNode === null) {
                    return;
                }
                prevNode.children = generateNodes(item, prevNode.id, modelDefaults);
            }
            else {
                let lowerItem = item.toLowerCase();
                let idString = baseId + 'n' + index;

                prevNode = {
                    id: idString,
                    label: 'Node ' + index,
                    children: [],
                    treeNodeSpec: {
                        childrenProperty: 'children',
                        idProperty: 'id',
                        labelProperty: 'label',
                        loadChildrenAsync: modelDefaults.loadChildrenAsync,
                        expandable: lowerItem.includes('e'),
                        selectable: lowerItem.includes('s'),
                        deletable: lowerItem.includes('d'),
                        focusable: lowerItem.includes('f'),
                        input: lowerItem.includes('c')
                            ? { type: InputType.Checkbox, name: `${idString}-cbx` }
                            : lowerItem.includes('r')
                                ? { type: InputType.RadioButton, name: `${baseId || 'root'}-rb`, value: `${idString}-val` }
                                : null,
                        state: {
                            expanded: item.includes('E'),
                            selected: item.includes('S')
                        },
                        addChildCallback: modelDefaults.addChildCallback,
                        draggable: false,
                        allowDrop: false,
                        dataTransferEffectAllowed: "copyMove",
                        deleteNodeCallback: null,
                    }
                };

                // Set up input state if needed
                if (prevNode.treeNodeSpec.input) {

                    // Disable inputs
                    prevNode.treeNodeSpec.state.input = {
                        disabled: item.includes('!')
                    };

                    // Set up checkbox state
                    if (lowerItem.includes('c')) {
                        prevNode.treeNodeSpec.state.input.value = item.includes('C')
                    }

                    // Set up the radiobutton state in the radioState
                    if (item.includes('R')) {
                        prevNode.treeNodeSpec.input.isInitialRadioGroupValue = true;
                    }
                }

                if (normalizeNodes) {
                    const { normalizeNodeData } = useTreeNodeDataNormalizer(prevNode, modelDefaults);
                    normalizeNodeData();
                }

                nodes.push(prevNode);
            }
        });

        return nodes;
    };

    return { generateNodes };
};