import { expect } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import TreeViewNode from '../../src/components/TreeViewNode.vue';
import { generateNodes } from '../data/node-generator.js';

const localVue = createLocalVue();

const getDefaultPropsData = function () {
  return {
    ariaKeyMap: {
      activateItem: [32], // Space
      selectItem: [13], // Enter
      focusLastItem: [35], // End
      focusFirstItem: [36], // Home
      collapseFocusedItem: [37], // Left
      expandFocusedItem: [39], // Right
      focusPreviousItem: [38], // Up
      focusNextItem: [40], // Down
      insertItem: [45], // Insert
      deleteItem: [46] // Delete
    },
    initialModel: generateNodes(['ces'])[0],
    modelDefaults: {},
    depth: 0,
    treeId: 'tree-id',
    initialRadioGroupValues: {},
    selectionMode: 'multiple'
  }
};

function createWrapper(customPropsData, slotsData) {
  return mount(TreeViewNode, {
    sync: false,
    propsData: customPropsData || getDefaultPropsData(),
    localVue,
    scopedSlots: slotsData
  });
}

describe('TreeViewNode.vue (interactions)', () => {

  let wrapper = null;

  afterEach(() => {
    wrapper.vm.$destroy();
    wrapper = null;
  });

  describe('when the node\'s body is clicked', () => {

    let nodeBody = null;

    describe('always', () => {

      beforeEach(() => {
        wrapper = createWrapper();
        nodeBody = wrapper.find(`#${wrapper.vm.nodeId} .tree-view-node-self`);
        nodeBody.trigger('click');
      });

      it('should emit the treeViewNodeClick event', () => {
        expect(wrapper.emitted().treeViewNodeClick.length).to.equal(1);
      });
    });

    describe('and the node is selectable', () => {

      beforeEach(() => {
        wrapper = createWrapper();
        nodeBody = wrapper.find(`#${wrapper.vm.nodeId} .tree-view-node-self`);
        nodeBody.trigger('click');
      });

      it('should toggle the selected state', () => {
        expect(wrapper.vm.model.treeNodeSpec.state.selected).to.be.true;
      });
    });

    describe('and the node is not selectable', () => {

      beforeEach(() => {
        wrapper = createWrapper(Object.assign(getDefaultPropsData(), { selectionMode: null }));
        nodeBody = wrapper.find(`#${wrapper.vm.nodeId} .tree-view-node-self`);
        nodeBody.trigger('click');
      });

      it('should not toggle the selected state', () => {
        expect(wrapper.vm.model.treeNodeSpec.state.selected).to.be.false;
      });
    });
  });

  describe('when the node\'s body is double clicked', () => {

    let nodeBody = null;

    beforeEach(() => {
      wrapper = createWrapper();
      nodeBody = wrapper.find(`#${wrapper.vm.nodeId} .tree-view-node-self`);
    });

    it('should emit the treeViewNodeDblclick event', () => {
      nodeBody.trigger('dblclick');
      expect(wrapper.emitted().treeViewNodeDblclick.length).to.equal(1);
    });
  });

  describe('when the node\'s expander is toggled', () => {

    let expander = null;

    beforeEach(() => {
      wrapper = createWrapper({
        ariaKeyMap: {},
        initialModel: generateNodes(['ces', ['ces']])[0],
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {}
      });

      expander = wrapper.find('#' + wrapper.vm.expanderId);
    });

    it('should toggle the expanded state', () => {
      expander.trigger('click');
      expect(wrapper.vm.model.treeNodeSpec.state.expanded).to.be.true;
    });

    it('should emit the treeViewNodeExpandedChange event', () => {
      expander.trigger('click');
      expect(wrapper.emitted().treeViewNodeExpandedChange.length).to.equal(1);
    });

    it('should not emit the treeViewNodeClick event', () => {
      expander.trigger('click');
      expect(wrapper.emitted().treeViewNodeClick).to.be.undefined;
    });

    it('should not emit the treeViewNodeDblclick event', () => {
      expander.trigger('dblclick');
      expect(wrapper.emitted().treeViewNodeDblclick).to.be.undefined;
    });
  });

  describe('when the node\'s checkbox is toggled', () => {

    let checkbox = null;

    beforeEach(() => {
      wrapper = createWrapper();
      checkbox = wrapper.find('#' + wrapper.vm.inputId);
    });

    it('should toggle the input value state', () => {
      checkbox.setChecked();
      expect(wrapper.vm.model.treeNodeSpec.state.input.value).to.be.true;
    });

    it('should emit the treeViewNodeCheckboxChange event', () => {
      checkbox.setChecked();
      expect(wrapper.emitted().treeViewNodeCheckboxChange.length).to.equal(1);
    });

    it('should not emit the treeViewNodeClick event', () => {
      checkbox.setChecked();
      expect(wrapper.emitted().treeViewNodeClick).to.be.undefined;
    });

    it('should not emit the treeViewNodeDblclick event', () => {
      checkbox.trigger('dblclick');
      expect(wrapper.emitted().treeViewNodeDblclick).to.be.undefined;
    });
  });

  describe('when the node\'s radiobutton is toggled', () => {

    let radioButton = null;

    beforeEach(() => {
      wrapper = createWrapper({
        ariaKeyMap: {},
        initialModel: generateNodes(['res'])[0],
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {}
      });

      radioButton = wrapper.find('#' + wrapper.vm.inputId);
    });

    it('should toggle the input value state', () => {
      radioButton.setChecked();
      let model = wrapper.vm.model;
      expect(wrapper.vm.radioGroupValues[model.treeNodeSpec.input.name]).to.equal(model.treeNodeSpec.input.value);
    });

    it('should emit the treeViewNodeRadioChange event', () => {
      radioButton.setChecked();
      expect(wrapper.emitted().treeViewNodeRadioChange.length).to.equal(1);
    });

    it('should not emit the treeViewNodeClick event', () => {
      radioButton.setChecked();
      expect(wrapper.emitted().treeViewNodeClick).to.be.undefined;
    });

    it('should not emit the treeViewNodeDblclick event', () => {
      radioButton.trigger('dblclick');
      expect(wrapper.emitted().treeViewNodeDblclick).to.be.undefined;
    });
  });

  describe('when a node\'s delete button is clicked', () => {

    let deleteButton = null;


    beforeEach(() => {
      wrapper = createWrapper({
        ariaKeyMap: {},
        initialModel: generateNodes(['es', ['ds']])[0],
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {}
      });

      deleteButton = wrapper.find('#' + wrapper.vm.$children[0].nodeId + '-delete');
    });

    it('should emit the treeViewNodeDelete event', () => {
      deleteButton.trigger('click');
      expect(wrapper.emitted().treeViewNodeDelete.length).to.equal(1);
    });

    it('should remove the target node from the model', () => {
      deleteButton.trigger('click');
      expect(wrapper.vm.model.children.length).to.equal(0);
    });
  });

  describe('when a node\'s add child button is clicked', () => {

    let addChildButton = null;

    describe('and the callback resolves to node data', () => {

      beforeEach(() => {
        let addChildCallback = () => {
          return Promise.resolve({ id: 'newId', label: 'new label' });
        };

        wrapper = createWrapper({
          ariaKeyMap: {},
          initialModel: generateNodes(['esa'], "", addChildCallback)[0],
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {}
        });

        addChildButton = wrapper.find('#' + wrapper.vm.nodeId + '-add-child');
      });

      it('should emit the treeViewNodeAdd event', async () => {
        addChildButton.trigger('click');

        await Promise.resolve(); // This just lets the callback resolve before the expect.

        expect(wrapper.emitted().treeViewNodeAdd.length).to.equal(1);
      });

      it('should add a subnode to the target node from the model', async () => {
        addChildButton.trigger('click');

        await Promise.resolve(); // This just lets the callback resolve before the expect.

        expect(wrapper.vm.model.children.length).to.equal(1);
      });
    });

    describe('and the callback does not resolve to node data', () => {

      beforeEach(() => {
        let addChildCallback = () => {
          return Promise.resolve(null);
        };

        wrapper = createWrapper({
          ariaKeyMap: {},
          initialModel: generateNodes(['esa'], "", addChildCallback)[0],
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {}
        });

        addChildButton = wrapper.find('#' + wrapper.vm.nodeId + '-add-child');
      });

      it('should not emit the treeViewNodeAdd event', async () => {
        addChildButton.trigger('click');

        await Promise.resolve(); // This just lets the callback resolve before the expect.

        expect(wrapper.emitted().treeViewNodeAdd).to.be.undefined;
      });

      it('should add a subnode to the target node from the model', async () => {
        addChildButton.trigger('click');

        await Promise.resolve(); // This just lets the callback resolve before the expect.

        expect(wrapper.vm.model.children.length).to.equal(0);
      });
    });
  });
});
