import { computed } from 'vue';
import { useChildren } from './children.js';
import TreeEvent from '../../enums/event.js';

/**
 * Composable dealing with children handling at the tree view node.
 * @param {TreeViewNode} nodeModel A Ref to the model of the node
 * @param {Function} emit The TreeViewNode's emit function, used to emit selection events on the node's behalf
 * @returns {Object} Methods to deal with a tree view node's children
 */
export function useTreeViewNodeChildren(nodeModel, emit) {

  const {
    getChildren
  } = useChildren();

  const areChildrenLoaded = computed(() => typeof nodeModel.value.treeNodeSpec.loadChildrenAsync !== 'function' || nodeModel.value.treeNodeSpec._.state.areChildrenLoaded);

  const areChildrenLoading = computed(() => nodeModel.value.treeNodeSpec._.state.areChildrenLoading);

  const children = computed(() => getChildren(nodeModel));

  const hasChildren = computed(() => children.value && children.value.length > 0);

  const mayHaveChildren = computed(() => hasChildren.value || !areChildrenLoaded.value);

  async function loadChildren() {
    const spec = nodeModel.value.treeNodeSpec;
    if (!spec._.state.areChildrenLoaded && !spec._.state.areChildrenLoading) {

      spec._.state.areChildrenLoading = true;
      var childrenResult = await spec.loadChildrenAsync(nodeModel.value);
      if (childrenResult) {
        spec._.state.areChildrenLoaded = true;
        children.value.splice(0, children.value.length, ...childrenResult);
        emit(TreeEvent.ChildrenLoad, nodeModel.value);
      }

      spec._.state.areChildrenLoading = false;
    }
  }

  /**
   * Add a child node to the end of the child nodes list. The child node data is
   * supplied by an async callback which is the addChildCallback parameter of this node's model.
   * Emits a treeNodeAdd if a node is added
   */
  async function addChild() {
    if (nodeModel.value.treeNodeSpec.addChildCallback) {
      var childModel = await nodeModel.value.treeNodeSpec.addChildCallback(nodeModel.value);

      if (childModel) {
        children.value.push(childModel);
        emit(TreeEvent.Add, childModel, nodeModel.value);
      }
    }
  }

  /**
   * Removes the given node from the array of children if found.
   * This emits the treeNodeDelete event.
   * @param {TreeViewNode} node The node to remove
   */
  function deleteChild(node) {
    // Remove the node from the array of children if it is an immediate child.
    let targetIndex = children.value.indexOf(node);
    if (targetIndex > -1) {
      children.value.splice(targetIndex, 1);
      emit(TreeEvent.Delete, node);
    }
  }

  return {
    addChild,
    areChildrenLoaded,
    areChildrenLoading,
    children,
    deleteChild,
    hasChildren,
    loadChildren,
    mayHaveChildren,
  };
}