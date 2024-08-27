import { dropEffect as DropEffect, targetZone as TargetZone } from '../../enums/dragDrop.js';
import { useObjectMethods } from '../objectMethods.js';
import { useIdGeneration } from '../idGeneration.js'
import { useTreeViewDataUpdates } from '../treeViewDataUpdates.js';
import { useFocus } from '../focus/focus.js';
import { unref } from 'vue';

const { resolveNodeIdConflicts } = useIdGeneration();
const { cheapCopyObject } = useObjectMethods();
const { unfocus } = useFocus();

/**
 * Composable dealing with drag-and-drop handling at the top level of the tree view.
 * @param {Ref<TreeViewNode[]>} treeModel A Ref to the top level model of the tree
 * @param {Ref<Object[]>} metaModel A Ref to the top level metadata model of the tree
 * @param {Ref<string>} uniqueId A Ref to the unique ID for the tree.
 * @param {Function} findById A function to find a node by ID
 * @param {Function} removeById A function to remove a node by ID
 * @returns {Object} Methods to deal with tree view level drag-and-drop
 */
export function useTreeViewDragAndDrop(treeModel, metaModel, uniqueId, findById, removeById) {

  const { spliceNodeList } = useTreeViewDataUpdates(treeModel, metaModel);

  /**
   * Removes the given node from this node's children
   * after a drag-and-drop move operation between trees.
   * @param {Object} node The data for the moved node
   */
  function dragMoveNode(node) {
    const targetIndex = metaModel.value.indexOf(node);
    if (targetIndex > -1) {
      spliceNodeList(targetIndex, 1);
    }
  }

  /**
   * Handles a meta node getting dropped into this tree.
   * @param {Object} eventData The data about a drop event
   */
  function drop(eventData) {

    let metaNode = eventData.droppedModel;

    if (eventData.isSameTree) {
      // When dropping within the same tree, move/copy the actual node data.

      if (eventData.dropEffect === DropEffect.Move) {
        // Find and remove the actual dropped node from its current position.
        metaNode = removeById(metaNode.data[metaNode.idProperty]);

        // Mark the node as moved within the tree so $_grtvnDnd_onDragend
        // knows not to remove it.
        metaNode._.dragMoved = true;
      }
      else {
        let originalNode = findById(metaNode.data[metaNode.idProperty]);
        metaNode = cheapCopyObject(originalNode);
        resolveNodeIdConflicts(metaNode, uniqueId.value);

        // Force the copied node to not be focusable, in case the dragged node was.
        unfocus(metaNode);
      }
    }
    else {
      // Resolve node ID conflicts to prevent duplicate node IDs between existing
      // nodes in this tree and the copied node.
      resolveNodeIdConflicts(metaNode, uniqueId.value);
    }

    if (metaNode) {
      // If there's no sibling nodes in the event, use the top level.
      // Use that to find the target node's index (i.e. the drop location).
      let siblings = eventData.siblingNodeSets?.nodes || treeModel.value;
      let metaSiblings = eventData.siblingNodeSets?.metaNodes || metaModel.value;

      let targetIndex = metaSiblings.indexOf(eventData.targetModel);

      // Add the node into the new position
      switch (eventData.targetZone) {
        case TargetZone.Before:
          siblings.splice(targetIndex, 0, metaNode.data);
          metaSiblings.splice(targetIndex, 0, metaNode);
          break;

        case TargetZone.After:
          siblings.splice(targetIndex + 1, 0, metaNode.data);
          metaSiblings.splice(targetIndex + 1, 0, metaNode);
          break;

        default:
          siblings.push(metaNode.data);
          metaSiblings.push(metaNode);
          break;
      }

      // Set dragged node's treeNodeSpec.dragging to false
      metaNode._.dragging = false;
    }
  }

  return {
    dragMoveNode,
    drop
  }
}
