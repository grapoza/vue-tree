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
 * @param {Array<String, Array>} nodeSpec The node specification array.
 * @param {String} baseId The base string used in the node IDs.
 * @param {Function} addChildCallback A method that returns a Promise that resolves to the node data to add as a subnode.
 */
export function generateNodes(nodeSpec, baseId = "", addChildCallback = null, loadChildrenAsync = null) {
    let nodes = [];
    let prevNode = null;

    nodeSpec.forEach(function (item, index) {
        if (Array.isArray(item)) {
            // Generate child nodes for Arrays
            if (prevNode === null) {
                return;
            }
            prevNode.children = generateNodes(item, prevNode.id, addChildCallback);
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
                    loadChildrenAsync,
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
                    addChildCallback
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

            nodes.push(prevNode);
        }
    });

    return nodes;
}