import MimeType from '../../enums/mimeType.js';
import {
  dropEffect as DropEffect,
  targetZone as TargetZone
} from '../../enums/dragDrop.js';
import TvEvent from '../../enums/event.js';
import { useDomMethods } from '../domMethods.js'
import { useFocus } from '../focus/focus.js';

const { closest } = useDomMethods();

export function useTreeViewNodeDragAndDrop(model, children, treeId, emit) {

  const { unfocus } = useFocus();

  const tns = model.value.treeNodeSpec;

  /**
   * Remove the given child node from the array of children.
   * Note that only the child node that was moved fires the treeViewNodeDragMove
   * event that triggers this and that event is not propagated from here,
   * so the child should be found in the children prop array here. The event also only
   * fires when dragging between trees; otherwise node deletion happens as part of moving
   * it within the tree in $_grtvDnd_drop.
   * @param {TreeViewNode} node The node which was dragged/dropped
   */
  function dragMoveChild(node) {
    const targetIndex = children.value.indexOf(node);
    if (targetIndex > -1) {
      children.value.splice(targetIndex, 1);
    }
  }

  /**
   * Handling for the treeNodeDrop event on its way up the tree
   * to the TreeView component for final handling. The initial event
   * was fired from the node on which the drop happened.
   *
   * This handler sets the data's siblingNodeSet property to this node's
   * children if a sibling node set hasn't been set. The siblingNodeSet
   * is the set of nodes that contains the drop target, so if no lower
   * node has set it through this handler then the target must be this
   * node's child.
   * @param {Object} data The custom treeNodeDrop event data
   * @param {DragEvent} event The original DOM drop event
   */
  function drop(data, event) {
    data.siblingNodeSet = data.siblingNodeSet || children.value;
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
    let serialized = JSON.parse(JSON.stringify(model.value));
    unfocus(serialized);
    serialized = JSON.stringify(serialized);

    tns._.dragging = true;

    event.dataTransfer.effectAllowed = tns.dataTransferEffectAllowed;
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

    // The siblingNodeSet prop will be filled in by the next node up the chain for Before/After inserts
    // and is used in the final handler to add previous/next nodes.
    const eventData = {
      isSameTree: payload.treeId === treeId.value,
      droppedModel: payload.data,
      targetModel: model.value,
      siblingNodeSet: tzone === TargetZone.Child ? children.value : null,
      dropEffect: event.dataTransfer.dropEffect,
      targetZone: tzone
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
      if (tns._.dragMoved) {
        // If the node was moved within the original tree then it will have
        // been marked by $_grtvDnd_drop as such. Just clear the marker.
        delete tns._.dragMoved;
      }
      else {
        // If the node was moved to a different tree, delete it from this one
        // by passing this event to the parent node, or the TreeView if this
        // is a root node.
        emit(TvEvent.DragMove, model.value, event);
      }
    }
    else {
      setDropTargetProps(event, false);
      tns._.dragging = false;
    }
  }

  /**
   * Checks whether this node accepts drops, the event has node data,
   * and the event target is not the dragged node or a child element.
   * @param {DragEvent} event The event to check for droppable data
   */
  function isValidDropTargetForEvent(event) {
    return tns.allowDrop
      && event.dataTransfer.types.includes(MimeType.TreeViewNode)
      && !closest(event.target, '.grtvn-dragging');
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

    tns._.isDropTarget = isTarget;

    if (isPrevSiblingTarget) {
      tns._.isPrevDropTarget = isTarget;
      tns._.isChildDropTarget = false;
    }
    else if (isNextSiblingTarget) {
      tns._.isNextDropTarget = isTarget;
      tns._.isChildDropTarget = false;
    }
    else {
      tns._.isChildDropTarget = isTarget;
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
