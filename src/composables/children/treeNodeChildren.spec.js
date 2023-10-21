import { beforeEach, expect, describe, it, vi } from 'vitest';
import { ref } from 'vue';
import { useTreeNodeChildren } from './treeNodeChildren.js';
import { generateNodes } from '../../../tests/data/node-generator.js';
import TreeEvent from '../../enums/event.js';

let emit;

describe('TreeNodeChildren.js', () => {

  beforeEach(() => {
    emit = vi.fn();
  });

  describe('when checking if child nodes are loaded', () => {

    describe('and the child nodes are supplied statically', () => {

      it('should return true', () => {
        const node = ref(generateNodes(['es'])[0]);
        const { areChildrenLoaded } = useTreeNodeChildren(node, emit);
        expect(areChildrenLoaded.value).to.be.true;
      });
    });

    describe('and the child nodes are supplied via an async loader', () => {

      const asyncLoader = async () => Promise.resolve(generateNodes(['es']));

      describe('and the children have been loaded', () => {

        it('should return true', () => {
          const node = ref(generateNodes([''], '', null, asyncLoader)[0]);
          node.value.treeNodeSpec._.state.areChildrenLoaded = true;
          const { areChildrenLoaded } = useTreeNodeChildren(node, emit);
          expect(areChildrenLoaded.value).to.be.true;
        });
      });

      describe('and the children have not been loaded', () => {

        it('should return false', () => {
          const node = ref(generateNodes([''], '', null, asyncLoader)[0]);
          node.value.treeNodeSpec._.state.areChildrenLoaded = false;
          const { areChildrenLoaded } = useTreeNodeChildren(node, emit);
          expect(areChildrenLoaded.value).to.be.false;
        });
      });
    });
  });

  describe('when checking if children are loading', () => {

    describe('and the children are loading', () => {

      it('should return true', () => {
        const node = ref(generateNodes(['es'])[0]);
        node.value.treeNodeSpec._.state.areChildrenLoading = true;
        const { areChildrenLoading } = useTreeNodeChildren(node, emit);
        expect(areChildrenLoading.value).to.be.true;
      });
    });

    describe('and the children are not loading', () => {

      it('should return false', () => {
        const node = ref(generateNodes(['es'])[0]);
        node.value.treeNodeSpec._.state.areChildrenLoading = false;
        const { areChildrenLoading } = useTreeNodeChildren(node, emit);
        expect(areChildrenLoading.value).to.be.false;
      });
    });
  });

  describe('when getting children', () => {

    describe('and a children property name is specified', () => {

      it('should return the value of the given property', () => {
        const node = ref(generateNodes(['es', ['es', 'es']])[0]);
        node.value.children2 = node.children;
        delete node.value.children;
        node.value.treeNodeSpec.childrenProperty = 'children2';
        const { children } = useTreeNodeChildren(node, emit);
        expect(children.value).to.equal(node.children2);
      });
    });

    describe('and a children property name is not specified', () => {

      it('should return the value of the `children` property', () => {
        const node = ref(generateNodes(['es', ['es', 'es']])[0]);
        delete node.value.treeNodeSpec.childrenProperty;
        const { children } = useTreeNodeChildren(node, emit);
        expect(children.value).to.equal(node.value.children);
      });
    });
  });

  describe('when checking if a node has children', () => {

    describe('and the node has no children', () => {

      it('should return false', () => {
        const node = ref(generateNodes(['es'])[0]);
        const { hasChildren } = useTreeNodeChildren(node, emit);
        expect(hasChildren.value).to.be.false;
      });
    });

    describe('and the node has children', () => {

      it('should return true', () => {
        const node = ref(generateNodes(['es', ['es', 'es']])[0]);
        const { hasChildren } = useTreeNodeChildren(node, emit);
        expect(hasChildren.value).to.be.true;
      });
    });
  });

  describe('when checking if the node may have children', () => {

    describe('and the node has children', () => {

      it('should return true', () => {
        const node = ref(generateNodes(['es', ['es', 'es']])[0]);
        const { mayHaveChildren } = useTreeNodeChildren(node, emit);
        expect(mayHaveChildren.value).to.be.true;
      });
    });

    describe('and the node does not have children', () => {

      it('should return false', () => {
        const node = ref(generateNodes(['es'])[0]);
        const { mayHaveChildren } = useTreeNodeChildren(node, emit);
        expect(mayHaveChildren.value).to.be.false;
      });
    });

    describe('and the nodes children are not loaded yet', () => {

      it('should return true', () => {
        const node = ref(generateNodes([''], '', null, () => Promise.resolve({}))[0]);
        node.value.treeNodeSpec._.state.areChildrenLoaded = false;
        const { mayHaveChildren } = useTreeNodeChildren(node, emit);
        expect(mayHaveChildren.value).to.be.true;
      });
    });
  });

  describe('when loading children', () => {

    describe('and children are already loaded', () => {

      it('should not modify the children list', async () => {
        const node = ref(generateNodes([''], '', null, async () => Promise.resolve(generateNodes(['es'])))[0]);
        node.value.treeNodeSpec._.state.areChildrenLoaded = true;
        const { children, loadChildren } = useTreeNodeChildren(node, emit);
        await loadChildren();
        expect(children.value).toHaveLength(0);
      });
    });

    describe('and children are currently loading', () => {

      it('should not modify the children list', async () => {
        const node = ref(generateNodes([''], '', null, async () => Promise.resolve(generateNodes(['es'])))[0]);
        node.value.treeNodeSpec._.state.areChildrenLoading = true;
        const { children, loadChildren } = useTreeNodeChildren(node, emit);
        await loadChildren();
        expect(children.value).toHaveLength(0);
      });
    });

    describe('and the async loader returns children', () => {

      it('should set the node children to the async loader method result', async () => {
        const node = ref(generateNodes([''], '', null, async () => Promise.resolve(generateNodes(['es'])))[0]);
        const { children, loadChildren } = useTreeNodeChildren(node, emit);
        await loadChildren();
        expect(children.value).toHaveLength(1);
      });

      it('should emit the children loaded event', async () => {
        const node = ref(generateNodes([''], '', null, async () => Promise.resolve(generateNodes(['es'])))[0]);
        const { children, loadChildren } = useTreeNodeChildren(node, emit);
        await loadChildren();
        expect(emit).toHaveBeenCalledWith(TreeEvent.ChildrenLoad, node.value);
      });
    });

    describe('and the async loader does not return children', () => {

      it('should not set the node children', async () => {
        const node = ref(generateNodes([''], '', null, async () => Promise.resolve([]))[0]);
        const { children, loadChildren } = useTreeNodeChildren(node, emit);
        await loadChildren();
        expect(children.value).toHaveLength(0);
      });
    });
  });

  describe('when adding a child node', () => {

    describe('and the callback returns a child node', () => {

      it('should modify the children list', async () => {
        const node = ref(generateNodes(['es'], null, async () => Promise.resolve(generateNodes(['es'])[0]))[0]);
        const { children, addChild } = useTreeNodeChildren(node, emit);
        await addChild();
        expect(children.value).toHaveLength(1);
      });

      it('should emit the children added event', async () => {
        const node = ref(generateNodes(['es'], null, async () => Promise.resolve(generateNodes(['es'])[0]))[0]);
        const { children, addChild } = useTreeNodeChildren(node, emit);
        await addChild();
        expect(emit).toHaveBeenCalledWith(TreeEvent.Add, children.value[0], node.value);
      });
    });

    describe('and the callback does not return a node', () => {

      it('should not modify the children list', async () => {
        const node = ref(generateNodes(['es'], null, async () => Promise.resolve(null))[0]);
        const { children, addChild } = useTreeNodeChildren(node, emit);
        await addChild();
        expect(children.value).toHaveLength(0);
      });
    });
  });

  describe('when deleting a child node', () => {

    it('should remove the child from the children list', () => {
      const node = ref(generateNodes(['es', ['es', 'es']])[0]);
      const { children, deleteChild } = useTreeNodeChildren(node, emit);
      const deletedNode = children.value[0];
      deleteChild(deletedNode);
      expect(children.value).toHaveLength(1);
    });

    it('should emit the removal event', () => {
      const node = ref(generateNodes(['es', ['es', 'es']])[0]);
      const { children, deleteChild } = useTreeNodeChildren(node, emit);
      const deletedNode = children.value[0];
      deleteChild(deletedNode);
      expect(emit).toHaveBeenCalledWith(TreeEvent.Delete, deletedNode);
    });
  });
});