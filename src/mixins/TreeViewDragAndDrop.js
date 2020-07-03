import { dropEffect as DropEffect, targetZone as TargetZone } from '../enums/dragDrop';
import { cheapCopyObject } from '../objectMethods';

export default {
  methods: {
    /**
     * Removes the given node from this node's children
     * after a drag-and-drop move operation between trees.
     * @param {Object} node The data for the moved node
     */
    $_treeViewDnd_dragMoveNode(node) {
      const targetIndex = this.model.indexOf(node);
      if (targetIndex > -1) {
        this.model.splice(targetIndex, 1);
      }
    },
    /**
     * Handles a TreeViewNode getting dropped into this tree.
     * @param {Object} eventData The data about a drop event
     */
    $_treeViewDnd_drop(eventData) {
      let node = eventData.droppedModel;

      if (!node) {
        return;
      }

      if (eventData.isSameTree) {
        // When dropping within the same tree, move/copy the actual node data.

        if (eventData.dropEffect === DropEffect.Move) {
          // Find and remove the actual dropped node from its current position.
          node = this.$_treeView_removeById(node[node.treeNodeSpec.idProperty]);

          // Mark the node as moved within the tree so $_treeViewNodeDnd_onDragend
          // knows not to remove it.
          node.treeNodeSpec._.dragMoved = true;
        }
        else {
          let originalNode = this.$_treeView_findById(node[node.treeNodeSpec.idProperty]);
          node = cheapCopyObject(originalNode);
          resolveNodeIdConflicts(node, this.uniqueId);

          // Force the copied node to not be focusable, in case the dragged node was.
          node.treeNodeSpec.focusable = false;
        }
      }
      else {
        // Resolve node ID conflicts to prevent duplicate node IDs between existing
        // nodes in this tree and the copied node.
        resolveNodeIdConflicts(node, this.uniqueId);
      }

      if (node) {
        // If there's no sibling nodes in the event, use the top level.
        // Use that to find the target node's index (i.e. the drop location).
        let siblings = eventData.siblingNodeSet || this.model;
        let targetIndex = siblings.indexOf(eventData.targetModel);

        // Add the node into the new position
        switch (eventData.targetZone) {
          case TargetZone.Before:
            siblings.splice(targetIndex, 0, node);
            break;

          case TargetZone.After:
            siblings.splice(targetIndex + 1, 0, node);
            break;

          default:
            siblings.push(node);
            break;
        }

        // Set dragged node's treeNodeSpec.dragging to false
        node.treeNodeSpec._.dragging = false;
      }
    }
  }
};

/**
 * Checks for and resolves any ID conflicts for the given node.
 * @param {Object} data The tree node data to check for conflicts
 * @param {String} treeId The ID of the node's tree
 */
function resolveNodeIdConflicts(data, treeId) {

  let idProp = data.treeNodeSpec.idProperty;
  let nodeId = data[idProp];
  let children = data[data.treeNodeSpec.childrenProperty] || [];

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
