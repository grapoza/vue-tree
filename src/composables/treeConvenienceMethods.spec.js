import { expect, describe, it, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useTreeConvenienceMethods } from './treeConvenienceMethods.js';
import { generateNodes } from '../../tests/data/node-generator.js';
import SelectionMode from '../enums/selectionMode';

describe('treeViewConvenienceMethods.js', () => {

  describe('when getMatching() is called', () => {

    let getMatching;

    describe('and there are nodes present', () => {

      beforeEach(() => {
        ({ getMatching } = useTreeConvenienceMethods(ref(generateNodes(['es', 'ES', ['es', 'eS']]))));
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
        ({ getMatching } = useTreeConvenienceMethods(ref([])));
      });

      it('should return an empty array', () => {
        let nodes = getMatching(() => true);
        expect(nodes.length).to.equal(0);
      });
    });

    describe('and maxMatches argument is provided (> 0)', () => {

      beforeEach(() => {
        ({ getMatching } = useTreeConvenienceMethods(ref(generateNodes(['es', 'ES', ['es', 'eS']]))));
      });

      it('should return up to maxMatches matches', () => {
        let nodes = getMatching(() => true, 2);
        expect(nodes.length).to.equal(2);
      });
    });
  });

  describe('when findById() is called', () => {

    let findById;
    let targetNode;

    beforeEach(() => {
      let nodes = generateNodes(['es', 'eS', ['es', 'eS']]);
      ({ findById } = useTreeConvenienceMethods(ref(nodes)));
      targetNode = nodes[1].children[0];
    });

    it('should return the node with the given ID', () => {
      let node = findById(targetNode.id);
      expect(node.id).to.equal(targetNode.id);
    });
  });

  describe('when removeById() is called', () => {

    let nodes;
    let removeById;

    beforeEach(() => {
      nodes = generateNodes(['es', 'es', ['es', 'es']]);
      ({ removeById } = useTreeConvenienceMethods(ref(nodes)));
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
