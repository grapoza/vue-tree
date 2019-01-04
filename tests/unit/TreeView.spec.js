import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import TreeView from '../../src/components/TreeView.vue';
import { generateNodes } from '../data/node-generator.js';

const localVue = createLocalVue();

const defaultPropsData = { model: [] };

function createWrapper(customPropsData, customAttrs) {
    return shallowMount(TreeView, {
      propsData: customPropsData || defaultPropsData,
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

    it('has a uniqueId of the root element ID', () => {
      expect(wrapper.vm.uniqueId).to.equal(wrapper.attributes('id'));
    });
  });

  describe('when on an element without an ID', () => {

    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('has a null uniqueId', () => {
      expect(wrapper.vm.uniqueId).to.be.null;
    });
  });

  describe('when getChecked() is called', () => {

    beforeEach(() => {
      wrapper = createWrapper({ model: generateNodes(['ecs', 'eCs', ['eCs', 'ecs']]) });
    });

    it('should return checked nodes', () => {
      let nodes = wrapper.vm.getChecked();
      expect(nodes.length).to.equal(2);
    });
  });
});
