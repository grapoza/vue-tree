import MimeType from '../enums/mimeType';
import {
  dropEffect as DropEffect,
  effectAllowed as EffectAllowed,
  targetZone as TargetZone
} from '../enums/dragDrop';
import TvEvent from '../enums/event';

export default {
  methods: {
    /**
     * Remove the given child node from the array of children.
     * Note that only the child node that was moved fires the treeViewNodeDragMove
     * event that triggers this and that event is not propagated from here,
     * so the child should be found in the children prop array here. The event also only
     * fires when dragging between trees; otherwise node deletion happens as part of moving
     * it within the tree in $_grtvDnd_drop.
     * @param {TreeViewNode} node The node which was dragged/dropped
     */
    $_grtvnDnd_dragMoveChild(node) {
      const targetIndex = this.children.indexOf(node);
      if (targetIndex > -1) {
        this.children.splice(targetIndex, 1);
      }
    },
    /**
     * Handling for the treeViewNodeDrop event on its way up the tree
     * to the TreeView component for final handling. The initial event
     * was fired from the node on which the drop happened.
     *
     * This handler sets the data's siblingNodeSet property to this node's
     * children if a sibling node set hasn't been set. The siblingNodeSet
     * is the set of nodes that contains the drop target, so if no lower
     * node has set it through this handler then the target must be this
     * node's child.
     * @param {Object} data The custom treeViewNodeDrop event data
     * @param {DragEvent} event The original DOM drop event
     */
    $_grtvnDnd_drop(data, event) {
      data.siblingNodeSet = data.siblingNodeSet || this.children;
      this.$emit(TvEvent.Drop, data, event);
    },
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
    $_grtvnDnd_onDragstart(event) {
      event.stopPropagation();

      // Create the JSON copy used for the drag operation, and reset anything
      // that should not be included when the data is dropped in a different tree
      // (same-tree drops use the original node data)
      let serialized = JSON.parse(JSON.stringify(this.model));
      serialized.treeNodeSpec.focusable = false;
      serialized = JSON.stringify(serialized);

      this.model.treeNodeSpec._.dragging = true;

      event.dataTransfer.effectAllowed = EffectAllowed.CopyMove;
      event.dataTransfer.setData(MimeType.TreeViewNode, `{"treeId":"${this.treeId}","data":${serialized}}`);
      event.dataTransfer.setData(MimeType.Json, serialized);
      event.dataTransfer.setData(MimeType.PlainText, serialized);
    },
    /**
     * Checks whether this node can accept the drop and updates the model accordingly.
     * @param {DragEvent} event The original DOM dragEnter event
     */
    $_grtvnDnd_onDragenter(event) {
      if (this.$_grtvnDnd_isValidDropTargetForEvent(event)) {
        this.$_grtvnDnd_setDropTargetProps(event, true);
        event.preventDefault();
      }
    },
    /**
     * Checks whether this node can accept the drop and updates the model accordingly.
     * @param {DragEvent} event The original DOM dragOver event
     */
    $_grtvnDnd_onDragover(event) {
      if (this.$_grtvnDnd_isValidDropTargetForEvent(event)) {
        this.$_grtvnDnd_setDropTargetProps(event, true);
        event.preventDefault();
      }
    },
    /**
     * Checks whether this node can accept the drop and updates the model accordingly.
     * @param {DragEvent} event The original DOM dragLeave event
     */
    $_grtvnDnd_onDragleave(event) {
      if (this.$_grtvnDnd_isValidDropTargetForEvent(event)) {
        this.$_grtvnDnd_setDropTargetProps(event, false);
      }
    },
    /**
     * Handles the drop of a tree node onto this node by deciding what
     * kind of action should occur, crafting eventData, and emitting
     * the treeViewNodeDrop event so it can bubble up to the TreeView
     * for handling.
     * @param {DragEvent} event The original DOM drop event
     */
    $_grtvnDnd_onDrop(event) {

      const payload = JSON.parse(event.dataTransfer.getData(MimeType.TreeViewNode));

      const tzone =
          event.target.classList.contains('grtvn-self-prev-target') ? TargetZone.Before
        : event.target.classList.contains('grtvn-self-next-target') ? TargetZone.After
        : TargetZone.Child;

      // The siblingNodeSet prop will be filled in by the next node up the chain for Before/After inserts
      // and is used in the final handler to add previous/next nodes.
      const eventData = {
        isSameTree: payload.treeId === this.treeId,
        droppedModel: payload.data,
        targetModel: this.model,
        siblingNodeSet: tzone === TargetZone.Child ? this.children : null,
        dropEffect: event.dataTransfer.dropEffect,
        targetZone: tzone
      };

      this.$emit(TvEvent.Drop, eventData, event);

      this.$_grtvnDnd_setDropTargetProps(event, false);

      event.preventDefault();
    },
    /**
     * Handles the ending of this node getting dragged. A node moved
     * between trees is deleted via emitting the treeViewNodeDragMove
     * event. In any other case, this node's props are updated as needed.
     * @param {DragEvent} event The original DOM dragEnd event
     */
    $_grtvnDnd_onDragend(event) {

      if (event.dataTransfer.dropEffect === DropEffect.Move) {
        if (this.model.treeNodeSpec._.dragMoved) {
          // If the node was moved within the original tree then it will have
          // been marked by $_grtvDnd_drop as such. Just clear the marker.
          this.$delete(this.model.treeNodeSpec._, 'dragMoved');
        }
        else {
          // If the node was moved to a different tree, delete it from this one
          // by passing this event to the parent node, or the TreeView if this
          // is a root node.
          this.$emit(TvEvent.DragMove, this.model, event);
        }
      }
      else {
        this.$_grtvnDnd_setDropTargetProps(event, false);
        this.model.treeNodeSpec._.dragging = false;
      }
    },
    /**
     * Checks whether this node accepts drops, the event has node data,
     * and the event target is not the dragged node or a child element.
     * @param {DragEvent} event The event to check for droppable data
     */
    $_grtvnDnd_isValidDropTargetForEvent(event) {
      return this.model.treeNodeSpec.allowDrop
        && event.dataTransfer.types.includes(MimeType.TreeViewNode)
        && !closest(event.target, '.grtvn-dragging');
    },
    /**
     * Sets the model's properties based on whether this node is the current drop target,
     * and whether that drop is as a previous sibling, a next sibling, or a child.
     *
     * @param {DropEvent} event The event that caused this to trigger
     * @param {Boolean} isTarget True if this node is the drop target, false otherwise
     */
    $_grtvnDnd_setDropTargetProps(event, isTarget) {
      const isPrevSiblingTarget = event.target.classList && event.target.classList.contains('grtvn-self-prev-target');
      const isNextSiblingTarget = event.target.classList && event.target.classList.contains('grtvn-self-next-target');

      this.$set(this.model.treeNodeSpec._, 'isDropTarget', isTarget);

      if (isPrevSiblingTarget) {
        this.$set(this.model.treeNodeSpec._, 'isPrevDropTarget', isTarget);
        this.$set(this.model.treeNodeSpec._, 'isChildDropTarget', false);
      }
      else if (isNextSiblingTarget) {
        this.$set(this.model.treeNodeSpec._, 'isNextDropTarget', isTarget);
        this.$set(this.model.treeNodeSpec._, 'isChildDropTarget', false);
      }
      else {
        this.$set(this.model.treeNodeSpec._, 'isChildDropTarget', isTarget);
      }
    }
  }
};

/**
 * Runs Element.closest on a given node, handling text nodes by delegating to a parent.
 * @param {Element} node The element to check for a closest element
 * @param {String} selector The CSS selector to check
 * @param {Element} The closest Element that matches the selector
 */
function closest(node, selector) {
  const target = node.closest ? node : node.parentElement;
  return target.closest(selector);
}