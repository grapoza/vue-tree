import { expect, describe, it } from 'vitest';
import { useChildren } from './children.js';
import { generateNodes } from 'tests/data/node-generator.js';

const { getChildren } = useChildren();

describe('children.js', () => {

  describe('when getting children', () => {

    describe('and the node model has a specified childrenProperty', () => {

      it('should get the children from that property', () => {
        const node = generateNodes(['e', ['e', 'e']])[0];
        node.newChildrenProp = node.children;
        node.treeNodeSpec.childrenProperty = 'newChildrenProp';
        delete node.children;

        const children = getChildren(node);
        expect(children.length).to.equal(2);
      });
    });

    describe('and the node model does not have a specified childrenProperty', () => {

      it('should get the children from the children property', () => {
        const node = generateNodes(['e', ['e', 'e']])[0];
        const children = getChildren(node);
        expect(children.length).to.equal(node.children.length);
      });
    });
  });
});