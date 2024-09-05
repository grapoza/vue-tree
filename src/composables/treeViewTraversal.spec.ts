import { ref } from 'vue';
import { useTreeViewTraversal } from './treeViewTraversal';
import { generateMetaNodes } from '../../tests/data/node-generator';
import { TreeViewNodeMetaModel } from 'types/treeView';

describe('treeViewTraversal', () => {

  let metaNodes: TreeViewNodeMetaModel[];

  beforeEach(() => {
    metaNodes = generateMetaNodes(['e', ['e','e'], 'e']);
  });

  describe('when traversing the tree depth-first', () => {

    it('should process each node in depth-first order', () => {
      const { depthFirstTraverse } = useTreeViewTraversal(ref(metaNodes));
      let result: TreeViewNodeMetaModel[] = [];
      depthFirstTraverse((node: TreeViewNodeMetaModel) => {
        result.push(node.data.id);
      });

      expect(result.length).to.equal(4);
      expect(result[0]).to.equal('n0');
      expect(result[1]).to.equal('n0n0');
      expect(result[2]).to.equal('n0n1');
      expect(result[3]).to.equal('n2');
    });

    describe('and the callback returns false', () => {

      it('should short-circuit the traversal', () => {
        const { depthFirstTraverse } = useTreeViewTraversal(ref(metaNodes));
        let result: TreeViewNodeMetaModel[] = [];
        depthFirstTraverse((node: TreeViewNodeMetaModel) => {
          result.push(node.data.id);
          return false;
        });

        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('n0');
      });
    });
  });

  describe('when traversing the tree breadth-first', () => {

    it('should process each node in breadth-first order', () => {
      const { breadthFirstTraverse } = useTreeViewTraversal(ref(metaNodes));
      let result: TreeViewNodeMetaModel[] = [];
      breadthFirstTraverse((node: TreeViewNodeMetaModel) => {
        result.push(node.data.id);
      });

      expect(result.length).to.equal(4);
      expect(result[0]).to.equal('n0');
      expect(result[1]).to.equal('n2');
      expect(result[2]).to.equal('n0n0');
      expect(result[3]).to.equal('n0n1');
    });

    describe('and the callback returns false', () => {

      it('should short-circuit the traversal', () => {
        const { breadthFirstTraverse } = useTreeViewTraversal(ref(metaNodes));
        let result: TreeViewNodeMetaModel[] = [];
        breadthFirstTraverse((node: TreeViewNodeMetaModel) => {
          result.push(node.data.id);
          return false;
        });

        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('n0');
      });
    });
  });
});