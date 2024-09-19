import { useIdGeneration } from './idGeneration';
import { TreeViewNodeMetaModel } from 'types/treeView';
import { generateMetaNodes } from "../../tests/data/node-generator";

describe('idGeneration', () => {

  describe('when generating a unique ID', () => {

    it('should create a new 8+ character ID prefixed with grt-', () => {
      const { generateUniqueId } = useIdGeneration();
      const newId = generateUniqueId();
      expect(newId.length).to.equal(8);
      expect(newId.startsWith('grt-')).to.be.true;
    });
  });

  describe('when resolving node ID conflicts', () => {

    let root: Element | null = null;
    let node: TreeViewNodeMetaModel | null = null;

    beforeEach(async () => {
      root = document.createElement('div');
      root.id = 'tree-node1';
      document.body.appendChild(root);

      node = generateMetaNodes(['e', ['e']])[0];
      // {
      //   idProperty: "id",
      //   childrenProperty: "children",
      //   data: {
      //     id: "node2",
      //     children: [
      //       {
      //         id: "node3",
      //         children: [],
      //       },
      //     ],
      //   },
      //   childMetaModels: [{
      //     idProperty: "id",
      //     childrenProperty: "children",
      //     data: {
      //       id: "node3",
      //       children: [],
      //     },
      //     childMetaModels: [],
      //   }],
      // };
    });

    afterEach(() => {
      document.body.removeChild(root!);
    });

    describe('and no conflicts are found', () => {

      it('should do nothing', () => {
        const { resolveNodeIdConflicts } = useIdGeneration();
        resolveNodeIdConflicts(node!, 'tree');
        expect(node!.data.id).to.equal('n0');
        expect(node!.data.children[0].id).to.equal('n0n0');
      });
    });

    describe('and conflicts are found', () => {

      it('should update the conflicting id to a unique id', () => {
        node!.data.children[0].id = 'node1';
        node!.childMetaModels[0].data.id = 'node1';
        const { resolveNodeIdConflicts } = useIdGeneration();
        resolveNodeIdConflicts(node!, 'tree');
        expect(node!.data.id).to.equal('n0');
        expect(node!.data.children[0].id).to.equal('node1-1');
      });
    });
  });
});