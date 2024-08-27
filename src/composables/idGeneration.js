import { useChildren } from "./children/children";

const { getChildren, getMetaChildren } = useChildren();

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
   * @param {Object} metaModel The tree meta node data to check for conflicts
   * @param {String} treeId The ID of the node's tree
   */
  function resolveNodeIdConflicts(metaModel, treeId) {

    const idProp = metaModel.idProperty;
    const nodeId = metaModel.data[idProp];
    const metaChildren = getMetaChildren(metaModel);
    const children = getChildren(metaModel);

    // Copy and move need to set a new, unique Node ID.
    // This is a brute force test to find one that isn't in use.
    if (document.getElementById(`${treeId}-${nodeId}`)) {
      let counter = 1;
      while (document.getElementById(`${treeId}-${nodeId}-${counter}`)) {
        counter++;
      }

      metaModel.data[idProp] = `${nodeId}-${counter}`;
    }

    metaChildren.forEach((child, index) => {
      resolveNodeIdConflicts(child, treeId);
      if (children[index][idProp] !== child.data[idProp]) {
        children[index][idProp] = child.data[idProp];
        metaChildren[index].data[idProp] = child.data[idProp];
      }
    });
  };

  return { generateUniqueId, resolveNodeIdConflicts };
}