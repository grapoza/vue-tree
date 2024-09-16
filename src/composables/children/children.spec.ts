import { useChildren } from './children';
import { generateMetaNodes } from '../../../tests/data/node-generator';

const { getChildren, getMetaChildren } = useChildren();

describe('children', () => {

  describe('when getting children', () => {

    describe('and the node model has a specified childrenProperty', () => {

      it('should get the children from that property', () => {
        const node = generateMetaNodes(['e', ['e', 'e']])[0];
        node.data.newChildrenProp = node.data.children;
        node.childrenProperty = 'newChildrenProp';
        delete node.data.children;

        const children = getChildren(node);
        expect(children.length).to.equal(2);
      });
    });

    describe('and the node does not have a prop for the specified childrenProperty', () => {

      it('should get an empty set of children', () => {
        const node = generateMetaNodes(['e', ['e', 'e']])[0];
        node.childrenProperty = 'asdf';
        const children = getChildren(node);
        expect(children.length).to.equal(0);
      });
    });
  });

  describe('when getting meta children', () => {

    it('should return the childMetaModels from the node', () => {
      const node = generateMetaNodes(['e', ['e', 'e']])[0];
      const metaChildren = getMetaChildren(node);
      expect(metaChildren.length).to.equal(2);
    });
  });
});