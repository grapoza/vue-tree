import { dropEffect as DropEffect, targetZone as TargetZone } from '../../enums/dragDrop.js';
import { useObjectMethods } from '../objectMethods.js';
import { useIdGeneration } from '../idGeneration.js'
import { useFocus } from '../focus/focus.js';

const { resolveNodeIdConflicts } = useIdGeneration();
const { cheapCopyObject } = useObjectMethods();
const { unfocus } = useFocus();

export function useTreeViewDragAndDrop(treeModel, uniqueId, findById, removeById) {
  /**
   * Removes the given node from this node's children
   * after a drag-and-drop move operation between trees.
   * @param {Object} node The data for the moved node
   */
  function dragMoveNode(node) {
    const targetIndex = treeModel.value.indexOf(node);
    if (targetIndex > -1) {
      treeModel.value.splice(targetIndex, 1);
    }
  }

  /**
   * Handles a TreeViewNode getting dropped into this tree.
   * @param {Object} eventData The data about a drop event
   */
  function drop(eventData) {
    let node = eventData.droppedModel;

    if (eventData.isSameTree) {
      // When dropping within the same tree, move/copy the actual node data.

      if (eventData.dropEffect === DropEffect.Move) {
        // Find and remove the actual dropped node from its current position.
        node = removeById(node[node.treeNodeSpec.idProperty]);

        // Mark the node as moved within the tree so $_grtvnDnd_onDragend
        // knows not to remove it.
        node.treeNodeSpec._.dragMoved = true;
      }
      else {
        let originalNode = findById(node[node.treeNodeSpec.idProperty]);
        node = cheapCopyObject(originalNode);
        resolveNodeIdConflicts(node, uniqueId.value);

        // Force the copied node to not be focusable, in case the dragged node was.
        unfocus(node);
      }
    }
    else {
      // Resolve node ID conflicts to prevent duplicate node IDs between existing
      // nodes in this tree and the copied node.
      resolveNodeIdConflicts(node, uniqueId.value);
    }

    if (node) {
      // If there's no sibling nodes in the event, use the top level.
      // Use that to find the target node's index (i.e. the drop location).
      let siblings = eventData.siblingNodeSet || treeModel.value;
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

  return {
    dragMoveNode,
    drop
  }
}
