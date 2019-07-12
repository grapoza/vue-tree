/**
 * Generates nodes, one per array element that is not itself an array.
 * Array elements that are arrays recursively generate child nodes
 * of the last created node. Additionally, the initial state for radio
 * buttons will be added to the radioState parameter.
 *
 * The node spec's node string should be matched by the regex:
 *  `[eE]?[sS]?[d]?[a]?[[cCrR]!?]?`
 * The presence of e, s, d, a, or c|r indicate the node is expandable, selectable, deletable,
 * addable (subnodes can be added), and a checkbox or radio buttton respectively.
 * If it is capitalized, then the related state should be True. In the case of inputs,
 * the capitalization means the input will be selected. The `!` indicates the input will be disabled.
 * A node that allows adds will use the callback function passed to generateNodes.
 *
 * @param {Array<String, Array>} nodeSpec The node specification array.
 * @param {Object} radioState An object in which the state of radio button groups is generated. Essentially an "out".
 * @param {String} baseId The base string used in the node IDs.
 * @param {Function} addChildCallback A method that returns a Promise that resolves to the node data to add as a subnode.
 */
export function generateNodes(nodeSpec, radioState, baseId = "", addChildCallback = null) {
    let nodes = [];
    let prevNode = null;

    nodeSpec.forEach(function (item, index) {
        if (Array.isArray(item)) {
            // Generate child nodes for Arrays
            if (prevNode === null) {
                return;
            }
            prevNode.children = generateNodes(item, radioState, prevNode.id, addChildCallback);
        }
        else {
            let lowerItem = item.toLowerCase();
            let idString = baseId + 'n' + index;

            prevNode = {
                id: idString,
                label: 'Node ' + index,
                expandable: lowerItem.includes('e'),
                selectable: lowerItem.includes('s'),
                deletable: lowerItem.includes('d'),
                input: lowerItem.includes('c')
                    ? { type: 'checkbox', name: `${idString}-cbx` }
                    : lowerItem.includes('r')
                        ? { type: 'radio', name: `${baseId || 'root'}-rb`, value: `${idString}-val` }
                        : null,
                state: {
                    expanded: item.includes('E'),
                    selected: item.includes('S')
                },
                addChildCallback: item.includes('a') ? addChildCallback : null,
                children: []
            };

            // Set up input state if needed
            if (prevNode.input) {

                // Disable inputs
                prevNode.state.input = {
                    disabled: item.includes('!')
                };

                // Set up checkbox state
                if (lowerItem.includes('c')) {
                    prevNode.state.input.value = item.includes('C')
                }

                // Set up the radiobutton state in the radioState
                if (lowerItem.includes('r')) {
                    if (!radioState.hasOwnProperty(prevNode.input.name)) {
                        radioState[prevNode.input.name] = null;
                    }

                    // Radio button selectedness can also be specified in the normal way by providing
                    // the radio button data to the TreeView's radioGroupValues prop.
                    if (item.includes('R')) {
                        radioState[prevNode.input.name] = prevNode.input.value;
                    }
                }
            }

            nodes.push(prevNode);
        }
    });

    return nodes;
}