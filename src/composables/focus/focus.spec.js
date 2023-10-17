import { expect, describe, it, beforeEach } from 'vitest';
import { useFocus } from './focus.js';
import { generateNodes } from '../../../tests/data/node-generator.js';

const {
  focus,
  focusFirst,
  focusLast,
  focusNext,
  focusPrevious,
  isFocused,
  unfocus,
} = useFocus();

describe('focus.js', () => {

  describe('when focusing a node', () => {

    it('should set the node as focused', () => {
      const node = generateNodes(['es'])[0];
      focus(node);
      expect(node.treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when unfocusing a node', () => {

    it('should set the node as unfocused', () => {
      const node = generateNodes(['esf'])[0];
      unfocus(node);
      expect(node.treeNodeSpec.focusable).to.be.false;
    });
  });

  describe('when checking if a node is focused', () => {

    describe('and the node is focusable', () => {

      it('should return true', () => {
        const node = generateNodes(['esf'])[0];
        expect(isFocused(node)).to.be.true;
      });
    });

    describe('and the node is not focusable', () => {

      it('should return false', () => {
        const node = generateNodes(['es'])[0];
        expect(isFocused(node)).to.be.false;
      });
    });
  });

  describe('when focusing the first node', () => {

    let nodes;

    beforeEach(() => {
      nodes = generateNodes(['ecs', 'eCsf']);
      focusFirst(nodes);
    });

    it('should set the focusable attribute of the first node to true', () => {
      expect(nodes[0].treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when focusing the last node', () => {

    it('should focus the last visible node', () => {
      const nodes = generateNodes(['ecsf', 'eCs']);
      focusLast(nodes);

      expect(nodes[1].treeNodeSpec.focusable).to.be.true;
    });

    it('should ignore non-expanded child nodes', () => {
      const nodes = generateNodes(['ecsf', 'eCs', 'ecs', ['ecs']]);
      focusLast(nodes);

      expect(nodes[2].treeNodeSpec.focusable).to.be.true;
    });

    it('should focus the deepest last node', () => {
      const nodes = generateNodes(['ecsf', 'eCs', 'Ecs', ['ecs']]);
      focusLast(nodes);

      expect(nodes[2].children[0].treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when focusing the next node', () => {

    describe('and the last node is focused', () => {

      it('should not change focusableness', () => {
        const nodes = generateNodes(['ecs', 'eCsf']);
        focusNext(nodes, nodes[1]);
        expect(nodes[1].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the current node does not have any expanded children', () => {

      it('should set the next sibling node as focusable', () => {
        const nodes = generateNodes(['ecsf', ['ecs', 'ecs'], 'ecs']);
        focusNext(nodes, nodes[0]);
        expect(nodes[1].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the current node has expanded children', () => {

      let nodes;

      beforeEach(() => {
        nodes = generateNodes(['Ecsf', ['ecs', 'ecs'], 'ecs']);
      });

      it('should set the first expanded child node as focusable', () => {
        focusNext(nodes, nodes[0]);
        expect(nodes[0].children[0].treeNodeSpec.focusable).to.be.true;
      });

      describe('and the children are explicitly ignored', () => {

        it('sets the next sibling node as focusable', () => {
          focusNext(nodes, nodes[0], true);
          expect(nodes[1].treeNodeSpec.focusable).to.be.true;
        });
      });
    });
  });

  describe('when focusing the previous node', () => {

    describe('and the first node is focused', () => {

      it('should not change focusableness', () => {
        const nodes = generateNodes(['ecsf', 'eCs']);
        focusPrevious(nodes, nodes[0]);
        expect(nodes[0].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the previous node does not have any expanded children', () => {

      it('should set the previous node as focusable', () => {
        const nodes = generateNodes(['ecs', ['ecs', 'ecs'], 'ecsf']);
        focusPrevious(nodes, nodes[1]);
        expect(nodes[0].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the previous node has expanded children', () => {

      it('should set the last expanded previous node as focusable', () => {
        const nodes = generateNodes(['Ecs', ['ecs', 'ecs'], 'ecsf']);
        focusPrevious(nodes, nodes[1]);
        expect(nodes[0].children[1].treeNodeSpec.focusable).to.be.true;
      });
    });
  });
});