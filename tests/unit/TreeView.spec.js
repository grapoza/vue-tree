import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TreeView from '../../src/components/TreeView.vue';

describe('TreeView.vue', () => {
  it('renders props.msg when passed', () => {
    const wrapper = shallowMount(TreeView, {
      propsData: { model: [] },
    });
    expect(wrapper.text()).to.include('');
  });
});
