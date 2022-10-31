import { beforeEach, expect, describe, it, vi } from 'vitest';
import { ref } from 'vue';
import { useExpansion } from './expansion.js';
import { generateNodes } from '../../../tests/data/node-generator.js';

describe('expansion.js', () => {

  describe('when checking if the node is expandable', () => {

    describe('and the node is expandable', () => {

      it('should return true', () => {
        const node = ref(generateNodes(['es'])[0]);
        const { isExpandable } = useExpansion();
        expect(isExpandable(node)).to.be.true;
      });
    });

    describe('and the node is not expandable', () => {

      it('should return false', () => {
        const node = ref(generateNodes(['s'])[0]);
        const { isExpandable } = useExpansion();
        expect(isExpandable(node)).to.be.false;
      });
    });
  });

  describe('when checking if the node is expanded', () => {

    describe('and the node is expanded', () => {

      it('should return true', () => {
        const node = ref(generateNodes(['Es'])[0]);
        const { isExpanded } = useExpansion();
        expect(isExpanded(node)).to.be.true;
      });
    });

    describe('and the node is not expanded', () => {

      it('should return false', () => {
        const node = ref(generateNodes(['es'])[0]);
        const { isExpanded } = useExpansion();
        expect(isExpanded(node)).to.be.false;
      });
    });
  });
});