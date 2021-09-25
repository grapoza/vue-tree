import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import TreeViewNode from '../../src/components/TreeViewNode.vue';
import { generateNodes } from '../data/node-generator.js';
import SelectionMode from '../../src/enums/selectionMode';

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
    isMounted: false,
    selectionMode: SelectionMode.Multiple
  }
};

function createWrapper(customPropsData, slotsData) {
  return mount(TreeViewNode, {
    sync: false,
    props: customPropsData || getDefaultPropsData(),
    slots: slotsData
  });
}

describe('TreeViewNode.vue (interactions)', () => {

  let wrapper = null;

  afterEach(() => {
    wrapper = null;
  });

  describe('when the node\'s body is clicked', () => {

    let nodeBody = null;

    describe('always', () => {

      beforeEach(() => {
        wrapper = createWrapper();
        nodeBody = wrapper.find(`#${wrapper.vm.nodeId} .grtvn-self`);
        nodeBody.trigger('click');
      });

      it('should emit the treeNodeClick event', () => {
        expect(wrapper.emitted().treeNodeClick.length).to.equal(1);
      });
    });

    describe('and the node is selectable', () => {

      beforeEach(() => {
        wrapper = createWrapper();
        nodeBody = wrapper.find(`#${wrapper.vm.nodeId} .grtvn-self`);
        nodeBody.trigger('click');
      });

      it('should toggle the selected state', () => {
        expect(wrapper.vm.model.treeNodeSpec.state.selected).to.be.true;
      });
    });

    describe('and the node is not selectable', () => {

      beforeEach(() => {
        wrapper = createWrapper(Object.assign(getDefaultPropsData(), { selectionMode: SelectionMode.None }));
        nodeBody = wrapper.find(`#${wrapper.vm.nodeId} .grtvn-self`);
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
      nodeBody = wrapper.find(`#${wrapper.vm.nodeId} .grtvn-self`);
    });

    it('should emit the treeNodeDblclick event', () => {
      nodeBody.trigger('dblclick');
      expect(wrapper.emitted().treeNodeDblclick.length).to.equal(1);
    });
  });

  describe('when the node\'s expander is toggled', () => {

    let expander = null;

    describe('always', () => {

      beforeEach(() => {
        wrapper = createWrapper({
          ariaKeyMap: {},
          initialModel: generateNodes(['ces', ['ces']])[0],
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {},
          isMounted: false
        });

        expander = wrapper.find('#' + wrapper.vm.expanderId);
      });

      it('should toggle the expanded state', () => {
        expander.trigger('click');
        expect(wrapper.vm.model.treeNodeSpec.state.expanded).to.be.true;
      });

      it('should emit the treeNodeExpandedChange event', () => {
        expander.trigger('click');
        expect(wrapper.emitted().treeNodeExpandedChange.length).to.equal(1);
      });

      it('should not emit the treeNodeClick event', () => {
        expander.trigger('click');
        expect(wrapper.emitted().treeNodeClick).to.be.undefined;
      });

      it('should not emit the treeNodeDblclick event', () => {
        expander.trigger('dblclick');
        expect(wrapper.emitted().treeNodeDblclick).to.be.undefined;
      });
    });

    describe('and the children should be loaded asynchronously', () => {

      beforeEach(() => {
        jest.useFakeTimers();

        let loadChildrenAsync = () => new Promise(resolve => setTimeout(resolve.bind(null, generateNodes(['', ''])), 1000));
        let initialModel = generateNodes(['ces'], '', null, loadChildrenAsync)[0];

        wrapper = createWrapper({
          ariaKeyMap: {},
          initialModel,
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {},
          isMounted: false
        });

        expander = wrapper.find('#' + wrapper.vm.expanderId).trigger('click');
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      describe('and the the loadChildrenAsync Promise has not returned', () => {

        it('should show the loading area while children load', () => {
          expect(wrapper.find('.grtvn-loading').exists()).to.be.true;
        });
      });

      describe('and the loadChildrenAsync Promise returns', () => {

        beforeEach(async () => {
          jest.runAllTimers();
          await wrapper.vm.$nextTick();
        });

        it('should show the children', () => {
          expect(wrapper.find('.grtvn-loading').exists()).to.be.false;
          expect(wrapper.findAllComponents(TreeViewNode).length).to.equal(2);
        });

        it('should emit the treeNodeChildrenLoad event', () => {
          expect(wrapper.emitted().treeNodeChildrenLoad).to.be.an('array').that.has.length(1);
        });
      });
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

    it('should emit the treeNodeCheckboxChange event', () => {
      checkbox.setChecked();
      expect(wrapper.emitted().treeNodeCheckboxChange.length).to.equal(1);
    });

    it('should not emit the treeNodeClick event', () => {
      checkbox.setChecked();
      expect(wrapper.emitted().treeNodeClick).to.be.undefined;
    });

    it('should not emit the treeNodeDblclick event', () => {
      checkbox.trigger('dblclick');
      expect(wrapper.emitted().treeNodeDblclick).to.be.undefined;
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
        initialRadioGroupValues: {},
        isMounted: false
      });

      radioButton = wrapper.find('#' + wrapper.vm.inputId);
    });

    it('should toggle the input value state', () => {
      radioButton.setChecked();
      let model = wrapper.vm.model;
      expect(wrapper.vm.radioGroupValues[model.treeNodeSpec.input.name]).to.equal(model.treeNodeSpec.input.value);
    });

    it('should emit the treeNodeRadioChange event', () => {
      radioButton.setChecked();
      expect(wrapper.emitted().treeNodeRadioChange.length).to.equal(1);
    });

    it('should not emit the treeNodeClick event', () => {
      radioButton.setChecked();
      expect(wrapper.emitted().treeNodeClick).to.be.undefined;
    });

    it('should not emit the treeNodeDblclick event', () => {
      radioButton.trigger('dblclick');
      expect(wrapper.emitted().treeNodeDblclick).to.be.undefined;
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
        initialRadioGroupValues: {},
        isMounted: false
      });

      let childNode = wrapper.findAllComponents(TreeViewNode)[0];
      deleteButton = wrapper.find('#' + childNode.vm.nodeId + '-delete');
    });

    it('should emit the treeNodeDelete event', () => {
      deleteButton.trigger('click');
      expect(wrapper.emitted().treeNodeDelete.length).to.equal(1);
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
          initialRadioGroupValues: {},
          isMounted: false
        });

        addChildButton = wrapper.find('#' + wrapper.vm.nodeId + '-add-child');
      });

      it('should emit the treeNodeAdd event', async () => {
        addChildButton.trigger('click');

        await Promise.resolve(); // This just lets the callback resolve before the expect.

        expect(wrapper.emitted().treeNodeAdd.length).to.equal(1);
      });

      it('should pass the new node data to the treeNodeAdd event', async () => {
        addChildButton.trigger('click');

        await Promise.resolve(); // This just lets the callback resolve before the expect.

        expect(wrapper.emitted().treeNodeAdd[0][0].id).to.equal('newId');
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
          initialRadioGroupValues: {},
          isMounted: false
        });

        addChildButton = wrapper.find('#' + wrapper.vm.nodeId + '-add-child');
      });

      it('should not emit the treeNodeAdd event', async () => {
        addChildButton.trigger('click');

        await Promise.resolve(); // This just lets the callback resolve before the expect.

        expect(wrapper.emitted().treeNodeAdd).to.be.undefined;
      });

      it('should add a subnode to the target node from the model', async () => {
        addChildButton.trigger('click');

        await Promise.resolve(); // This just lets the callback resolve before the expect.

        expect(wrapper.vm.model.children.length).to.equal(0);
      });
    });
  });
});
