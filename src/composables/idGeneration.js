export function useIdGeneration() {

  /**
   * Creates an element ID that is unique across the document
   * @return {string} The generated ID
   */
  function generateUniqueId() {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let newId = 'grt-';

    do {
      newId += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    while (newId.length < 8 || document.getElementById(newId))

    return newId;
  }

  /**
   * Checks for and resolves any ID conflicts for the given node.
   * @param {Object} data The tree node data to check for conflicts
   * @param {String} treeId The ID of the node's tree
   */
  function resolveNodeIdConflicts(data, treeId) {

    const idProp = data.treeNodeSpec.idProperty;
    const nodeId = data[idProp];
    const children = data[data.treeNodeSpec.childrenProperty];

    // Copy and move need to set a new, unique Node ID.
    // This is a brute force test to find one that isn't in use.
    if (document.getElementById(`${treeId}-${nodeId}`)) {
      let counter = 1;
      while (document.getElementById(`${treeId}-${nodeId}-${counter}`)) {
        counter++;
      }

      data[idProp] = `${nodeId}-${counter}`;
    }

    children.forEach(child => resolveNodeIdConflicts(child, treeId));
  };

  return { generateUniqueId, resolveNodeIdConflicts };
}