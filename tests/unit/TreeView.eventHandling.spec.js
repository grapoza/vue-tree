import { expect, describe, it, beforeEach, afterEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TreeView from '../../src/components/TreeView.vue';
import TreeViewNode from '../../src/components/TreeViewNode.vue';
import { generateNodes } from '../data/node-generator.js';
import SelectionMode from '../../src/enums/selectionMode';

const getDefaultPropsData = function () {
  return { initialModel: [] }
};

function createWrapper(customPropsData, customAttrs) {
  return shallowMount(TreeView, {
    sync: false,
    props: customPropsData || getDefaultPropsData(),
    attrs: customAttrs
  });
}

describe('TreeView.vue (event handling)', () => {

  let wrapper = null;

  afterEach(() => {
    wrapper = null;
  });

  describe('when a node fires a treeNodeClick event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeClick');
    });

    it('should emit a treeNodeClick event', () => {
      expect(wrapper.emitted('treeNodeClick').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeDblclick event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeDblclick');
    });

    it('should emit a treeNodeDblclick event', () => {
      expect(wrapper.emitted('treeNodeDblclick').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeCheckboxChange event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeCheckboxChange');
    });

    it('should emit a treeNodeCheckboxChange event', () => {
      expect(wrapper.emitted('treeNodeCheckboxChange').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeChildCheckboxChange event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeChildCheckboxChange');
    });

    it('should emit a treeNodeChildCheckboxChange event', () => {
      expect(wrapper.emitted('treeNodeChildCheckboxChange').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeRadioChange event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeRadioChange');
    });

    it('should emit a treeNodeRadioChange event', () => {
      expect(wrapper.emitted('treeNodeRadioChange').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeExpandedChange event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeExpandedChange');
    });

    it('should emit a treeNodeExpandedChange event', () => {
      expect(wrapper.emitted('treeNodeExpandedChange').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeSelectedChange event', () => {

    describe('always', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['eS', 'es']), selectionMode: SelectionMode.Multiple });
        wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeSelectedChange', wrapper.vm.model[0]);
      });

      it('should emit a treeNodeSelectedChange event', () => {
        expect(wrapper.emitted('treeNodeSelectedChange').length).to.equal(1);
      });
    });

    describe('and the treeview has a selectionMode of `single`', () => {

      describe('and the target node is selected', () => {

        beforeEach(() => {
          wrapper = createWrapper({ initialModel: generateNodes(['eS', 'eS', 'es']), selectionMode: SelectionMode.Single });
          wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeSelectedChange', wrapper.vm.model[0]);
        });

        it('should deselect other selected nodes', () => {
          expect(wrapper.vm.model[1].treeNodeSpec.state.selected).to.be.false;
        });
      });

      describe('and the target node is not selected', () => {

        beforeEach(() => {
          wrapper = createWrapper({ initialModel: generateNodes(['es', 'eS', 'es']), selectionMode: SelectionMode.Single });
          wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeSelectedChange', wrapper.vm.model[0]);
        });

        it('should not deselect other selected nodes', () => {
          expect(wrapper.vm.model[1].treeNodeSpec.state.selected).to.be.true;
        });
      });
    });
  });

  describe('when a node fires a treeNodeAdd event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeAdd');
    });

    it('should emit a treeNodeAdd event', () => {
      expect(wrapper.emitted('treeNodeAdd').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeDelete event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeDelete', wrapper.vm.model[0]);
    });

    it('should emit a treeNodeDelete event', () => {
      expect(wrapper.emitted('treeNodeDelete').length).to.equal(1);
    });

    it('should delete the child node', () => {
      expect(wrapper.vm.model.length).to.equal(0);
    });
  });
});
