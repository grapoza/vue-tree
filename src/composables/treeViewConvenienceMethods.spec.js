import { expect, describe, it, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useTreeViewConvenienceMethods } from './treeViewConvenienceMethods.js';
import { generateNodes } from '../../tests/data/node-generator.js';
import SelectionMode from '../enums/selectionMode';

describe('treeViewConvenienceMethods.js', () => {

  describe('when getMatching() is called', () => {

    let getMatching;

    describe('and there are nodes present', () => {

      beforeEach(() => {
        ({ getMatching } = useTreeViewConvenienceMethods(ref(generateNodes(['es', 'ES', ['es', 'eS']])), ref({}), ref(SelectionMode.Multiple)));
      });

      it('should return nodes matched by the function argument', () => {
        let nodes = getMatching((nodeModel) =>
          nodeModel.treeNodeSpec.expandable
          && nodeModel.treeNodeSpec.state.expanded
          && nodeModel.treeNodeSpec.selectable
          && nodeModel.treeNodeSpec.state.selected);

        expect(nodes.length).to.equal(1);
      });
    });

    describe('and there are no nodes present', () => {

      beforeEach(() => {
        ({ getMatching } = useTreeViewConvenienceMethods(ref([]), ref({}), ref(SelectionMode.Single)));
      });

      it('should return an empty array', () => {
        let nodes = getMatching(() => true);
        expect(nodes.length).to.equal(0);
      });
    });

    describe('and maxMatches argument is provided (> 0)', () => {

      beforeEach(() => {
        ({ getMatching } = useTreeViewConvenienceMethods(ref(generateNodes(['es', 'ES', ['es', 'eS']])), ref({}), ref(SelectionMode.Multiple)));
      });

      it('should return up to maxMatches matches', () => {
        let nodes = getMatching(() => true, 2);
        expect(nodes.length).to.equal(2);
      });
    });
  });

  describe('when getCheckedCheckboxes() is called', () => {

    let getCheckedCheckboxes;

    beforeEach(() => {
      ({ getCheckedCheckboxes } = useTreeViewConvenienceMethods(ref(generateNodes(['ecs', 'eCs', ['eCs', 'ecs']])), ref({}), ref(SelectionMode.Single)));
    });

    it('should return checked checkbox nodes', () => {
      let nodes = getCheckedCheckboxes();
      expect(nodes.length).to.equal(2);
    });
  });

  describe('when getCheckedRadioButtons() is called', () => {

    let getCheckedRadioButtons;

    beforeEach(() => {
      let nodes = generateNodes(['ers', 'eRs', ['eRs', 'ers']]);
      let radioGroupValues = {};
      radioGroupValues[nodes[1].treeNodeSpec.input.name] = nodes[1].treeNodeSpec.input.value;
      radioGroupValues[nodes[1].children[0].treeNodeSpec.input.name] = nodes[1].children[0].treeNodeSpec.input.value;

      ({ getCheckedRadioButtons } = useTreeViewConvenienceMethods(ref(nodes), ref(radioGroupValues), ref(SelectionMode.Single)));
    });

    it('should return checked radiobutton nodes', () => {
      let nodes = getCheckedRadioButtons();
      expect(nodes.length).to.equal(2);
    });
  });

  describe('when findById() is called', () => {

    let findById;
    let targetNode;

    beforeEach(() => {
      let nodes = generateNodes(['es', 'eS', ['es', 'eS']]);
      ({ findById } = useTreeViewConvenienceMethods(ref(nodes), ref({}), ref(SelectionMode.Single)));
      targetNode = nodes[1].children[0];
    });

    it('should return the node with the given ID', () => {
      let node = findById(targetNode.id);
      expect(node.id).to.equal(targetNode.id);
    });
  });

  describe('when getSelected() is called', () => {

    let getSelected;

    describe('and selection mode is not None', () => {

      beforeEach(() => {
        ({ getSelected } = useTreeViewConvenienceMethods(ref(generateNodes(['es', 'eS', ['es', 'eS']])), ref({}), ref(SelectionMode.Multiple)));
      });

      it('should return selected nodes', () => {
        let nodes = getSelected();
        expect(nodes.length).to.equal(2);
      });
    });

    describe('and selection mode is None', () => {

      beforeEach(() => {
        ({ getSelected } = useTreeViewConvenienceMethods(ref(generateNodes(['es', 'eS', ['es', 'eS']])), ref({}), ref(SelectionMode.None)));
      });

      it('should return an empty array of nodes', () => {
        let nodes = getSelected();
        expect(nodes.length).to.equal(0);
      });
    });
  });

  describe('when removeById() is called', () => {

    let nodes;
    let removeById;

    beforeEach(() => {
      nodes = generateNodes(['es', 'es', ['es', 'es']]);
      ({ removeById } = useTreeViewConvenienceMethods(ref(nodes), ref({}), ref(SelectionMode.Single)));
    });

    it('should remove the node with the given ID', () => {
      removeById('n1n0');
      expect(nodes[1].children.length).to.equal(1);
    });

    it('should return the removed node', () => {
      let node = removeById('n1n0');
      expect(node.id).to.equal('n1n0');
    });

    describe('and the node is not found', () => {

      it('should return null', () => {
        expect(removeById('notfound')).to.be.null;
      });
    });
  });
});
