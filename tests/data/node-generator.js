/**
 * Generates nodes, one per array element that is not itself an array.
 * Array elements that are arrays recursively generate child nodes
 * of the last created node. Additionally, the initial state for radio
 * buttons will be added to the radioState parameter.
 *
 * The node spec's node string should be matched by the regex:
 *  `[eE]?[sS]?[d]?[f]?[[cCrR]!?]?`
 *
 * This identifies if the node is:
 *  e: expandable. If capitalized, state.expanded is set to true.
 *  s: selectable. If capitalized, state.selected is set to true.
 *  d: deletable
 *  f: focusable
 *  c: is a checkbox node. If capitalized, it's checked. If followed by '!', it's disabled. Cannot be used with 'r'.
 *  r: is a radiobutton node. If capitalized, it's checked. If followed by '!', it's disabled. Cannot be used with 'c'.
 *
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
                focusable: lowerItem.includes('f'),
                input: lowerItem.includes('c')
                    ? { type: 'checkbox', name: `${idString}-cbx` }
                    : lowerItem.includes('r')
                        ? { type: 'radio', name: `${baseId || 'root'}-rb`, value: `${idString}-val` }
                        : null,
                state: {
                    expanded: item.includes('E'),
                    selected: item.includes('S')
                },
                addChildCallback,
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