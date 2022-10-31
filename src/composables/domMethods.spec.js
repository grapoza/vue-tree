import { beforeEach, afterEach, expect, describe, it } from 'vitest';
import { useDomMethods } from './domMethods.js';

describe('domMethods.js', () => {

  describe('when finding the closest node', () => {

    let root = null;
    let subnode = null;

    beforeEach(async () => {
      root = document.createElement('div');
      root.id = "root";
      subnode = document.createElement('div');
      subnode.id = "subnode";
      subnode.appendChild(document.createTextNode("TEXT"));
      root.appendChild(subnode);
      document.body.appendChild(root);
    });

    afterEach(() => {
      document.body.removeChild(root);
    });

    it('should return the closest matching node', () => {
      const { closest } = useDomMethods();
      expect(closest(subnode, '#root')).to.equal(root);
    });

    it('should return null if a closest node is not found', () => {
      const { closest } = useDomMethods();
      expect(closest(subnode, '#unfound')).to.be.null;
    });

    describe('and the starting node is a text node', () => {

      it('should find the closest matching node from the parent', () => {
        const { closest } = useDomMethods();
        expect(closest(subnode.childNodes[0], '#root')).to.equal(root);
      });
    });
  });
});