import { expect, describe, it, beforeEach, vi } from 'vitest';
import { ref } from 'vue';
import { useTreeViewSelection } from './treeViewSelection.js';
import { generateNodes } from '../../../tests/data/node-generator.js';
import SelectionMode from '../../enums/selectionMode.js';
import TreeEvent from '../../enums/event.js';

describe('treeViewSelection.js', () => {

  let nodes;
  let emit;

  beforeEach(() => {
    emit = vi.fn();
  });

  describe('when selectionMode changes', () => {

    beforeEach(() => {
      nodes = generateNodes(['Sf', 'S']);
      const selectionMode = ref(SelectionMode.Multiple);
      const focusableNodeModel = ref(nodes[0]);
      useTreeViewSelection(ref(nodes), selectionMode, focusableNodeModel, emit);

      selectionMode.value = SelectionMode.Single;
    });

    it('should enforce the selection mode', () => {
      expect(nodes[0].treeNodeSpec.state.selected).to.be.true;
      expect(nodes[1].treeNodeSpec.state.selected).to.be.false;
    });
  });

  describe('when the focusable node changes', () => {

    describe('and the selection mode is not selectionFollowsFocus', () => {

      beforeEach(() => {
        nodes = generateNodes(['Sf', 's']);
        const selectionMode = ref(SelectionMode.Single);
        const focusableNodeModel = ref(nodes[0]);
        useTreeViewSelection(ref(nodes), selectionMode, focusableNodeModel, emit);

        focusableNodeModel.value = nodes[1];
      });

      it('should not deselect nodes that are not the newly focused node', () => {
        expect(nodes[0].treeNodeSpec.state.selected).to.be.true;
      });
    });

    describe('and the selection mode is selectionFollowsFocus', () => {

      beforeEach(() => {
        nodes = generateNodes(['Sf', 's']);
        const selectionMode = ref(SelectionMode.SelectionFollowsFocus);
        const focusableNodeModel = ref(nodes[0]);
        useTreeViewSelection(ref(nodes), selectionMode, focusableNodeModel, emit);

        focusableNodeModel.value = nodes[1];
      });

      it('should deselect nodes that are not the newly focused node', () => {
        expect(nodes[0].treeNodeSpec.state.selected).to.be.false;
      });
    });
  });

  describe('when getting the aria-multiselectable value', () => {

    describe('and the selection mode is None', () => {

      it('should return null', () => {
        nodes = generateNodes(['sf']);
        const selectionMode = ref(SelectionMode.None);
        const focusableNodeModel = ref(nodes[0]);
        const { ariaMultiselectable } = useTreeViewSelection(ref(nodes), selectionMode, focusableNodeModel, emit);
        expect(ariaMultiselectable.value).to.be.null;
      });
    });

    describe('and the selection mode is not Multiple', () => {

      it('should return false', () => {
        nodes = generateNodes(['sf']);
        const selectionMode = ref(SelectionMode.Single);
        const focusableNodeModel = ref(nodes[0]);
        const { ariaMultiselectable } = useTreeViewSelection(ref(nodes), selectionMode, focusableNodeModel, emit);
        expect(ariaMultiselectable.value).to.be.false;
      });
    });

    describe('and the selection mode is Multiple', () => {

      it('should return true', () => {
        nodes = generateNodes(['sf']);
        const selectionMode = ref(SelectionMode.Multiple);
        const focusableNodeModel = ref(nodes[0]);
        const { ariaMultiselectable } = useTreeViewSelection(ref(nodes), selectionMode, focusableNodeModel, emit);
        expect(ariaMultiselectable.value).to.be.true;
      });
    });
  });

  describe('when enforcing the selection mode', () => {

    describe('and the selection mode is Single', () => {

      it('should deselect any nodes after the first (depth-first)', () => {
        nodes = generateNodes(['sf', ['S'], 'S']);
        const selectionMode = ref(SelectionMode.Single);
        const focusableNodeModel = ref(nodes[0]);
        const { enforceSelectionMode } = useTreeViewSelection(ref(nodes), selectionMode, focusableNodeModel, emit);
        enforceSelectionMode();

        expect(nodes[0].treeNodeSpec.state.selected).to.be.false;
        expect(nodes[0].children[0].treeNodeSpec.state.selected).to.be.true;
        expect(nodes[1].treeNodeSpec.state.selected).to.be.false;
      });

      describe('and the nodes use a custom ID property', () => {

        it('should deselect any nodes after the first (depth-first)', () => {
          nodes = generateNodes(['sf', ['S'], 'S']);

          nodes[0].newid = nodes[0].id;
          nodes[0].treeNodeSpec.idProperty = 'newid';
          delete nodes[0].id;
          nodes[0].children[0].newid = nodes[0].children[0].id;
          nodes[0].children[0].treeNodeSpec.idProperty = 'newid';
          delete nodes[0].children[0].id;
          nodes[1].newid = nodes[1].id;
          nodes[1].treeNodeSpec.idProperty = 'newid';
          delete nodes[1].id;

          const selectionMode = ref(SelectionMode.Single);
          const focusableNodeModel = ref(nodes[0]);
          const { enforceSelectionMode } = useTreeViewSelection(ref(nodes), selectionMode, focusableNodeModel, emit);
          enforceSelectionMode();

          expect(nodes[0].treeNodeSpec.state.selected).to.be.false;
          expect(nodes[0].children[0].treeNodeSpec.state.selected).to.be.true;
          expect(nodes[1].treeNodeSpec.state.selected).to.be.false;
        });
      });
    });

    describe('and the selection mode is Selection Follows Focus', () => {

      it('should select only the focusable node', () => {
        nodes = generateNodes(['S', ['S'], 'sf', 'S']);
        const selectionMode = ref(SelectionMode.SelectionFollowsFocus);
        const focusableNodeModel = ref(nodes[1]);
        const { enforceSelectionMode } = useTreeViewSelection(ref(nodes), selectionMode, focusableNodeModel, emit);
        enforceSelectionMode();

        expect(nodes[0].treeNodeSpec.state.selected).to.be.false;
        expect(nodes[0].children[0].treeNodeSpec.state.selected).to.be.false;
        expect(nodes[1].treeNodeSpec.state.selected).to.be.true;
        expect(nodes[2].treeNodeSpec.state.selected).to.be.false;
      });
    });
  });

  describe('when handling node selected changes', () => {

    it('should emit the selected change event', () => {
      nodes = generateNodes(['Sf', 's']);
      const selectionMode = ref(SelectionMode.Single);
      const focusableNodeModel = ref(nodes[0]);
      const { handleNodeSelectedChange } = useTreeViewSelection(ref(nodes), selectionMode, focusableNodeModel, emit);
      nodes[0].treeNodeSpec.state.selected = false;
      handleNodeSelectedChange(nodes[0]);
      expect(emit).toHaveBeenCalledWith(TreeEvent.SelectedChange, nodes[0]);
    });

    describe('and the selection mode is Single and the node is selected', () => {

      it('should deselect any other nodes', () => {
        nodes = generateNodes(['Sf', 's']);
        const selectionMode = ref(SelectionMode.Single);
        const focusableNodeModel = ref(nodes[0]);
        const { handleNodeSelectedChange } = useTreeViewSelection(ref(nodes), selectionMode, focusableNodeModel, emit);
        nodes[1].treeNodeSpec.state.selected = true;
        handleNodeSelectedChange(nodes[1]);
        expect(nodes[0].treeNodeSpec.state.selected).to.be.false;
      });
    });
  });
});