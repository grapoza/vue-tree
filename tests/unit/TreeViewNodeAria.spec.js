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
    initialModel: generateNodes(['cs'])[0],
    modelDefaults: {},
    depth: 0,
    treeId: 'tree-id',
    initialRadioGroupValues: {}
  }
};

function createWrapper(customPropsData, slotsData) {
  return mount(TreeViewNode, {
    sync: false,
    propsData: customPropsData || getDefaultPropsData(),
    localVue,
    scopedSlots: slotsData,
    attachToDocument: true
  });
}

async function triggerKeydown(wrapper, keyCode) {
  var e = new Event('keydown');
  e.keyCode = keyCode;
  wrapper.vm.$el.dispatchEvent(e);
  await wrapper.vm.$nextTick();
}

describe('TreeViewNode.vue (ARIA)', () => {

  let wrapper = null;

  afterEach(() => {
    wrapper.vm.$destroy();
    wrapper = null;
  });

  describe('always', () => {

    beforeEach(() => {
      wrapper = createWrapper();
    })

    it('has an ARIA role of treeitem', () => {
      expect(wrapper.vm.$el.attributes.role.value).to.equal('treeitem');
    });

    it('has a tabindex of 0 if focusable', async () => {
      wrapper.vm.model.treeNodeSpec.focusable = true;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$el.attributes.tabindex.value).to.equal('0');
    });

    it('has a tabindex of -1 if not focusable', () => {
      expect(wrapper.vm.$el.attributes.tabindex.value).to.equal('-1');
    });

    describe('with child nodes', () => {

      beforeEach(async () => {
        let defaultProps = getDefaultPropsData();
        wrapper = createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['es', ['es']])[0] }));
      });

      it('has an ARIA role of group on the child list', () => {
        expect(wrapper.find('.tree-view-node-children').element.attributes.role.value).to.equal('group');
      });
    });
  });

  describe('when not provided with a focusable property on the initial model data', () => {

    beforeEach(() => {
      let initialModel = { id: 'my-node', label: 'My Node', expandable: true };

      wrapper = createWrapper({
        ariaKeyMap: {},
        depth: 0,
        initialModel,
        modelDefaults: {},
        initialRadioGroupValues: {}
      });
    });

    it('should have a boolean focusable property on the model', () => {
      expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.a('boolean');
    });
  });

  describe('when focusing via callback', () => {

    beforeEach(async () => {
      wrapper = createWrapper();
      wrapper.vm.$_treeViewNodeAria_focus();
      await wrapper.vm.$nextTick();
    });

    it('should have focusable set to true', () => {
      expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.true;
    });

    it('should focus the node', () => {

      expect(wrapper.vm.$el).to.equal(document.activeElement);
    });

    it('should emit a treeViewNodeAriaFocusable event', () => {
      expect(wrapper.emitted().treeViewNodeAriaFocusable).to.be.an('array').that.has.length(1);
      expect(wrapper.emitted().treeViewNodeAriaFocusable[0][0]).to.equal(wrapper.vm.model);
    });
  });

  describe('when the node self is clicked', () => {

    beforeEach(async () => {
      wrapper = createWrapper();
      wrapper.find('.tree-view-node-self').trigger('click');
      await wrapper.vm.$nextTick();
    });

    it('should have focusable set to true', () => {
      expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when selectionMode is not selectionFollowsFocus', () => {

    beforeEach(async () => {
      wrapper = createWrapper();
      wrapper.find('.tree-view-node-self').trigger('click');
      await wrapper.vm.$nextTick();
    });

    it('should have state.selected set to true', () => {
      expect(wrapper.vm.model.treeNodeSpec.state.selected).to.be.false;
    });
  });

  describe('when selectionMode is selectionFollowsFocus', () => {

    beforeEach(async () => {
      wrapper = createWrapper(Object.assign(getDefaultPropsData(), { selectionMode: 'selectionFollowsFocus' }));
      wrapper.find('.tree-view-node-self').trigger('click');
      await wrapper.vm.$nextTick();
    });

    it('should have state.selected set to true', () => {
      expect(wrapper.vm.model.treeNodeSpec.state.selected).to.be.true;
    });
  });

  describe('when the node gets a keydown', () => {

    describe('and Shift is pressed', () => {

      beforeEach(async () => {
        wrapper = createWrapper();
        var e = new Event('keydown');
        e.shift = true;
        e.keyCode = wrapper.vm.ariaKeyMap.focusPreviousItem[0];
        wrapper.vm.$el.dispatchEvent(e);
        await wrapper.vm.$nextTick();
      });

      it('ignores the keydown', () => {
        expect(wrapper.emitted().treeViewNodeAriaRequestPreviousFocus).not.to.exist;
      });
    });

    describe('and Alt is pressed', () => {

      beforeEach(async () => {
        wrapper = createWrapper();
        var e = new Event('keydown');
        e.altKey = true;
        e.keyCode = wrapper.vm.ariaKeyMap.focusPreviousItem[0];
        wrapper.vm.$el.dispatchEvent(e);
        await wrapper.vm.$nextTick();
      });

      it('ignores the keydown', () => {
        expect(wrapper.emitted().treeViewNodeAriaRequestPreviousFocus).not.to.exist;
      });
    });

    describe('and Ctrl is pressed', () => {

      beforeEach(async () => {
        wrapper = createWrapper();
        var e = new Event('keydown');
        e.ctrlKey = true;
        e.keyCode = wrapper.vm.ariaKeyMap.focusPreviousItem[0];
        wrapper.vm.$el.dispatchEvent(e);
        await wrapper.vm.$nextTick();
      });

      it('ignores the keydown', () => {
        expect(wrapper.emitted().treeViewNodeAriaRequestPreviousFocus).not.to.exist;
      });
    });

    describe('and the meta key is pressed', () => {

      beforeEach(async () => {
        wrapper = createWrapper();
        var e = new Event('keydown');
        e.metaKey = true;
        e.keyCode = wrapper.vm.ariaKeyMap.focusPreviousItem[0];
        wrapper.vm.$el.dispatchEvent(e);
        await wrapper.vm.$nextTick();
      });

      it('ignores the keydown', () => {
        expect(wrapper.emitted().treeViewNodeAriaRequestPreviousFocus).not.to.exist;
      });
    });

    describe('and an activation key is pressed', () => {

      describe('and the node has an input', () => {

        describe('and the input is enabled', () => {

          beforeEach(async () => {
            wrapper = createWrapper();
            await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.activateItem[0]);
          });

          it('performs the default action on the node', () => {
            expect(wrapper.find('input[type="checkbox"]').element.checked).to.be.true;
          });
        });

        describe('and the input is disabled', () => {

          beforeEach(async () => {
            wrapper = createWrapper();
            wrapper.vm.model.treeNodeSpec.state.input.disabled = true;
            await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.activateItem[0]);
          });

          it('performs no action on the node', () => {
            expect(wrapper.find('input[type="checkbox"]').element.checked).to.be.false;
          });
        });
      });

      describe('and the node does not have an input', () => {

        beforeEach(async () => {
          let defaultProps = getDefaultPropsData();
          wrapper = createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['es'])[0] }));
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.activateItem[0]);
        });

        it('no events are fired', () => {
          expect(wrapper.emitted()).to.deep.equal({});
        });
      });
    });

    describe('and the selection key is pressed', () => {

      describe('and the selectionMode is null', () => {

        beforeEach(async () => {
          wrapper = createWrapper();
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.selectItem[0]);
          await wrapper.vm.$nextTick();
        });

        it('should not toggle state.selected', () => {
          expect(wrapper.vm.model.treeNodeSpec.state.selected).to.be.false;
        });
      });

      describe('and the selectionMode is not null', () => {

        beforeEach(async () => {
          wrapper = createWrapper();
          wrapper.setProps({ selectionMode: 'multiple' });
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.selectItem[0]);
          await wrapper.vm.$nextTick();
        });

        it('should toggle state.selected', () => {
          expect(wrapper.vm.model.treeNodeSpec.state.selected).to.be.true;
        });
      });
    });

    describe('and an expand focused item key is pressed', () => {

      describe('and the node is expandable', () => {

        describe('and the node is not expanded', () => {

          beforeEach(async () => {
            let defaultProps = getDefaultPropsData();
            wrapper = createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['esf', ['s', 's']])[0] }));
            await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.expandFocusedItem[0]);
          });

          it('expands the node', () => {
            expect(wrapper.emitted().treeViewNodeExpandedChange).to.be.an('array').that.has.length(1);
            expect(wrapper.vm.model.treeNodeSpec.state.expanded).to.be.true;
          });
        });

        describe('and the node is expanded', () => {

          beforeEach(async () => {
            let defaultProps = getDefaultPropsData();
            wrapper = createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['Esf', ['s', 's']])[0] }));
            await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.expandFocusedItem[0]);
          });

          it('focuses the first child', () => {
            expect(wrapper.emitted().treeViewNodeAriaFocusable).to.be.an('array').that.has.length(1);
            expect(wrapper.vm.model.children[0].treeNodeSpec.focusable).to.be.true;
          });
        });
      });

      describe('and the node is not expandable', () => {

        beforeEach(async () => {
          let defaultProps = getDefaultPropsData();
          wrapper = createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['sf', ['s', 's']])[0] }));
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.expandFocusedItem[0]);
        });

        it('ignores the keydown', () => {
          expect(wrapper.emitted().treeViewNodeExpandedChange).not.to.exist;
        });
      });
    });

    describe('and a collapse focused item key is pressed', () => {

      describe('and the node is expandable', () => {

        describe('and the node is not expanded', () => {

          beforeEach(async () => {
            let defaultProps = getDefaultPropsData();
            wrapper = createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['Es', ['esf', ['s']]])[0] }));
            await triggerKeydown(wrapper.find('.tree-view-node-children').find(TreeViewNode), wrapper.vm.ariaKeyMap.collapseFocusedItem[0]);
          });

          it('focuses the parent node', () => {
            expect(wrapper.find('.tree-view-node-children').find(TreeViewNode).emitted().treeViewNodeAriaRequestParentFocus).to.be.an('array').that.has.length(1);
            expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.true;
          });
        });

        describe('and the node is expanded', () => {

          beforeEach(async () => {
            let defaultProps = getDefaultPropsData();
            wrapper = createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['Esf', ['es']])[0] }));
            await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.collapseFocusedItem[0]);
          });

          it('collapses the node', () => {
            expect(wrapper.emitted().treeViewNodeExpandedChange).to.be.an('array').that.has.length(1);
            expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.true;
          });
        });
      });

      describe('and the node is not expandable', () => {

        beforeEach(async () => {
          let defaultProps = getDefaultPropsData();
          wrapper = createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['Es', ['sf']])[0] }));
          await triggerKeydown(wrapper.find('.tree-view-node-children').find(TreeViewNode), wrapper.vm.ariaKeyMap.collapseFocusedItem[0]);
        });

        it('focuses the parent node', () => {
          expect(wrapper.find('.tree-view-node-children').find(TreeViewNode).emitted().treeViewNodeAriaRequestParentFocus).to.be.an('array').that.has.length(1);
          expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.true;
        });
      });
    });

    describe('and a focus first item key is pressed', () => {

      beforeEach(async () => {
        wrapper = createWrapper();
        await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.focusFirstItem[0]);
      });

      it('emits a treeViewNodeAriaRequestFirstFocus event', () => {
        expect(wrapper.emitted().treeViewNodeAriaRequestFirstFocus).to.be.an('array').that.has.length(1);
      });
    });

    describe('and a focus last item key is pressed', () => {

      beforeEach(async () => {
        wrapper = createWrapper();
        await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.focusLastItem[0]);
      });

      it('emits a treeViewNodeAriaRequestLastFocus event', () => {
        expect(wrapper.emitted().treeViewNodeAriaRequestLastFocus).to.be.an('array').that.has.length(1);
      });
    });

    describe('and a focus previous item key is pressed', () => {

      beforeEach(async () => {
        wrapper = createWrapper();
        await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.focusPreviousItem[0]);
      });

      it('emits a treeViewNodeAriaRequestPreviousFocus event', () => {
        expect(wrapper.emitted().treeViewNodeAriaRequestPreviousFocus).to.be.an('array').that.has.length(1);
      });
    });

    describe('and a focus next item key is pressed', () => {

      beforeEach(async () => {
        wrapper = createWrapper();
        await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.focusNextItem[0]);
      });

      it('emits a treeViewNodeAriaRequestNextFocus event', () => {
        expect(wrapper.emitted().treeViewNodeAriaRequestNextFocus).to.be.an('array').that.has.length(1);
      });
    });

    describe('and an insert item key is pressed', () => {

      describe('and there is no addChildCallback defined on the node', () => {

        beforeEach(async () => {
          wrapper = createWrapper();
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.insertItem[0]);
        });

        it('does nothing', () => {
          expect(wrapper.emitted().treeViewNodeAdd).not.to.exist;
        });
      });

      describe('and there is an addChildCallback defined on the node', () => {

        beforeEach(async () => {
          let defaultProps = getDefaultPropsData();
          let nodeAddCallback = function () { return Promise.resolve({ id: 100, label: 'labelText' }) };
          wrapper = createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['sf'], "", nodeAddCallback)[0] }));
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.insertItem[0]);
        });

        it('adds a child to the current node', () => {
          expect(wrapper.emitted().treeViewNodeAdd).to.be.an('array').that.has.length(1);
          expect(wrapper.vm.model.children.length).to.equal(1);
        });
      });
    });

    describe('and a delete item key is pressed', () => {

      describe('and the node is not deletable', () => {

        beforeEach(async () => {
          wrapper = createWrapper();
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.deleteItem[0]);
        });

        it('does nothing', () => {
          expect(wrapper.emitted().treeViewNodeDelete).not.to.exist;
        });
      });

      describe('and the node is deletable', () => {

        beforeEach(async () => {
          let defaultProps = getDefaultPropsData();
          wrapper = createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['Es', ['esdf']])[0] }));
          await triggerKeydown(wrapper.find('.tree-view-node-children').find(TreeViewNode), wrapper.vm.ariaKeyMap.deleteItem[0]);
        });

        it('deletes the current node', () => {
          // wrapper will emit the event as it bubbles up the tree; the child node
          // originated it, but is deleted by this point so we can't check it here.
          expect(wrapper.emitted().treeViewNodeDelete).to.be.an('array').that.has.length(1);
          expect(wrapper.vm.model.children.length).to.equal(0);
        });
      });
    });
  });

  describe('when setting focusable to the previous node from a child node', () => {

    let initialModel = null;
    let defaultProps = getDefaultPropsData();

    describe('and the currently focusable node is the first sibling', () => {

      beforeEach(async () => {
        initialModel = generateNodes(['Es', ['esf']])[0];
        wrapper = createWrapper(Object.assign(defaultProps, { initialModel }));
        wrapper.vm.$_treeViewNodeAria_handlePreviousFocus(initialModel.children[0]);
        await wrapper.vm.$nextTick();
      });

      it('should set this node as focusable', () => {
        expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the previous sibling node is expanded', () => {

      beforeEach(async () => {
        initialModel = generateNodes(['Es', ['Es', ['s', 's'], 'sf']])[0];
        wrapper = createWrapper(Object.assign(defaultProps, { initialModel }));
        wrapper.vm.$_treeViewNodeAria_handlePreviousFocus(initialModel.children[1]);
        await wrapper.vm.$nextTick();
      });

      it('sets the last child of the previous sibling node as focusable', () => {
        expect(wrapper.vm.model.children[0].children[1].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the previous sibling node is not expanded', () => {

      beforeEach(async () => {
        initialModel = generateNodes(['Es', ['es', ['s', 's'], 'sf']])[0];
        wrapper = createWrapper(Object.assign(defaultProps, { initialModel }));
        wrapper.vm.$_treeViewNodeAria_handlePreviousFocus(initialModel.children[1]);
        await wrapper.vm.$nextTick();
      });

      it('sets the previous sibling node as focusable', () => {
        expect(wrapper.vm.model.children[0].treeNodeSpec.focusable).to.be.true;
      });
    });
  });

  describe('when setting focusable to the next node from a child node', () => {

    let initialModel = null;
    let defaultProps = getDefaultPropsData();

    describe('and the child is expanded', () => {

      describe('and its children are not ignored', () => {

        beforeEach(async () => {
          initialModel = generateNodes(['Es', ['Esf', ['s', 's'], 's']])[0];
          wrapper = createWrapper(Object.assign(defaultProps, { initialModel }));
          wrapper.vm.$_treeViewNodeAria_handleNextFocus(initialModel.children[0], false);
          await wrapper.vm.$nextTick();
        });

        it('should set its first child as focusable', () => {
          expect(wrapper.vm.model.children[0].children[0].treeNodeSpec.focusable).to.be.true;
        });
      });

      describe('and its children are ignored', () => {

        describe('and it has a next sibling', () => {

          beforeEach(async () => {
            initialModel = generateNodes(['Es', ['Esf', ['s', 's'], 's']])[0];
            wrapper = createWrapper(Object.assign(defaultProps, { initialModel }));
            wrapper.vm.$_treeViewNodeAria_handleNextFocus(initialModel.children[0], true);
            await wrapper.vm.$nextTick();
          });

          it('should set the next sibling as focusable', () => {
            expect(wrapper.vm.model.children[1].treeNodeSpec.focusable).to.be.true;
          });
        });

        describe('and it does not have a next sibling', () => {

          beforeEach(async () => {
            initialModel = generateNodes(['Es', ['Esf', ['s', 's']]])[0];
            wrapper = createWrapper(Object.assign(defaultProps, { initialModel }));
            wrapper.vm.$_treeViewNodeAria_handleNextFocus(initialModel.children[0], true);
            await wrapper.vm.$nextTick();
          });

          it('should pass up the chain to this node\'s parent, ignoring children', () => {
            expect(wrapper.emitted().treeViewNodeAriaRequestNextFocus).to.be.an('array').that.has.length(1);
            expect(wrapper.emitted().treeViewNodeAriaRequestNextFocus[0][1]).to.be.true;
          });
        });
      });
    });

    describe('and the child is not expanded', () => {

      describe('and it has a next sibling', () => {

        beforeEach(async () => {
          initialModel = generateNodes(['Es', ['esf', ['s', 's'], 's']])[0];
          wrapper = createWrapper(Object.assign(defaultProps, { initialModel }));
          wrapper.vm.$_treeViewNodeAria_handleNextFocus(initialModel.children[0], false);
          await wrapper.vm.$nextTick();
        });

        it('should set the next sibling as focusable', () => {
          expect(wrapper.vm.model.children[1].treeNodeSpec.focusable).to.be.true;
        });
      });

      describe('and it does not have a next sibling', () => {

        beforeEach(async () => {
          initialModel = generateNodes(['Es', ['esf', ['s', 's']]])[0];
          wrapper = createWrapper(Object.assign(defaultProps, { initialModel }));
          wrapper.vm.$_treeViewNodeAria_handleNextFocus(initialModel.children[0], false);
          await wrapper.vm.$nextTick();
        });

        it('should pass up the chain to this node\'s parent, ignoring children', () => {
          expect(wrapper.emitted().treeViewNodeAriaRequestNextFocus).to.be.an('array').that.has.length(1);
          expect(wrapper.emitted().treeViewNodeAriaRequestNextFocus[0][1]).to.be.true;
        });
      });
    });
  });
});
