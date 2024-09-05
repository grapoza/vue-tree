import { DropEffect, DropEventData, TargetZone } from '../../types/dragDrop';
import { useObjectMethods } from '../objectMethods';
import { useIdGeneration } from '../idGeneration'
import { useTreeViewDataUpdates } from '../treeViewDataUpdates';
import { useFocus } from '../focus/focus';
import { TreeViewNodeMetaModel } from 'types/treeView';
import { Ref } from 'vue';
import { useTreeViewConvenienceMethods } from 'composables/treeViewConvenienceMethods';

const { resolveNodeIdConflicts } = useIdGeneration();
const { cheapCopyObject } = useObjectMethods();
const { unfocus } = useFocus();

/**
 * Composable dealing with drag-and-drop handling at the top level of the tree view.
 * @param treeModel A Ref to the top level model of the tree
 * @param metaModel A Ref to the top level metadata model of the tree
 * @param uniqueId A Ref to the unique ID for the tree.
 * @param findById A function to find a node by ID
 * @param removeById A function to remove a node by ID
 * @returns Methods to deal with tree view level drag-and-drop
 */
export function useTreeViewDragAndDrop(
  treeModel: Ref<object[]>,
  metaModel: Ref<TreeViewNodeMetaModel[]>,
  uniqueId: Ref<string>,
  findById: ReturnType<typeof useTreeViewConvenienceMethods>["findById"],
  removeById: ReturnType<typeof useTreeViewConvenienceMethods>["removeById"]
) {
  const { spliceNodeList } = useTreeViewDataUpdates(treeModel, metaModel);

  /**
   * Removes the given node from this node's children
   * after a drag-and-drop move operation between trees.
   * @param metaNode The data for the moved node
   */
  function dragMoveNode(metaNode: TreeViewNodeMetaModel) {
    const targetIndex = metaModel.value.indexOf(metaNode);
    if (targetIndex > -1) {
      spliceNodeList(targetIndex, 1);
    }
  }

  /**
   * Handles a meta node getting dropped into this tree.
   * @param eventData The data about a drop event
   */
  function drop(eventData: DropEventData) {
    let metaNode = eventData.droppedModel;

    if (eventData.isSameTree) {
      // When dropping within the same tree, move/copy the actual node data.

      if (eventData.dropEffect === DropEffect.Move) {
        // Find and remove the actual dropped node from its current position.
        metaNode = removeById(metaNode.data[metaNode.idProperty])!;

        // Mark the node as moved within the tree so $_grtvnDnd_onDragend
        // knows not to remove it.
        metaNode._.dragMoved = true;
      } else {
        let originalNode = findById(metaNode.data[metaNode.idProperty]);
        metaNode = cheapCopyObject(originalNode!);
        resolveNodeIdConflicts(metaNode, uniqueId.value);

        // Force the copied node to not be focusable, in case the dragged node was.
        unfocus(metaNode);
      }
    } else {
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
    drop,
  };
}
