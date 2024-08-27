import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useTreeViewNodeFocus } from './treeViewNodeFocus.js';
import { generateMetaNodes } from '../../../tests/data/node-generator.js';
import TreeEvent from '../../enums/event.js';

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
      nodes = generateMetaNodes(['ecsf', 'eCs']);
      let nodeRef = ref(nodes[1]);
      useTreeViewNodeFocus(nodeRef, ref(nodeElement), emit, isMountedRef);
      nodeRef.value.focusable = true;
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
      const node = generateMetaNodes(['es'])[0];
      const { focusNode } =
        useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
      focusNode();
      expect(node.focusable).to.be.true;
    });
  });

  describe('when unfocusing a node', () => {

    it('should set the node as unfocused', () => {
      const node = generateMetaNodes(['esf'])[0];
      const { unfocusNode } =
        useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
      unfocusNode();
      expect(node.focusable).to.be.false;
    });
  });

  describe('when checking if a node is focused', () => {

    describe('and the node is focusable', () => {

      it('should return true', () => {
        const node = generateMetaNodes(['esf'])[0];
        const { isFocusedNode } =
          useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
        expect(isFocusedNode()).to.be.true;
      });
    });

    describe('and the node is not focusable', () => {

      it('should return false', () => {
        const node = generateMetaNodes(['es'])[0];
        const { isFocusedNode } =
          useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
        expect(isFocusedNode()).to.be.false;
      });
    });
  });

  describe('when focusing the first child of the node', () => {

    it('should focus the first node', () => {
      const node = generateMetaNodes(['Es', ['es', 'esf']])[0];
      const { focusFirstChild } =
        useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
      focusFirstChild();
      expect(node.childMetaModels[0].focusable).to.be.true;
    });
  });

  describe('when focusing the last child of the node', () => {

    it('should focus the last visible child node', () => {
      const node = generateMetaNodes(['Es', ['esf', 'es']])[0];
      const { focusLastChild } =
        useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
      focusLastChild();

      expect(node.childMetaModels[1].focusable).to.be.true;
    });

    it('should ignore non-expanded child nodes', () => {
      const node = generateMetaNodes(['Es', ['ecsf', 'eCs', 'ecs', ['ecs']]])[0];
      const { focusLastChild } =
        useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
      focusLastChild();

      expect(node.childMetaModels[2].focusable).to.be.true;
    });

    it('should focus the deepest last node', () => {
      const node = generateMetaNodes(['Es', ['ecsf', 'eCs', 'Ecs', ['ecs']]])[0];
      const { focusLastChild } =
        useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
      focusLastChild();

      expect(node.childMetaModels[2].childMetaModels[0].focusable).to.be.true;
    });
  });

  describe('when focusing the next node', () => {

    describe('and the last child node is focused', () => {

      it('should not change focusableness', () => {
        const node = generateMetaNodes(['Es', ['ecs', 'eCsf']])[0];
        const { focusNextNode } =
          useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
        focusNextNode(node.childMetaModels[1]);
        expect(node.childMetaModels[1].focusable).to.be.true;
      });
    });

    describe('and the current child node does not have any expanded children', () => {

      it('should set the next sibling node as focusable', () => {
        const node = generateMetaNodes(['Es', ['ecsf', ['ecs', 'ecs'], 'ecs']])[0];
        const { focusNextNode } =
          useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
        focusNextNode(node.childMetaModels[0]);
        expect(node.childMetaModels[1].focusable).to.be.true;
      });
    });

    describe('and the current child node has expanded children', () => {

      let node;

      beforeEach(() => {
        node = generateMetaNodes(['Es', ['Ecsf', ['ecs', 'ecs'], 'ecs']])[0];
      });

      it('should set the first expanded child node as focusable', () => {
        const { focusNextNode } =
          useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
        focusNextNode(node.childMetaModels[0]);
        expect(node.childMetaModels[0].childMetaModels[0].focusable).to.be.true;
      });

      describe('and the children are explicitly ignored', () => {

        it('sets the next sibling node as focusable', () => {
          const { focusNextNode } =
            useTreeViewNodeFocus(ref(node), ref(nodeElement), emit, isMountedRef);
          focusNextNode(node.childMetaModels[0], true);
          expect(node.childMetaModels[1].focusable).to.be.true;
        });
      });
    });
  });
});