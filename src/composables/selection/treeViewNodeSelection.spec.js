import { expect, describe, it, beforeEach, vi } from 'vitest';
import { ref } from 'vue';
import { useTreeViewNodeSelection } from './treeViewNodeSelection.js';
import { generateMetaNodes } from '../../../tests/data/node-generator.js';
import SelectionMode from '../../enums/selectionMode.js';
import TreeEvent from '../../enums/event.js';

describe('useTreeViewNodeSelection.js', () => {

  let emit;

  beforeEach(() => {
    emit = vi.fn();
  });

  describe('when handling a selection change', () => {

    let node;

    beforeEach(() => {
      // Calling the use sets up the watcher
      node = ref(generateMetaNodes(['s'])[0]);
      useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
      node.value.state.selected = true;
    });

    it('should emit the selected change event', () => {
      expect(emit).toHaveBeenCalledWith(TreeEvent.SelectedChange, node.value);
    });
  });

  describe('when handling a focusable change', () => {

    let node;

    describe('and the selection mode is not selection follows focus', () => {

      beforeEach(() => {
        node = ref(generateMetaNodes(['s'])[0]);
        useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
        node.value.focusable = true;
      });

      it('should not change the selection state', () => {
        expect(node.value.state.selected).to.be.false;
      });
    });

    describe('and the node is not selectable', () => {

      beforeEach(() => {
        node = ref(generateMetaNodes([''])[0]);
        useTreeViewNodeSelection(node, ref(SelectionMode.SelectionFollowsFocus), emit);
        node.value.focusable = true;
      });

      it('should not change the selection state', () => {
        expect(node.value.state.selected).to.be.false;
      });
    });

    describe('and the node is selectable with a selection mode of selection follows focus', () => {

      beforeEach(() => {
        node = ref(generateMetaNodes(['s'])[0]);
        useTreeViewNodeSelection(node, ref(SelectionMode.SelectionFollowsFocus), emit);
        node.value.focusable = true;
      });

      it('should change the selection state', () => {
        expect(node.value.state.selected).to.be.true;
      });
    });
  });

  describe('when selecting the node', () => {

    it('should set the node as selected', () => {
      const node = ref(generateMetaNodes(['s'])[0]);
      const { selectNode } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
      selectNode();
      expect(node.value.state.selected).to.be.true;
    });
  });

  describe('when deselecting the node', () => {

    it('should set the node as deselected', () => {
      const node = ref(generateMetaNodes(['eS'])[0]);
      const { deselectNode } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
      deselectNode();
      expect(node.value.state.selected).to.be.false;
    });
  });

  describe('when setting the selected state', () => {

    describe('and the state is set to true', () => {

      it('should set the node as selected', () => {
        const node = ref(generateMetaNodes(['es'])[0]);
        const { setNodeSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
        setNodeSelected(true);
        expect(node.value.state.selected).to.be.true;
      });
    });

    describe('and the state is set to false', () => {

      it('should set the node as deselected', () => {
        const node = ref(generateMetaNodes(['eS'])[0]);
        const { setNodeSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
        setNodeSelected(false);
        expect(node.value.state.selected).to.be.false;
      });
    });
  });

  describe('when toggling the node selectedness', () => {

    describe('and the node is not selectable', () => {

      it('should not toggle selectedness', () => {
        const node = ref(generateMetaNodes(['e'])[0]);
        const { toggleNodeSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
        toggleNodeSelected();
        expect(node.value.state.selected).to.be.false;
      });
    });

    describe('and the selection mode is not Single or Multiple', () => {

      it('should not toggle selectedness', () => {
        const node = ref(generateMetaNodes(['es'])[0]);
        const { toggleNodeSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.SelectionFollowsFocus), emit);
        toggleNodeSelected();
        expect(node.value.state.selected).to.be.false;
      });
    });

    describe('and the node is selectable with a selection mode of Single', () => {

      it('should toggle selectedness', () => {
        const node = ref(generateMetaNodes(['es'])[0]);
        const { toggleNodeSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
        toggleNodeSelected();
        expect(node.value.state.selected).to.be.true;
      });
    });

    describe('and the node is selectable with a selection mode of Multiple', () => {

      it('should toggle selectedness', () => {
        const node = ref(generateMetaNodes(['es'])[0]);
        const { toggleNodeSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.Multiple), emit);
        toggleNodeSelected();
        expect(node.value.state.selected).to.be.true;
      });
    });
  });

  describe('when checking if the node is selectable', () => {

    describe('and the node is selectable', () => {

      it('should return true', () => {
        let node = ref(generateMetaNodes(['es'])[0]);
        const { isNodeSelectable } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
        expect(isNodeSelectable()).to.be.true;
      });
    });

    describe('and the node is not selectable', () => {

      it('should return false', () => {
        let node = ref(generateMetaNodes(['e'])[0]);
        const { isNodeSelectable } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
        expect(isNodeSelectable()).to.be.false;
      });
    });
  });

  describe('when checking if the node is selected', () => {

    describe('and the node is selected', () => {

      it('should return true', () => {
        let node = ref(generateMetaNodes(['eS'])[0]);
        const { isNodeSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
        expect(isNodeSelected()).to.be.true;
      });
    });

    describe('and the node is not selected', () => {

      it('should return false', () => {
        let node = ref(generateMetaNodes(['es'])[0]);
      const { isNodeSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
        expect(isNodeSelected()).to.be.false;
      });
    });
  });

  describe('when getting the aria-selected value', () => {

    describe('and the selection mode is None', () => {

      it('should return null', () => {
        let node = ref(generateMetaNodes(['es'])[0]);
        const { ariaSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.None), emit);
        expect(ariaSelected.value).to.be.null;
      });
    });

    describe('and the node is not selectable', () => {

      it('should return null', () => {
        let node = ref(generateMetaNodes(['e'])[0]);
        const { ariaSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
        expect(ariaSelected.value).to.be.null;
      });
    });

    describe('and selection mode is not Multiple', () => {

      describe('and the node is selected', () => {

        it('should return true', () => {
          let node = ref(generateMetaNodes(['eS'])[0]);
          const { ariaSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
          expect(ariaSelected.value).to.be.true;
        });
      });

      describe('and the node is not selected', () => {

        it('should return null', () => {
          let node = ref(generateMetaNodes(['es'])[0]);
          const { ariaSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.Single), emit);
          expect(ariaSelected.value).to.be.null;
        });
      });
    });

    describe('and selection mode is Multiple', () => {

      describe('and the node is selected', () => {

        it('should return true', () => {
          let node = ref(generateMetaNodes(['eS'])[0]);
          const { ariaSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.Multiple), emit);
          expect(ariaSelected.value).to.be.true;
        });
      });

      describe('and the node is not selected', () => {

        it('should return false', () => {
          let node = ref(generateMetaNodes(['es'])[0]);
          const { ariaSelected } = useTreeViewNodeSelection(node, ref(SelectionMode.Multiple), emit);
          expect(ariaSelected.value).to.be.false;
        });
      });
    });
  });
});