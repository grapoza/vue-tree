import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import TreeView from './TreeView.vue';
import TreeViewNode from './TreeViewNode.vue';
import { generateNodes } from '../../tests/data/node-generator.js';
import SelectionMode from '../enums/selectionMode';

async function createWrapper(customPropsData, customAttrs, slotsData) {
  let wrapper = mount(TreeView, {
    sync: false,
    props: customPropsData || { initialModel: [] },
    attrs: customAttrs,
    slots: slotsData
  });

  await flushPromises();

  return wrapper;
}

describe('TreeView.vue', () => {

  let wrapper = null;

  afterEach(() => {
    wrapper = null;
  });

  describe('always', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
    });

    it('should have a role of tree', () => {
      expect(wrapper.find('.grtv').element.attributes.role.value).to.equal('tree');
    });
  });

  describe('when on an element with an ID', () => {

    beforeEach(async () => {
      wrapper = await createWrapper(null, { id: 'my-id' });
    });

    it('should have a uniqueId of the root element ID', () => {
      expect(wrapper.vm.uniqueId).to.equal(wrapper.attributes('id'));
    });
  });

  describe('when on an element without an ID', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
    });

    it('should have an autogenerated uniqueId prefixed with grt-', () => {
      expect(wrapper.vm.uniqueId).to.be.a('string').and.match(/^grt-/i);
    });
  });

  describe('when not passed a skinClass prop', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
    });

    it('should have a class of grtv-default-skin', () => {
      expect(wrapper.vm.skinClass).to.equal('grtv-default-skin');
      let target = wrapper.find('.grtv-wrapper.grtv-default-skin');
      expect(target.exists()).to.be.true;
    });
  });

  describe('when passed a skinClass prop', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ skinClass: "my-skin" });
    });

    it('should have a class of my-skin', () => {
      expect(wrapper.vm.skinClass).to.equal('my-skin');
      let target = wrapper.find('.grtv-wrapper.my-skin');
      expect(target.exists()).to.be.true;
    });

    it('should not have a class of grtv-default-skin', () => {
      let target = wrapper.find('.grtv-wrapper.grtv-default-skin');
      expect(target.exists()).to.be.false;
    });
  });

  describe('when selectionMode is None', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.None });
    });

    it('should not have an aria-multiselectable attribute', () => {
      expect(wrapper.find('.grtv').element.attributes['aria-multiselectable']).to.be.undefined;
    });
  });

  describe('when selectionMode is `single`', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.Single });
    });

    it('should have an aria-multiselectable attribute of false', () => {
      expect(wrapper.find('.grtv').element.attributes['aria-multiselectable'].value).to.equal('false');
    });

    it('should only keep the selectable=true state for the first node with that in the initial model', () => {
      expect(wrapper.vm.model[1].treeNodeSpec.state.selected).to.be.true;
      expect(wrapper.vm.model[1].children[1].treeNodeSpec.state.selected).to.be.false;
    });
  });

  describe('when selectionMode is `selectionFollowsFocus`', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.SelectionFollowsFocus });
    });

    it('should have an aria-multiselectable attribute of false', () => {
      expect(wrapper.find('.grtv').element.attributes['aria-multiselectable'].value).to.equal('false');
    });
  });

  describe('when selectionMode is `multiple`', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es', 'eS', ['es', 'eS']]), selectionMode: SelectionMode.Multiple });
    });

    it('should have an aria-multiselectable attribute of true', () => {
      expect(wrapper.find('.grtv').element.attributes['aria-multiselectable'].value).to.equal('true');
    });
  });

  describe('when a function is passed for loadNodesAsync', () => {

    let loadNodesPromise = null;

    beforeEach(async () => {
      vi.useFakeTimers();
      loadNodesPromise = new Promise(resolve => setTimeout(resolve.bind(null, generateNodes(['', ''])), 1000));
      wrapper = await createWrapper({ loadNodesAsync: () => loadNodesPromise, selectionMode: SelectionMode.Single });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('and the loadNodesAsync Promise has not returned', () => {

      it('should display the loading placeholder', () => {
        expect(wrapper.find('.grtv-loading').exists()).to.be.true;
      });

      describe('and rendering a custom loader message', () => {

        beforeEach(async () => {
          wrapper = await createWrapper(
            {
              loadNodesAsync: () => loadNodesPromise
            },
            null,
            {
              'loading-root': '<span class="loading-slot-content">custom</span>',
            }
          );
        });

        it('should render the slot template', () => {
          expect(wrapper.find('.loading-slot-content').exists()).to.be.true;
        });
      });
    });

    describe('and the loadNodesAsync Promise returns', () => {

      beforeEach(async () => {
        vi.runAllTimers();
        await wrapper.vm.$nextTick();
      });

      it('should splice those nodes in as the model', () => {
        expect(wrapper.find('.grtv-loading').exists()).to.be.false;
        expect(wrapper.vm.model.length).to.equal(2);
      });

      it('should emit the treeRootNodesLoad event', () => {
        expect(wrapper.emitted().treeRootNodesLoad).to.be.an('array').that.has.length(1);
      });
    });
  });

  describe('when calculating the key mappings', () => {

    describe('and no customizations are provided', () => {

      beforeEach(async () => {
        wrapper = await createWrapper();
      });

      it('should have a key mapping', () => {
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

    describe('and valid customizations are provided', () => {

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

      beforeEach(async () => {
        wrapper = await createWrapper({
          initialModel: [],
          customAriaKeyMap: customKeyMap
        });
      });

      it('should use the custom key mapping', () => {
        const keyMap = wrapper.vm.ariaKeyMap;
        expect(keyMap).to.deep.equal(customKeyMap);
      });
    });

    describe('and invalid non-array customizations are provided', () => {

      const customKeyMap = {
        activateItem: 1
      };

      beforeEach(async () => {

        vi.spyOn(console, 'error').mockImplementation(() => { });
        // Suppress the [Vue warn] message from hitting test output when the validator fails
        console.warn = vi.fn();

        wrapper = await createWrapper({
          initialModel: [],
          customAriaKeyMap: customKeyMap
        });
      });

      it('should log an error', () => {
        expect(console.error.mock.calls[0][0])
          .to.equal('customAriaKeyMap properties must be Arrays of numbers (corresponding to keyCodes); property \'activateItem\' fails check.');
      });
    });
  });

  describe('when created without a focusable node specified', () => {

    describe('and no selected nodes', () => {

      beforeEach(async () => {
        wrapper = await createWrapper({ initialModel: generateNodes(['ecs', 'eCs', ['eCs', 'ecs']]), selectionMode: SelectionMode.Multiple });
      });

      it('should set the first node as focusable', () => {
        expect(wrapper.vm.model[0].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and selected nodes', () => {

      beforeEach(async () => {
        wrapper = await createWrapper({ initialModel: generateNodes(['ecs', 'eCs', ['eCS', 'ecs']]), selectionMode: SelectionMode.Multiple });
      });

      it('should set the first selected node as focusable', () => {
        expect(wrapper.vm.model[1].children[0].treeNodeSpec.focusable).to.be.true;
      });
    });
  });

  describe('when created with a focusable node specified', () => {

    describe('always', () => {

      beforeEach(async () => {
        wrapper = await createWrapper({ initialModel: generateNodes(['ecs', 'eCsf', ['eCsf', 'ecs']]), selectionMode: SelectionMode.Multiple });
      });

      it('should keep that node as focusable', () => {
        expect(wrapper.vm.model[1].treeNodeSpec.focusable).to.be.true;
      });

      it('should set focusble to false for any further nodes', () => {
        expect(wrapper.vm.model[1].children[0].treeNodeSpec.focusable).to.be.false;
      });
    });

    describe('and with a selectionMode of selectionFollowsFocus', () => {

      describe('and a selectable focusable node', () => {

        beforeEach(async () => {
          wrapper = await createWrapper({ initialModel: generateNodes(['ecs', 'eCsf']), selectionMode: SelectionMode.SelectionFollowsFocus });
        });

        it('should select the focused node', () => {
          expect(wrapper.vm.model[1].treeNodeSpec.state.selected).to.be.true;
        });
      });
    });
  });

  describe('when a node is getting deleted', () => {

    describe('and the node is not the currently focusable node', () => {

      beforeEach(async () => {
        wrapper = await createWrapper({ initialModel: generateNodes(['ecsf', 'eCs', 'ecs']) });
        wrapper.vm.handleNodeDeletion(wrapper.vm.model[1]);
      });

      it('should not change the focusable node', () => {
        expect(wrapper.vm.model[0].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the node is not the last node', () => {

      beforeEach(async () => {
        wrapper = await createWrapper({ initialModel: generateNodes(['ecsf', 'eCs', 'ecs']) });
        wrapper.vm.handleNodeDeletion(wrapper.vm.model[0]);
      });

      it('should set the next node as focusable', () => {
        expect(wrapper.vm.model[1].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the node is the last node', () => {

      beforeEach(async () => {
        wrapper = await createWrapper({ initialModel: generateNodes(['ecs', 'eCs', 'ecsf']) });
        wrapper.vm.handleNodeDeletion(wrapper.vm.model[2]);
      });

      it('should set the previous node as focusable', () => {
        expect(wrapper.vm.model[1].treeNodeSpec.focusable).to.be.true;
      });
    })
  });

  describe('when selectionMode is Single', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['ecS', 'ecs']), selectionMode: SelectionMode.Single });
    });

    describe('and a node is already selected', () => {

      describe('and a new node is selected', () => {

        beforeEach(async () => {
          wrapper.vm.model[1].treeNodeSpec.state.selected = true;
          await wrapper.vm.$nextTick();
        });

        it('should deselect the previously selected node', () => {
          expect(wrapper.vm.model[0].treeNodeSpec.state.selected).to.be.false;
        });
      });
    });
  });

  describe('when a node fires a treeNodeClick event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeClick');
    });

    it('should emit a treeNodeClick event', () => {
      expect(wrapper.emitted('treeNodeClick').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeDblclick event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeDblclick');
    });

    it('should emit a treeNodeDblclick event', () => {
      expect(wrapper.emitted('treeNodeDblclick').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeCheckboxChange event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeCheckboxChange');
    });

    it('should emit a treeNodeCheckboxChange event', () => {
      expect(wrapper.emitted('treeNodeCheckboxChange').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeChildCheckboxChange event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeChildCheckboxChange');
    });

    it('should emit a treeNodeChildCheckboxChange event', () => {
      expect(wrapper.emitted('treeNodeChildCheckboxChange').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeRadioChange event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeRadioChange');
    });

    it('should emit a treeNodeRadioChange event', () => {
      expect(wrapper.emitted('treeNodeRadioChange').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeExpandedChange event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeExpandedChange');
    });

    it('should emit a treeNodeExpandedChange event', () => {
      expect(wrapper.emitted('treeNodeExpandedChange').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeChildrenLoad event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeChildrenLoad');
    });

    it('should emit a treeNodeChildrenLoad event', () => {
      expect(wrapper.emitted('treeNodeChildrenLoad').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeSelectedChange event', () => {

    describe('always', () => {

      beforeEach(async () => {
        wrapper = await createWrapper({ initialModel: generateNodes(['eS', 'es']), selectionMode: SelectionMode.Multiple });
        wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeSelectedChange', wrapper.vm.model[0]);
      });

      it('should emit a treeNodeSelectedChange event', () => {
        expect(wrapper.emitted('treeNodeSelectedChange').length).to.equal(1);
      });
    });

    describe('and the treeview has a selectionMode of `single`', () => {

      describe('and the target node is selected', () => {

        beforeEach(async () => {
          wrapper = await createWrapper({ initialModel: generateNodes(['eS', 'eS', 'es']), selectionMode: SelectionMode.Single });
          wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeSelectedChange', wrapper.vm.model[0]);
        });

        it('should deselect other selected nodes', () => {
          expect(wrapper.vm.model[1].treeNodeSpec.state.selected).to.be.false;
        });
      });

      describe('and the target node is not selected', () => {

        beforeEach(async () => {
          wrapper = await createWrapper({ initialModel: generateNodes(['es', 'eS', 'es']), selectionMode: SelectionMode.Single });
          wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeSelectedChange', wrapper.vm.model[0]);
        });

        it('should not deselect other selected nodes', () => {
          expect(wrapper.vm.model[1].treeNodeSpec.state.selected).to.be.true;
        });
      });
    });
  });

  describe('when a node fires a treeNodeAdd event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeAdd');
    });

    it('should emit a treeNodeAdd event', () => {
      expect(wrapper.emitted('treeNodeAdd').length).to.equal(1);
    });
  });

  describe('when a node fires a treeNodeDelete event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeDelete', wrapper.vm.model[0]);
    });

    it('should emit a treeNodeDelete event', () => {
      expect(wrapper.emitted('treeNodeDelete').length).to.equal(1);
    });

    it('should delete the child node', () => {
      expect(wrapper.vm.model.length).to.equal(0);
    });
  });

  describe('when a node fires a treeNodeAriaFocusableChange event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeAriaFocusableChange', wrapper.vm.model[0]);
    });

    it('should call the focus update handler', () => {
      expect(wrapper.vm.model[0].treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when a node fires a treeNodeAriaRequestFirstFocus event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeAriaRequestFirstFocus');
    });

    it('should call the focus update handler', () => {
      expect(wrapper.vm.model[0].treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when a node fires a treeNodeAriaRequestLastFocus event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es', 'es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeAriaRequestLastFocus');
    });

    it('should call the focus update handler', () => {
      expect(wrapper.vm.model[1].treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when a node fires a treeNodeAriaRequestPreviousFocus event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['es', 'efs']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeAriaRequestPreviousFocus', wrapper.vm.model[1]);
    });

    it('should call the focus update handler', () => {
      expect(wrapper.vm.model[0].treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when a node fires a treeNodeAriaRequestNextFocus event', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({ initialModel: generateNodes(['efs', 'es']), selectionMode: SelectionMode.Multiple });
      wrapper.findComponent(TreeViewNode).vm.$emit('treeNodeAriaRequestNextFocus', wrapper.vm.model[0], true);
    });

    it('should call the focus update handler', () => {
      expect(wrapper.vm.model[1].treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when created with nodes that do not contain an explicit id property', () => {

    it('should fall back to the id property (note: this test is testing implementation [v-for iteration key for nodes] and not functionality)', async () => {
      const nodes = generateNodes(['es']);
      nodes[0].treeNodeSpec.idProperty = null;
      wrapper = await createWrapper({ initialModel: nodes, selectionMode: SelectionMode.Multiple });
      expect(wrapper.findComponent(TreeViewNode).exists()).to.be.true;
    });
  });
});
