import { expect, describe, it, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useTreeViewConvenienceMethods } from './treeViewConvenienceMethods.js';
import { generateNodes } from '../../../tests/data/node-generator.js';
import SelectionMode from '../../enums/selectionMode';

describe('treeViewConvenienceMethods.js', () => {

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
});
