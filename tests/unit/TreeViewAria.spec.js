import { expect } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import TreeView from '../../src/components/TreeView.vue';
import { generateNodes } from '../data/node-generator.js';

const localVue = createLocalVue();

const getDefaultPropsData = function () {
  return {
    initialModel: []
  }
};

function createWrapper(customPropsData, customAttrs) {
  return mount(TreeView, {
    sync: false,
    propsData: customPropsData || getDefaultPropsData(),
    localVue,
    attrs: customAttrs
  });
}

describe('TreeView.vue (ARIA)', () => {

  let wrapper = null;

  afterEach(() => {
    wrapper.vm.$destroy();
    wrapper = null;
  });

  describe('always', () => {

    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('has an ARIA role of tree', () => {
      expect(wrapper.vm.$el.attributes.role.value).to.equal('tree');
    });
  });

  describe('when calculating the ARIA key mappings', () => {

    describe('and no customizations are provided', () => {

      beforeEach(() => {
        wrapper = createWrapper();
      });

      it('has an ARIA key mapping', () => {
        const keyMap = wrapper.vm.ariaKeyMap;
        expect(keyMap).to.have.own.property('activateItem');
        expect(keyMap).to.have.own.property('selectItem');
        expect(keyMap).to.have.own.property('focusLastItem');
        expect(keyMap).to.have.own.property('focusFirstItem');
        expect(keyMap).to.have.own.property('collapseFocusedItem');
        expect(keyMap).to.have.own.property('expandFocusedItem');
        expect(keyMap).to.have.own.property('focusPreviousItem');
        expect(keyMap).to.have.own.property('focusNextItem');
        expect(keyMap).to.have.own.property('insertItem');
        expect(keyMap).to.have.own.property('deleteItem');
      });
    });

    describe('and customizations are provided', () => {

      const customKeyMap = {
        activateItem: [1],
        selectItem: [2],
        focusLastItem: [3],
        focusFirstItem: [4],
        collapseFocusedItem: [5],
        expandFocusedItem: [6],
        focusPreviousItem: [7],
        focusNextItem: [8],
        insertItem: [9],
        deleteItem: [10]
      };

      beforeEach(() => {
        wrapper = createWrapper({
          initialModel: [],
          customAriaKeyMap: customKeyMap
        });
      });

      it('uses the custom ARIA key mapping', () => {
        const keyMap = wrapper.vm.ariaKeyMap;
        expect(keyMap).to.deep.equal(customKeyMap);
      });
    });
  });

  describe('when created without a focusable node specified', () => {

    describe('and no selected nodes', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCs', ['eCs', 'ecs']], {}), selectionMode: 'multiple' });
      });

      it('should set the first node as focusable', () => {
        expect(wrapper.vm.model[0].focusable).to.be.true;
      });
    });

    describe('and selected nodes', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCs', ['eCS', 'ecs']], {}), selectionMode: 'multiple' });
      });

      it('should set the first selected node as focusable', () => {
        expect(wrapper.vm.model[1].children[0].focusable).to.be.true;
      });
    });
  });

  describe('when created with a focusable node specified', () => {

    describe('always', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCsf', ['eCsf', 'ecs']], {}), selectionMode: 'multiple' });
      });

      it('should keep that node as focusable', () => {
        expect(wrapper.vm.model[1].focusable).to.be.true;
      });

      it('should set focusble to false for any further nodes', () => {
        expect(wrapper.vm.model[1].children[0].focusable).to.be.false;
      });
    });

    describe('and with a selectionMode of selectionFollowsFocus', () => {

      describe('and a selectable focusable node', () => {

        beforeEach(() => {
          wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCsf'], {}), selectionMode: 'selectionFollowsFocus' });
        });

        it('should select the focused node', () => {
          expect(wrapper.vm.model[1].state.selected).to.be.true;
        });
      });

    });
  });

  describe('when handling a focus change', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs'], {}) });
      wrapper.vm.$_treeViewAria_handleFocusableChange(wrapper.vm.model[1]);
    });

    it('should remove focusable from the previous focusable node', () => {
      expect(wrapper.vm.model[0].focusable).to.be.false;
    });

    it('should set the new node as the current focusable node', () => {
      expect(wrapper.vm.focusableNodeModel).to.deep.equal(wrapper.vm.model[1]);
    });
  });

  describe('when focusing the first node', () => {

    beforeEach(() => {
      wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCsf'], {}) });
      wrapper.vm.$_treeViewAria_focusFirstNode();
    });

    it('should set the focusable attribute of the first node to true', () => {
      expect(wrapper.vm.model[0].focusable).to.be.true;
    });
  });

  describe('when focusing the last node', () => {

    it('should focus the last visible node', () => {
      wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs'], {}) });
      wrapper.vm.$_treeViewAria_focusLastNode();

      expect(wrapper.vm.model[1].focusable).to.be.true;
    });

    it('should ignore non-expanded child nodes', () => {
      wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs', 'ecs', ['ecs']], {}) });
      wrapper.vm.$_treeViewAria_focusLastNode();

      expect(wrapper.vm.model[2].focusable).to.be.true;
    });
  });

  describe('when a node is getting deleted', () => {

    describe('and the node is not the currently focusable node', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs', 'ecs'], {}) });
        wrapper.vm.$_treeViewAria_handleNodeDeletion(wrapper.vm.model[1]);
      });

      it('does not change the focusable node', () => {
        expect(wrapper.vm.model[0].focusable).to.be.true;
      });
    });

    describe('and the node is not the last node', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs', 'ecs'], {}) });
        wrapper.vm.$_treeViewAria_handleNodeDeletion(wrapper.vm.model[0]);
      });

      it('sets the next node as focusable', () => {
        expect(wrapper.vm.model[1].focusable).to.be.true;
      });
    });

    describe('and the node is the last node', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCs', 'ecsf'], {}) });
        wrapper.vm.$_treeViewAria_handleNodeDeletion(wrapper.vm.model[2]);
      });

      it('sets the previous node as focusable', () => {
        expect(wrapper.vm.model[1].focusable).to.be.true;
      });
    })
  });

  describe('when focusing the previous node', () => {

    describe('and the first node is focused', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecsf', 'eCs'], {}) });
        wrapper.vm.$_treeViewAria_handlePreviousFocus(wrapper.vm.model[0]);
      });

      it('does not change focusableness', () => {
        expect(wrapper.vm.model[0].focusable).to.be.true;
      });
    });

    describe('and the previous node does not have any expanded children', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecs', ['ecs', 'ecs'], 'ecsf'], {}) });
        wrapper.vm.$_treeViewAria_handlePreviousFocus(wrapper.vm.model[1]);
      });

      it('sets the previous node as focusable', () => {
        expect(wrapper.vm.model[0].focusable).to.be.true;
      });
    });

    describe('and the previous node has expanded children', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['Ecs', ['ecs', 'ecs'], 'ecsf'], {}) });
        wrapper.vm.$_treeViewAria_handlePreviousFocus(wrapper.vm.model[1]);
      });

      it('sets the last expanded previous node as focusable', () => {
        expect(wrapper.vm.model[0].children[1].focusable).to.be.true;
      });
    });
  });

  describe('when focusing the next node', () => {

    describe('and the last node is focused', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecs', 'eCsf'], {}) });
        wrapper.vm.$_treeViewAria_handleNextFocus(wrapper.vm.model[1]);
      });

      it('does not change focusableness', () => {
        expect(wrapper.vm.model[1].focusable).to.be.true;
      });
    });

    describe('and the current node does not have any expanded children', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['ecsf', ['ecs', 'ecs'], 'ecs'], {}) });
        wrapper.vm.$_treeViewAria_handleNextFocus(wrapper.vm.model[0]);
      });

      it('sets the next sibling node as focusable', () => {
        expect(wrapper.vm.model[1].focusable).to.be.true;
      });
    });

    describe('and the current node has expanded children', () => {

      beforeEach(() => {
        wrapper = createWrapper({ initialModel: generateNodes(['Ecsf', ['ecs', 'ecs'], 'ecs'], {}) });
      });

      it('sets the first expanded child node as focusable', () => {
        wrapper.vm.$_treeViewAria_handleNextFocus(wrapper.vm.model[0]);
        expect(wrapper.vm.model[0].children[0].focusable).to.be.true;
      });

      describe('and the children are explicitly ignored', () => {

        if ('sets the next sibling node as focusable', () => {
          wrapper.vm.$_treeViewAria_handleNextFocus(wrapper.vm.model[0], true);
          expect(wrapper.vm.model[1].focusable).to.be.true;
        });
      });
    });
  });

  describe('when selectionMode changes to selectionFollowsFocus', () => {

    beforeEach(async () => {
      wrapper = createWrapper({ initialModel: generateNodes(['Ecsf', ['ecS', 'ecs'], 'ecs'], {}), selectionMode: 'single' });
      wrapper.setProps({ selectionMode: 'selectionFollowsFocus' });
      //wrapper.vm.selectionMode = 'selectionFollowsFocus';
      await wrapper.vm.$nextTick();
    });

    it('should select the focused node', () => {
      expect(wrapper.vm.model[0].state.selected).to.be.true;
    });

    it('should deselect the previously selected node', () => {
      expect(wrapper.vm.model[0].children[0].state.selected).to.be.false;
    });
  });
});
