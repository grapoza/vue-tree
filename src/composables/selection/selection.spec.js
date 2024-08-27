import { expect, describe, it } from 'vitest';
import { useSelection } from './selection.js';
import { generateMetaNodes } from '../../../tests/data/node-generator.js';

const {
  select,
  deselect,
  setSelected,
  isSelectable,
  isSelected } = useSelection();

describe('selection.js', () => {

  describe('when selecting a node', () => {

    it('should set the node as selected', () => {
      const node = generateMetaNodes(['es'])[0];
      select(node);
      expect(node.state.selected).to.be.true;
    });
  });

  describe('when deselecting a node', () => {

    it('should set the node as deselected', () => {
      const node = generateMetaNodes(['eS'])[0];
      deselect(node);
      expect(node.state.selected).to.be.false;
    });
  });

  describe('when setting the selected state', () => {

    describe('and the state is set to true', () => {

      it('should set the node as selected', () => {
        const node = generateMetaNodes(['es'])[0];
        setSelected(node, true);
        expect(node.state.selected).to.be.true;
      });
    });

    describe('and the state is set to false', () => {

      it('should set the node as deselected', () => {
        const node = generateMetaNodes(['eS'])[0];
        setSelected(node, false);
        expect(node.state.selected).to.be.false;
      });
    });
  });

  describe('when checking if a node is selectable', () => {

    describe('and the node is selectable', () => {

      it('should return true', () => {
        let node = generateMetaNodes(['es'])[0];
        expect(isSelectable(node)).to.be.true;
      });
    });

    describe('and the node is not selectable', () => {

      it('should return false', () => {
        let node = generateMetaNodes(['e'])[0];
        expect(isSelectable(node)).to.be.false;
      });
    });
  });

  describe('when checking if a node is selected', () => {

    describe('and the node is selected', () => {

      it('should return true', () => {
        let node = generateMetaNodes(['eS'])[0];
        expect(isSelected(node)).to.be.true;
      });
    });

    describe('and the node is not selected', () => {

      it('should return false', () => {
        let node = generateMetaNodes(['es'])[0];
        expect(isSelected(node)).to.be.false;
      });
    });
  });
});