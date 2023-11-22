import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useTreeViewNodeFocus } from './treeViewNodeFocus.js';
import { useNodeGenerator } from '../../../tests/data/node-generator.js';
import TreeEvent from '../../enums/event.js';

const { generateNodes } = useNodeGenerator();

const isMountedRef = ref(true);

describe('treeViewNodeFocus.js', () => {

  let nodeElement = null;
  let emit;

  beforeEach(() => {
    // Create an element to use as the node element
    nodeElement = document.createElement('input')
    document.body.appendChild(nodeElement);
    emit = vi.fn();
  });

  afterEach(() => {
    document.body.removeChild(nodeElement);
  });

  describe('when handling a focus change', () => {

    let nodes;

    beforeEach(async () => {
      // Calling the use sets up the watcher
      nodes = generateNodes(['ecsf', 'eCs']);
      let nodeRef = ref(nodes[1]);
      useTreeViewNodeFocus(nodeRef, ref(nodeElement), emit, isMountedRef);
      nodeRef.value.treeNodeSpec.focusable = true;
    });

    it('should emit the treeNodeAriaFocusableChange event', () => {
      expect(emit).toHaveBeenCalledWith(TreeEvent.FocusableChange, nodes[1]);
    });

    it('should focus the node element', () => {
      expect(nodeElement).to.equal(document.activeElement);
    });
  });

  describe('when focusing a node', () => {

    it('should set the node as focused', () => {
      const node = generateNodes(['es'])[0];
      const { focusNode } =
        useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
      focusNode();
      expect(node.treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when unfocusing a node', () => {

    it('should set the node as unfocused', () => {
      const node = generateNodes(['esf'])[0];
      const { unfocusNode } =
        useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
      unfocusNode();
      expect(node.treeNodeSpec.focusable).to.be.false;
    });
  });

  describe('when checking if a node is focused', () => {

    describe('and the node is focusable', () => {

      it('should return true', () => {
        const node = generateNodes(['esf'])[0];
        const { isFocusedNode } =
          useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
        expect(isFocusedNode()).to.be.true;
      });
    });

    describe('and the node is not focusable', () => {

      it('should return false', () => {
        const node = generateNodes(['es'])[0];
        const { isFocusedNode } =
          useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
        expect(isFocusedNode()).to.be.false;
      });
    });
  });

  describe('when focusing the first child of the node', () => {

    it('should focus the first node', () => {
      const node = generateNodes(['Es', ['es', 'esf']])[0];
      const { focusFirstChild } =
        useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
      focusFirstChild();
      expect(node.children[0].treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when focusing the last child of the node', () => {

    it('should focus the last visible child node', () => {
      const node = generateNodes(['Es', ['esf', 'es']])[0];
      const { focusLastChild } =
        useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
      focusLastChild();

      expect(node.children[1].treeNodeSpec.focusable).to.be.true;
    });

    it('should ignore non-expanded child nodes', () => {
      const node = generateNodes(['Es', ['ecsf', 'eCs', 'ecs', ['ecs']]])[0];
      const { focusLastChild } =
        useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
      focusLastChild();

      expect(node.children[2].treeNodeSpec.focusable).to.be.true;
    });

    it('should focus the deepest last node', () => {
      const node = generateNodes(['Es', ['ecsf', 'eCs', 'Ecs', ['ecs']]])[0];
      const { focusLastChild } =
        useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
      focusLastChild();

      expect(node.children[2].children[0].treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when focusing the next node', () => {

    describe('and the last child node is focused', () => {

      it('should not change focusableness', () => {
        const node = generateNodes(['Es', ['ecs', 'eCsf']])[0];
        const { focusNextNode } =
          useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
        focusNextNode(node.children[1]);
        expect(node.children[1].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the current child node does not have any expanded children', () => {

      it('should set the next sibling node as focusable', () => {
        const node = generateNodes(['Es', ['ecsf', ['ecs', 'ecs'], 'ecs']])[0];
        const { focusNextNode } =
          useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
        focusNextNode(node.children[0]);
        expect(node.children[1].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the current child node has expanded children', () => {

      let node;

      beforeEach(() => {
        node = generateNodes(['Es', ['Ecsf', ['ecs', 'ecs'], 'ecs']])[0];
      });

      it('should set the first expanded child node as focusable', () => {
        const { focusNextNode } =
          useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
        focusNextNode(node.children[0]);
        expect(node.children[0].children[0].treeNodeSpec.focusable).to.be.true;
      });

      describe('and the children are explicitly ignored', () => {

        it('sets the next sibling node as focusable', () => {
          const { focusNextNode } =
            useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
          focusNextNode(node.children[0], true);
          expect(node.children[1].treeNodeSpec.focusable).to.be.true;
        });
      });
    });
  });
});