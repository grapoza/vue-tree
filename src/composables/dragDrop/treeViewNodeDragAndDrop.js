import MimeType from '../../enums/mimeType.js';
import {
  dropEffect as DropEffect,
  targetZone as TargetZone
} from '../../enums/dragDrop.js';
import TvEvent from '../../enums/event.js';
import { useDomMethods } from '../domMethods.js'
import { useFocus } from '../focus/focus.js';
import { useChildren } from "../children/children.js";
import { useTreeViewNodeDataUpdates } from '../treeViewNodeDataUpdates.js';

const { closest } = useDomMethods();

const { getChildren, getMetaChildren } = useChildren();

/**
 * Composable dealing with drag-and-drop handling at the tree view node.
 * @param {Ref<Object>} metaModel A Ref to the metaModel of the node
 * @param {Ref<string>} treeId A Ref to the tree ID
 * @param {Function} emit The TreeViewNode's emit function, used to emit selection events on the node's behalf
 * @returns {Object} Methods to deal with tree view node level drag-and-drop
 */
export function useTreeViewNodeDragAndDrop(metaModel, treeId, emit) {

  const { unfocus } = useFocus();
  const { spliceChildNodeList } = useTreeViewNodeDataUpdates(metaModel);

  /**
   * Remove the given child node from the array of children.
   * Note that only the child node that was moved fires the treeViewNodeDragMove
   * event that triggers this and that event is not propagated from here,
   * so the child should be found in the children prop array here. The event also only
   * fires when dragging between trees; otherwise node deletion happens as part of moving
   * it within the tree in $_grtvDnd_drop.
   * @param {Object} metaNode The node which was dragged/dropped
   */
  function dragMoveChild(metaNode) {
    const targetIndex = getMetaChildren(metaModel).indexOf(metaNode);
    if (targetIndex > -1) {
      spliceChildNodeList(targetIndex, 1);
    }
  }

  /**
   * Handling for the treeNodeDrop event on its way up the tree
   * to the TreeView component for final handling. The initial event
   * was fired from the node on which the drop happened.
   *
   * This handler sets the data's siblingNodeSets property to this node's
   * children if a sibling node set hasn't been set. The siblingNodeSets
   * are the sets of nodes and metas that contains the drop target, so if no lower
   * node has set it through this handler then the target must be this
   * node's child.
   * @param {Object} data The custom treeNodeDrop event data
   * @param {DragEvent} event The original DOM drop event
   */
  function drop(data, event) {
    data.siblingNodeSets = data.siblingNodeSets || {
      nodes: getChildren(metaModel),
      metaNodes: getMetaChildren(metaModel),
    };
    emit(TvEvent.Drop, data, event);
  }

  /**
   * Handles starting a drag on this node.
   *
   * The data for the drag event contains a custom MIME type for tree view
   * nodes, as well as JSON and Text types. All of these contain the
   * serialized TreeViewNode data, but the TreeViewNode wraps that in
   * an object containing both the node data and the ID of the tree from
   * which the node originates. That ID is used when dropping to determine
   * whether a drop occurred in the origin tree or a different tree.
   * @param {DragEvent} event The original DOM dragStart event
   */
  function onDragstart(event) {
    event.stopPropagation();

    // Create the JSON copy used for the drag operation, and reset anything
    // that should not be included when the data is dropped in a different tree
    // (same-tree drops use the original node data)
    let serialized = JSON.parse(JSON.stringify(metaModel.value));
    unfocus(serialized);
    serialized = JSON.stringify(serialized);

    metaModel.value._.dragging = true;

    event.dataTransfer.effectAllowed = metaModel.value.dataTransferEffectAllowed;
    event.dataTransfer.setData(MimeType.TreeViewNode, `{"treeId":"${treeId.value}","data":${serialized}}`);
    event.dataTransfer.setData(MimeType.Json, serialized);
    event.dataTransfer.setData(MimeType.PlainText, serialized);
  }

  /**
   * Checks whether this node can accept the drop and updates the model accordingly.
   * @param {DragEvent} event The original DOM dragEnter event
   */
  function onDragenter(event) {
    if (isValidDropTargetForEvent(event)) {
      setDropTargetProps(event, true);
      event.preventDefault();
    }
  }

  /**
   * Checks whether this node can accept the drop and updates the model accordingly.
   * @param {DragEvent} event The original DOM dragOver event
   */
  function onDragover(event) {
    if (isValidDropTargetForEvent(event)) {
      setDropTargetProps(event, true);
      event.preventDefault();
    }
  }

  /**
   * Checks whether this node can accept the drop and updates the model accordingly.
   * @param {DragEvent} event The original DOM dragLeave event
   */
  function onDragleave(event) {
    if (isValidDropTargetForEvent(event)) {
      setDropTargetProps(event, false);
    }
  }

  /**
   * Handles the drop of a tree node onto this node by deciding what
   * kind of action should occur, crafting eventData, and emitting
   * the treeNodeDrop event so it can bubble up to the TreeView
   * for handling.
   * @param {DragEvent} event The original DOM drop event
   */
  function onDrop(event) {

    const payload = JSON.parse(event.dataTransfer.getData(MimeType.TreeViewNode));

    const tzone =
      event.target.classList.contains('grtvn-self-prev-target') ? TargetZone.Before
        : event.target.classList.contains('grtvn-self-next-target') ? TargetZone.After
          : TargetZone.Child;

    // The siblingNodeSets prop will be filled in by the next node up the chain for Before/After inserts
    // and is used in the final handler to add previous/next nodes.
    const eventData = {
      isSameTree: payload.treeId === treeId.value,
      droppedModel: payload.data,
      targetModel: metaModel.value,
      siblingNodeSets:
        tzone === TargetZone.Child
          ? {
              nodes: getChildren(metaModel),
              metaNodes: getMetaChildren(metaModel),
            }
          : null,
      dropEffect: event.dataTransfer.dropEffect,
      targetZone: tzone,
    };

    emit(TvEvent.Drop, eventData, event);

    setDropTargetProps(event, false);

    event.preventDefault();
  }

  /**
   * Handles the ending of this node getting dragged. A node moved
   * between trees is deleted via emitting the treeViewNodeDragMove
   * event. In any other case, this node's props are updated as needed.
   * @param {DragEvent} event The original DOM dragEnd event
   */
  function onDragend(event) {

    if (event.dataTransfer.dropEffect === DropEffect.Move) {
      if (metaModel.value._.dragMoved) {
        // If the node was moved within the original tree then it will have
        // been marked by $_grtvDnd_drop as such. Just clear the marker.
        delete metaModel.value._.dragMoved;
      }
      else {
        // If the node was moved to a different tree, delete it from this one
        // by passing this event to the parent node, or the TreeView if this
        // is a root node.
        emit(TvEvent.DragMove, metaModel.value, event);
      }
    }
    else {
      setDropTargetProps(event, false);
      metaModel.value._.dragging = false;
    }
  }

  /**
   * Checks whether this node accepts drops, the event has node data,
   * and the event target is not the dragged node or a child element.
   * @param {DragEvent} event The event to check for droppable data
   */
  function isValidDropTargetForEvent(event) {
    return (
      metaModel.value.allowDrop &&
      event.dataTransfer.types.includes(MimeType.TreeViewNode) &&
      !closest(event.target, ".grtvn-dragging")
    );
  }

  /**
   * Sets the model's properties based on whether this node is the current drop target,
   * and whether that drop is as a previous sibling, a next sibling, or a child.
   *
   * @param {DropEvent} event The event that caused this to trigger
   * @param {Boolean} isTarget True if this node is the drop target, false otherwise
   */
  function setDropTargetProps(event, isTarget) {
    const isPrevSiblingTarget = event.target.classList && event.target.classList.contains('grtvn-self-prev-target');
    const isNextSiblingTarget = event.target.classList && event.target.classList.contains('grtvn-self-next-target');

    metaModel.value._.isDropTarget = isTarget;

    if (isPrevSiblingTarget) {
      metaModel.value._.isPrevDropTarget = isTarget;
      metaModel.value._.isChildDropTarget = false;
    }
    else if (isNextSiblingTarget) {
      metaModel.value._.isNextDropTarget = isTarget;
      metaModel.value._.isChildDropTarget = false;
    }
    else {
      metaModel.value._.isChildDropTarget = isTarget;
    }
  }

  return {
    dragMoveChild,
    drop,
    onDragstart,
    onDragenter,
    onDragover,
    onDragleave,
    onDrop,
    onDragend
  };
}
