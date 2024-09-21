import { useFocus } from './focus';
import { generateMetaNodes } from '../../../tests/data/node-generator';
import { TreeViewNodeMetaModel } from 'types/treeView';

const {
  focus,
  focusFirst,
  focusLast,
  focusNext,
  focusPrevious,
  isFocused,
  unfocus,
} = useFocus();

describe('focus', () => {

  describe('when focusing a node', () => {

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should set the node as focused', () => {
      const node = generateMetaNodes(['es'])[0];
      focus(node);
      vi.runAllTimers();
      expect(node.focusable).to.be.true;
    });
  });

  describe('when unfocusing a node', () => {

    it('should set the node as unfocused', () => {
      const node = generateMetaNodes(['esf'])[0];
      unfocus(node);
      expect(node.focusable).to.be.false;
    });
  });

  describe('when checking if a node is focused', () => {

    describe('and the node is focusable', () => {

      it('should return true', () => {
        const node = generateMetaNodes(['esf'])[0];
        expect(isFocused(node)).to.be.true;
      });
    });

    describe('and the node is not focusable', () => {

      it('should return false', () => {
        const node = generateMetaNodes(['es'])[0];
        expect(isFocused(node)).to.be.false;
      });
    });
  });

  describe('when focusing the first node', () => {

    let nodes: TreeViewNodeMetaModel[];

    beforeEach(() => {
      nodes = generateMetaNodes(['ecs', 'eCsf']);
      focusFirst(nodes);
      vi.runAllTimers();
    });

    it('should set the focusable attribute of the first node to true', () => {
      expect(nodes[0].focusable).to.be.true;
    });
  });

  describe('when focusing the last node', () => {

    it('should focus the last visible node', () => {
      const nodes = generateMetaNodes(['ecsf', 'eCs']);
      focusLast(nodes);
      vi.runAllTimers();
      expect(nodes[1].focusable).to.be.true;
    });

    it('should ignore non-expanded child nodes', () => {
      const nodes = generateMetaNodes(['ecsf', 'eCs', 'ecs', ['ecs']]);
      focusLast(nodes);
      vi.runAllTimers();
      expect(nodes[2].focusable).to.be.true;
    });

    it('should focus the deepest last node', () => {
      const nodes = generateMetaNodes(['ecsf', 'eCs', 'Ecs', ['ecs']]);
      focusLast(nodes);
      vi.runAllTimers();
      expect(nodes[2].childMetaModels[0].focusable).to.be.true;
    });
  });

  describe('when focusing the next node', () => {

    describe('and the last node is focused', () => {

      it('should not change focusableness', () => {
        const nodes = generateMetaNodes(['ecs', 'eCsf']);
        focusNext(nodes, nodes[1]);
        expect(nodes[1].focusable).to.be.true;
      });
    });

    describe('and the current node does not have any expanded children', () => {

      it('should set the next sibling node as focusable', () => {
        const nodes = generateMetaNodes(['ecsf', ['ecs', 'ecs'], 'ecs']);
        focusNext(nodes, nodes[0]);
        vi.runAllTimers();
        expect(nodes[1].focusable).to.be.true;
      });
    });

    describe('and the current node has expanded children', () => {

      let nodes: TreeViewNodeMetaModel[];

      beforeEach(() => {
        nodes = generateMetaNodes(['Ecsf', ['ecs', 'ecs'], 'ecs']);
      });

      it('should set the first expanded child node as focusable', () => {
        focusNext(nodes, nodes[0]);
        vi.runAllTimers();
        expect(nodes[0].childMetaModels[0].focusable).to.be.true;
      });

      describe('and the children are explicitly ignored', () => {

        it('sets the next sibling node as focusable', () => {
          focusNext(nodes, nodes[0], true);
          vi.runAllTimers();
          expect(nodes[1].focusable).to.be.true;
        });
      });
    });
  });

  describe('when focusing the previous node', () => {

    describe('and the first node is focused', () => {

      it('should not change focusableness', () => {
        const nodes = generateMetaNodes(['ecsf', 'eCs']);
        focusPrevious(nodes, nodes[0]);
        expect(nodes[0].focusable).to.be.true;
      });
    });

    describe('and the previous node does not have any expanded children', () => {

      it('should set the previous node as focusable', () => {
        const nodes = generateMetaNodes(['ecs', ['ecs', 'ecs'], 'ecsf']);
        focusPrevious(nodes, nodes[1]);
        vi.runAllTimers();
        expect(nodes[0].focusable).to.be.true;
      });
    });

    describe('and the previous node has expanded children', () => {

      it('should set the last expanded previous node as focusable', () => {
        const nodes = generateMetaNodes(['Ecs', ['ecs', 'ecs'], 'ecsf']);
        focusPrevious(nodes, nodes[1]);
        vi.runAllTimers();
        expect(nodes[0].childMetaModels[1].focusable).to.be.true;
      });
    });
  });
});