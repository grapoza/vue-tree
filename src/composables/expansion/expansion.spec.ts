import { ref } from 'vue';
import { useExpansion } from './expansion';
import { generateMetaNodes } from '../../../tests/data/node-generator';

describe('expansion', () => {

  describe('when checking if the node is expandable', () => {

    describe('and the node is expandable', () => {

      it('should return true', () => {
        const node = ref(generateMetaNodes(["es"])[0]);
        const { isExpandable } = useExpansion();
        expect(isExpandable(node)).to.be.true;
      });
    });

    describe('and the node is not expandable', () => {

      it('should return false', () => {
        const node = ref(generateMetaNodes(["s"])[0]);
        const { isExpandable } = useExpansion();
        expect(isExpandable(node)).to.be.false;
      });
    });
  });

  describe('when checking if the node is expanded', () => {

    describe('and the node is expanded', () => {

      it('should return true', () => {
        const node = ref(generateMetaNodes(["Es"])[0]);
        const { isExpanded } = useExpansion();
        expect(isExpanded(node)).to.be.true;
      });
    });

    describe('and the node is not expanded', () => {

      it('should return false', () => {
        const node = ref(generateMetaNodes(["es"])[0]);
        const { isExpanded } = useExpansion();
        expect(isExpanded(node)).to.be.false;
      });
    });
  });
});