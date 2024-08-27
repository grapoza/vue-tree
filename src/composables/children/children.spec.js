import { expect, describe, it } from 'vitest';
import { useChildren } from './children.js';
import { generateMetaNodes } from '../../../tests/data/node-generator.js';

const { getChildren, getMetaChildren } = useChildren();

describe('children.js', () => {

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

    describe('and the node model does not have a specified childrenProperty', () => {

      it('should get the children from the children property', () => {
        const node = generateMetaNodes(['e', ['e', 'e']])[0];
        delete node.childrenProperty;
        const children = getChildren(node);
        expect(children.length).to.equal(node.data.children.length);
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