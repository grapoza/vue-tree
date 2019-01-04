/**
 * Generates nodes, one per array element that is not an array.
 * Array elements that are arrays recursively generate child nodes
 * of the last created node.
 *
 * The node spec's node string should be in the format:
 *  [eE]?[cC]?[sS]?
 * The presence of e, c or s indicate the node is expandable, checkable, or selectable
 * respectively. If it is capitalized, then the related state should be True.
 *
 * @param {Array<String, Array>} nodeSpec The node specification array.
 * @param {String} baseId The base string used in the node IDs.
 */
export function generateNodes(nodeSpec, baseId = "") {
    let nodes = [];
    let prevNode = null;

    nodeSpec.forEach(function (item, index) {
        if (Array.isArray(item)) {
            if (prevNode === null) {
                return;
            }
            prevNode.children = generateNodes(item, prevNode.id);
        }
        else {
            prevNode = {
                id: baseId + 'n' + index,
                label: 'Node ' + index,
                checkable: item.toLowerCase().indexOf('c') > -1,
                expandable: item.toLowerCase().indexOf('e') > -1,
                selectable: item.toLowerCase().indexOf('s') > -1,
                state: {
                    checked: item.indexOf('C') > -1,
                    expanded: item.indexOf('E') > -1,
                    selected: item.indexOf('S') > -1
                },
                children: []
            };

            nodes.push(prevNode);
        }
    });

    return nodes;
}