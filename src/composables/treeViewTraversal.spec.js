import { beforeEach, expect, describe, it } from 'vitest';
import { ref } from 'vue';
import { useTreeViewTraversal } from './treeViewTraversal.js';
import { generateNodes } from 'tests/data/node-generator.js';

describe('treeViewTraversal.js', () => {

  let nodes;

  beforeEach(() => {
    nodes = generateNodes(['e', ['e','e'], 'e']);
  });

  describe('when traversing the tree depth-first', () => {

    it('should process each node in depth-first order', () => {
      const { depthFirstTraverse } = useTreeViewTraversal(ref(nodes));
      let result = [];
      depthFirstTraverse((node) => {
        result.push(node.id);
      });

      expect(result.length).to.equal(4);
      expect(result[0]).to.equal('n0');
      expect(result[1]).to.equal('n0n0');
      expect(result[2]).to.equal('n0n1');
      expect(result[3]).to.equal('n2');
    });

    describe('and the callback returns false', () => {

      it('should short-circuit the traversal', () => {
        const { depthFirstTraverse } = useTreeViewTraversal(ref(nodes));
        let result = [];
        depthFirstTraverse((node) => {
          result.push(node.id);
          return false;
        });

        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('n0');
      });
    });
  });

  describe('when traversing the tree breadth-first', () => {

    it('should process each node in breadth-first order', () => {
      const { breadthFirstTraverse } = useTreeViewTraversal(ref(nodes));
      let result = [];
      breadthFirstTraverse((node) => {
        result.push(node.id);
      });

      expect(result.length).to.equal(4);
      expect(result[0]).to.equal('n0');
      expect(result[1]).to.equal('n2');
      expect(result[2]).to.equal('n0n0');
      expect(result[3]).to.equal('n0n1');
    });

    describe('and the callback returns false', () => {

      it('should short-circuit the traversal', () => {
        const { breadthFirstTraverse } = useTreeViewTraversal(ref(nodes));
        let result = [];
        breadthFirstTraverse((node) => {
          result.push(node.id);
          return false;
        });

        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('n0');
      });
    });
  });
});