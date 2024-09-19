import { ref } from 'vue';
import { useTreeViewConvenienceMethods } from './treeViewConvenienceMethods';
import { generateNodesAndMetaNodes, TestTreeViewNode } from '../../tests/data/node-generator';
import { SelectionMode } from '../types/selectionMode';
import { TreeViewNodeMetaModel } from 'types/treeView';

describe('treeViewConvenienceMethods', () => {

  describe('when getMatching() is called', () => {

    let getMatching: ReturnType<typeof useTreeViewConvenienceMethods>['getMatching'];

    describe('and there are nodes present', () => {

      beforeEach(() => {
        const { nodes, metaNodes } = generateNodesAndMetaNodes(['es', 'ES', ['es', 'eS']]);
        ({ getMatching } = useTreeViewConvenienceMethods(ref(nodes), ref(metaNodes), ref({}), ref(SelectionMode.Multiple)));
      });

      it('should return nodes matched by the function argument', () => {
        let nodes = getMatching((nodeModel) =>
          nodeModel.expandable
          && nodeModel.state.expanded
          && nodeModel.selectable
          && nodeModel.state.selected);

        expect(nodes.length).to.equal(1);
      });
    });

    describe('and there are no nodes present', () => {

      beforeEach(() => {
        const { nodes, metaNodes } = generateNodesAndMetaNodes([]);
        ({ getMatching } = useTreeViewConvenienceMethods(ref(nodes), ref(metaNodes), ref({}), ref(SelectionMode.Single)));
      });

      it('should return an empty array', () => {
        let nodes = getMatching(() => true);
        expect(nodes.length).to.equal(0);
      });
    });

    describe('and maxMatches argument is provided (> 0)', () => {

      beforeEach(() => {
        const { nodes, metaNodes } = generateNodesAndMetaNodes(['es', 'ES', ['es', 'eS']]);
        ({ getMatching } = useTreeViewConvenienceMethods(ref(nodes), ref(metaNodes), ref({}), ref(SelectionMode.Multiple)));
      });

      it('should return up to maxMatches matches', () => {
        let nodes = getMatching(() => true, 2);
        expect(nodes.length).to.equal(2);
      });
    });
  });

  describe('when getCheckedCheckboxes() is called', () => {

    let getCheckedCheckboxes: ReturnType<typeof useTreeViewConvenienceMethods>['getCheckedCheckboxes'];

    beforeEach(() => {
      const { nodes, metaNodes } = generateNodesAndMetaNodes(['ecs', 'eCs', ['eCs', 'ecs']]);
      ({ getCheckedCheckboxes } = useTreeViewConvenienceMethods(ref(nodes), ref(metaNodes), ref({}), ref(SelectionMode.Single)));
    });

    it('should return checked checkbox nodes', () => {
      let nodes = getCheckedCheckboxes();
      expect(nodes.length).to.equal(2);
    });
  });

  describe('when getCheckedRadioButtons() is called', () => {

    let getCheckedRadioButtons: ReturnType<typeof useTreeViewConvenienceMethods>['getCheckedRadioButtons'];

    beforeEach(() => {
      const { nodes, metaNodes } = generateNodesAndMetaNodes(['ers', 'eRs', ['eRs', 'ers']]);
      let radioGroupValues: { [key: string]: any } = {};
      radioGroupValues[metaNodes[1].input!.name!] = metaNodes[1].input!.value;
      radioGroupValues[metaNodes[1].childMetaModels[0].input!.name!] = metaNodes[1].childMetaModels[0].input!.value;

      ({ getCheckedRadioButtons } = useTreeViewConvenienceMethods(ref(nodes), ref(metaNodes), ref(radioGroupValues), ref(SelectionMode.Single)));
    });

    it('should return checked radiobutton nodes', () => {
      let nodes = getCheckedRadioButtons();
      expect(nodes.length).to.equal(2);
    });
  });

  describe('when findById() is called', () => {

    let findById: ReturnType<typeof useTreeViewConvenienceMethods>["findById"];
    let targetNode: TreeViewNodeMetaModel;

    beforeEach(() => {
      const { nodes, metaNodes } = generateNodesAndMetaNodes(['es', 'eS', ['es', 'eS']]);
      ({ findById } = useTreeViewConvenienceMethods(ref(nodes), ref(metaNodes), ref({}), ref(SelectionMode.Single)));
      targetNode = metaNodes[1].childMetaModels[0];
    });

    it('should return the node with the given ID', () => {
      let node = findById(targetNode.data.id)!;
      expect(node.data.id).to.equal(targetNode.data.id);
    });
  });

  describe('when getSelected() is called', () => {

    let getSelected: ReturnType<typeof useTreeViewConvenienceMethods>['getSelected'];

    describe('and selection mode is not None', () => {

      beforeEach(() => {
        const { nodes, metaNodes } = generateNodesAndMetaNodes(['es', 'eS', ['es', 'eS']]);
        ({ getSelected } = useTreeViewConvenienceMethods(ref(nodes), ref(metaNodes), ref({}), ref(SelectionMode.Multiple)));
      });

      it('should return selected nodes', () => {
        let nodes = getSelected();
        expect(nodes.length).to.equal(2);
      });
    });

    describe('and selection mode is None', () => {

      beforeEach(() => {
        const { nodes, metaNodes } = generateNodesAndMetaNodes(['es', 'eS', ['es', 'eS']]);
        ({ getSelected } = useTreeViewConvenienceMethods(ref(nodes), ref(metaNodes), ref({}), ref(SelectionMode.None)));
      });

      it('should return an empty array of nodes', () => {
        let nodes = getSelected();
        expect(nodes.length).to.equal(0);
      });
    });
  });

  describe('when removeById() is called', () => {

    let removeById: ReturnType<typeof useTreeViewConvenienceMethods>['removeById'];
    let nodeModels: TestTreeViewNode[];

    beforeEach(() => {
      const { nodes, metaNodes } = generateNodesAndMetaNodes(['es', 'es', ['es', 'es']]);
      nodeModels = nodes;
      ({ removeById } = useTreeViewConvenienceMethods(ref(nodes), ref(metaNodes), ref({}), ref(SelectionMode.Single)));
    });

    it('should remove the node with the given ID', () => {
      removeById('n1n0');
      expect(nodeModels[1].children.length).to.equal(1);
    });

    it('should return the removed node', () => {
      let node = removeById('n1n0') as TreeViewNodeMetaModel;
      expect(node.data.id).to.equal('n1n0');
    });

    describe('and the node is not found', () => {

      it('should return null', () => {
        expect(removeById('notfound')).to.be.null;
      });
    });
  });
});
