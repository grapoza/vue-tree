import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import TreeView from '../../src/components/TreeView.vue';
import { generateNodes } from '../data/node-generator.js';
import SelectionMode from '../../src/enums/selectionMode';

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

describe('TreeView.vue', () => {

  let wrapper = null;

  afterEach(() => {
    wrapper.vm.$destroy();
    wrapper = null;
  });

  describe('when on an element with an ID', () => {

    beforeEach(() => {
      wrapper = createWrapper(null, { id: 'my-id' });
    });

    it('should have a uniqueId of the root element ID', () => {
      expect(wrapper.vm.uniqueId).to.equal(wrapper.attributes('id'));
    });
  });

  describe('when on an element without an ID', () => {

    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should have a null uniqueId', () => {
      expect(wrapper.vm.uniqueId).to.be.null;
    });
  });

  describe('when not passed a skinClass prop', () => {

    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should have a class of default-tree-view-skin', () => {
      expect(wrapper.vm.skinClass).to.equal('default-tree-view-skin');
      let target = wrapper.find('.tree-view.default-tree-view-skin');
      expect(target.exists()).to.be.true;
    });
  });

  describe('when passed a skinClass prop', () => {

    beforeEach(() => {
      wrapper = createWrapper(Object.assign(getDefaultPropsData(), { skinClass: "my-skin" }));
    });

    it('should have a class of my-skin', () => {
      expect(wrapper.vm.skinClass).to.equal('my-skin');
      let target = wrapper.find('.tree-view.my-skin');
      expect(target.exists()).to.be.true;
    });

    it('should not have a class of default-tree-view-skin', () => {
      let target = wrapper.find('.tree-view.default-tree-view-skin');
      expect(target.exists()).to.be.false;
    });
  });

  describe('when getCheckedCheckboxes() is called', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCs', ['eCs', 'ecs']]) });
    });

    it('should return checked checkbox nodes', () => {
      let nodes = wrapper.vm.getCheckedCheckboxes();
      expect(nodes.length).to.equal(2);
    });
  });

  describe('when getCheckedRadioButtons() is called', () => {

    beforeEach(() => {
      let nodes = generateNodes(['ers', 'eRs', ['eRs', 'ers']]);
      wrapper = createWrapper({ initialModel: nodes });

      // Fake the setup of the radio storage since we're shallow mounting
      wrapper.vm.$set(wrapper.vm, 'radioGroupValues', {});
      wrapper.vm.$set(wrapper.vm.radioGroupValues, nodes[1].treeNodeSpec.input.name, nodes[1].treeNodeSpec.input.value);
      wrapper.vm.$set(wrapper.vm.radioGroupValues, nodes[1].children[0].treeNodeSpec.input.name, nodes[1].children[0].treeNodeSpec.input.value);
    });

    it('should return checked radiobutton nodes', () => {
      let nodes = wrapper.vm.getCheckedRadioButtons();
      expect(nodes.length).to.equal(2);
    });
  });

  describe('when getMatching() is called', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es', 'ES', ['es', 'eS']]), selectionMode: SelectionMode.Multiple });
    });

    it('should return nodes matched by the function argument', () => {
      let nodes = wrapper.vm.getMatching((nodeModel) =>
        nodeModel.treeNodeSpec.expandable
        && nodeModel.treeNodeSpec.state.expanded
        && nodeModel.treeNodeSpec.selectable
        && nodeModel.treeNodeSpec.state.selected);

      expect(nodes.length).to.equal(1);
    });
  });

  describe('when getSelected() is called', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.Multiple });
    });

    it('should return selected nodes', () => {
      let nodes = wrapper.vm.getSelected();
      expect(nodes.length).to.equal(2);
    });
  });

  describe('when selectionMode is null', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.None });
    });

    it('should not have an aria-multiselectable attribute', () => {
      expect(wrapper.vm.$el.attributes['aria-multiselectable']).to.be.undefined;
    });

    it('should ignore the selected state of nodes', () => {
      let nodes = wrapper.vm.getSelected();
      expect(nodes.length).to.equal(0);
    });
  });

  describe('when selectionMode is `single`', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.Single });
    });

    it('should have an aria-multiselectable attribute of false', () => {
      expect(wrapper.vm.$el.attributes['aria-multiselectable'].value).to.equal('false');
    });

    it('should only keep the selectable=true state for the first node with that in the initial model', () => {
      expect(wrapper.vm.model[1].treeNodeSpec.state.selected).to.be.true;
      expect(wrapper.vm.model[1].children[1].treeNodeSpec.state.selected).to.be.false;
    });
  });

  describe('when selectionMode is `selectionFollowsFocus`', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.SelectionFollowsFocus });
    });

    it('should have an aria-multiselectable attribute of false', () => {
      expect(wrapper.vm.$el.attributes['aria-multiselectable'].value).to.equal('false');
    });
  });

  describe('when selectionMode is `multiple`', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.Multiple });
    });

    it('should have an aria-multiselectable attribute of true', () => {
      expect(wrapper.vm.$el.attributes['aria-multiselectable'].value).to.equal('true');
    });
  });
});
