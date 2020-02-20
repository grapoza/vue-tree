import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import TreeView from '../../src/components/TreeView.vue';
import TreeViewNode from '../../src/components/TreeViewNode.vue';
import { generateNodes } from '../data/node-generator.js';

const localVue = createLocalVue();

const getDefaultPropsData = function () {
  return { initialModel: [] }
};

function createWrapper(customPropsData, customAttrs) {
  return shallowMount(TreeView, {
    sync: false,
    propsData: customPropsData || getDefaultPropsData(),
    localVue,
    attrs: customAttrs
  });
}

describe('TreeView.vue (event handling)', () => {

  let wrapper = null;

  afterEach(() => {
    wrapper.vm.$destroy();
    wrapper = null;
  });

  describe('when a node fires a treeViewNodeClick event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es'], {}), selectionMode: 'multiple' });
      wrapper.find(TreeViewNode).vm.$emit('treeViewNodeClick');
    });

    it('emits a treeViewNodeClick event', () => {
      expect(wrapper.emitted('treeViewNodeClick').length).to.equal(1);
    });
  });

  describe('when a node fires a treeViewNodeDblclick event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es'], {}), selectionMode: 'multiple' });
      wrapper.find(TreeViewNode).vm.$emit('treeViewNodeDblclick');
    });

    it('emits a treeViewNodeDblclick event', () => {
      expect(wrapper.emitted('treeViewNodeDblclick').length).to.equal(1);
    });
  });

  describe('when a node fires a treeViewNodeCheckboxChange event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es'], {}), selectionMode: 'multiple' });
      wrapper.find(TreeViewNode).vm.$emit('treeViewNodeCheckboxChange');
    });

    it('emits a treeViewNodeCheckboxChange event', () => {
      expect(wrapper.emitted('treeViewNodeCheckboxChange').length).to.equal(1);
    });
  });

  describe('when a node fires a treeViewNodeRadioChange event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es'], {}), selectionMode: 'multiple' });
      wrapper.find(TreeViewNode).vm.$emit('treeViewNodeRadioChange');
    });

    it('emits a treeViewNodeRadioChange event', () => {
      expect(wrapper.emitted('treeViewNodeRadioChange').length).to.equal(1);
    });
  });

  describe('when a node fires a treeViewNodeExpandedChange event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es'], {}), selectionMode: 'multiple' });
      wrapper.find(TreeViewNode).vm.$emit('treeViewNodeExpandedChange');
    });

    it('emits a treeViewNodeExpandedChange event', () => {
      expect(wrapper.emitted('treeViewNodeExpandedChange').length).to.equal(1);
    });
  });

  describe('when a node fires a treeViewNodeSelectedChange event', () => {

    describe('always', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['eS', 'es'], {}), selectionMode: 'multiple' });
        wrapper.find(TreeViewNode).vm.$emit('treeViewNodeSelectedChange', wrapper.vm.model[0]);
      });

      it('emits a treeViewNodeSelectedChange event', () => {
        expect(wrapper.emitted('treeViewNodeSelectedChange').length).to.equal(1);
      });
    });

    describe('and the treeview has a selectionMode of `single`', () => {

      describe('and the target node is selected', () => {

        beforeEach(() => {
          wrapper = createWrapper({ initialModel: generateNodes(['eS', 'eS', 'es'], {}), selectionMode: 'single' });
          wrapper.find(TreeViewNode).vm.$emit('treeViewNodeSelectedChange', wrapper.vm.model[0]);
        });

        it('deselects other selected nodes', () => {
          expect(wrapper.vm.model[1].treeNodeSpec.state.selected).to.be.false;
        });
      });

      describe('and the target node is not selected', () => {

        beforeEach(() => {
          wrapper = createWrapper({ initialModel: generateNodes(['es', 'eS', 'es'], {}), selectionMode: 'single' });
          wrapper.find(TreeViewNode).vm.$emit('treeViewNodeSelectedChange', wrapper.vm.model[0]);
        });

        it('does not deselect other selected nodes', () => {
          expect(wrapper.vm.model[1].treeNodeSpec.state.selected).to.be.true;
        });
      });
    });
  });

  describe('when a node fires a treeViewNodeAdd event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es'], {}), selectionMode: 'multiple' });
      wrapper.find(TreeViewNode).vm.$emit('treeViewNodeAdd');
    });

    it('emits a treeViewNodeAdd event', () => {
      expect(wrapper.emitted('treeViewNodeAdd').length).to.equal(1);
    });
  });

  describe('when a node fires a treeViewNodeDelete event', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es'], {}), selectionMode: 'multiple' });
      wrapper.find(TreeViewNode).vm.$emit('treeViewNodeDelete', wrapper.vm.model[0]);
    });

    it('emits a treeViewNodeDelete event', () => {
      expect(wrapper.emitted('treeViewNodeDelete').length).to.equal(1);
    });

    it('deletes the child node', () => {
      expect(wrapper.vm.model.length).to.equal(0);
    });
  });
});
