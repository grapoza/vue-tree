import { computed } from 'vue';
import { useChildren } from './children.js';
import { useTreeViewNodeDataUpdates } from '../treeViewNodeDataUpdates.js';
import TreeEvent from '../../enums/event.js';

/**
 * Composable dealing with children handling at the tree view node.
 * @param {Object} metaModel A Ref to the metadata model of the node
 * @param {Function} emit The TreeViewNode's emit function, used to emit selection events on the node's behalf
 * @returns {Object} Methods to deal with a tree view node's children
 */
export function useTreeViewNodeChildren(metaModel, emit) {

  const {
    getMetaChildren
  } = useChildren();

  const { spliceChildNodeList, pushChildNode } = useTreeViewNodeDataUpdates(metaModel);

  const areChildrenLoaded = computed(() => typeof metaModel.value.loadChildrenAsync !== 'function' || metaModel.value._.state.areChildrenLoaded);

  const areChildrenLoading = computed(() => metaModel.value._.state.areChildrenLoading);

  const children = computed(() => getMetaChildren(metaModel));

  const hasChildren = computed(() => children.value && children.value.length > 0);

  const mayHaveChildren = computed(() => hasChildren.value || !areChildrenLoaded.value);

  async function loadChildren() {
    const spec = metaModel.value;
    if (!spec._.state.areChildrenLoaded && !spec._.state.areChildrenLoading) {

      spec._.state.areChildrenLoading = true;
      var childrenResult = await spec.loadChildrenAsync(metaModel.value);

      if (childrenResult) {
        spec._.state.areChildrenLoaded = true;
        spliceChildNodeList(0, children.value.length, ...childrenResult);
        emit(TreeEvent.ChildrenLoad, metaModel.value);
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
    if (metaModel.value.addChildCallback) {
      var childModel = await metaModel.value.addChildCallback(metaModel.value);

      if (childModel) {
        pushChildNode(childModel);
        emit(TreeEvent.Add, children.value[children.value.length - 1], metaModel.value);
      }
    }
  }

  /**
   * Removes the given node from the array of children if found.
   * This emits the treeNodeDelete event.
   * @param {Object} metaNode The meta node to remove
   */
  function deleteChild(metaNode) {
    // Remove the node from the array of children if it is an immediate child.
    let targetIndex = children.value.indexOf(metaNode);
    if (targetIndex > -1) {
      spliceChildNodeList(targetIndex, 1);
      emit(TreeEvent.Delete, metaNode);
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