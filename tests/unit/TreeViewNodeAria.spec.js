import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';
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
    initialModel: generateNodes(['cs'])[0],
    modelDefaults: {},
    depth: 0,
    treeId: 'tree-id',
    initialRadioGroupValues: {},
    isMounted: false
  }
};

async function createWrapper(customPropsData) {
  var wrapper = mount(TreeViewNode, {
    sync: false,
    props: customPropsData || getDefaultPropsData(),
    attachTo: '#root'
  });

  await wrapper.setProps({ isMounted: true });
  return wrapper;
}

async function triggerKeydown(wrapper, keyCode) {
  var e = new Event('keydown');
  e.keyCode = keyCode;

  vi.spyOn(e, 'stopPropagation');
  vi.spyOn(e, 'preventDefault');

  wrapper.vm.$refs.nodeElement.dispatchEvent(e);
  await wrapper.vm.$nextTick();
  return e;
}

describe('TreeViewNode.vue (ARIA)', () => {

  let wrapper = null;
  let root = null;

  beforeEach(() => {
    // Create an element to which the component will be mounted.
    root = document.createElement('div')
    root.id = "root";
    document.body.appendChild(root);
  });

  afterEach(() => {
    wrapper = null;
  });

  describe('always', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
    })

    it('should have an ARIA role of treeitem', () => {
      expect(wrapper.vm.$refs.nodeElement.attributes.role.value).to.equal('treeitem');
    });

    it('should have a tabindex of 0 if focusable', async () => {
      wrapper.vm.model.treeNodeSpec.focusable = true;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$refs.nodeElement.attributes.tabindex.value).to.equal('0');
    });

    it('should have a tabindex of -1 if not focusable', () => {
      expect(wrapper.vm.$refs.nodeElement.attributes.tabindex.value).to.equal('-1');
    });
  });

  describe('when there are child nodes', () => {

    beforeEach(async () => {
      let defaultProps = getDefaultPropsData();
      wrapper = await createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['es', ['es']])[0] }));
    });

    it('should have an ARIA role of group on the child list', () => {
      expect(wrapper.find('.grtvn-children').element.attributes.role.value).to.equal('group');
    });
  });

  describe('when not provided with a focusable property on the initial model data', () => {

    beforeEach(async () => {
      let initialModel = { id: 'my-node', label: 'My Node', expandable: true };

      wrapper = await createWrapper({
        ariaKeyMap: {},
        depth: 0,
        initialModel,
        modelDefaults: {},
        treeId: 'tree-id',
        initialRadioGroupValues: {},
        isMounted: false
      });
    });

    it('should have a boolean focusable property on the model', () => {
      expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.a('boolean');
    });
  });

  describe('when focusing via callback', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
      wrapper.vm.$_grtvnAria_focus();
      await wrapper.vm.$nextTick();
    });

    it('should have focusable set to true', () => {
      expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.true;
    });

    it('should focus the node', () => {
      expect(wrapper.vm.$refs.nodeElement).to.equal(document.activeElement);
    });

    it('should emit a treeViewNodeAriaFocusableChange event', () => {
      expect(wrapper.emitted().treeNodeAriaFocusableChange).to.be.an('array').that.has.length(1);
      expect(wrapper.emitted().treeNodeAriaFocusableChange[0][0]).to.equal(wrapper.vm.model);
    });
  });

  describe('when the node self is clicked', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
      wrapper.find('.grtvn-self').trigger('click');
      await wrapper.vm.$nextTick();
    });

    it('should have focusable set to true', () => {
      expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.true;
    });
  });

  describe('when selectionMode is not selectionFollowsFocus', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
      wrapper.find('.grtvn-self').trigger('click');
      await wrapper.vm.$nextTick();
    });

    it('should have state.selected set to true', () => {
      expect(wrapper.vm.model.treeNodeSpec.state.selected).to.be.false;
    });
  });

  describe('when selectionMode is selectionFollowsFocus', () => {

    beforeEach(async () => {
      wrapper = await createWrapper(Object.assign(getDefaultPropsData(), { selectionMode: SelectionMode.SelectionFollowsFocus }));
      wrapper.find('.grtvn-self').trigger('click');
      await wrapper.vm.$nextTick();
    });

    it('should have state.selected set to true', () => {
      expect(wrapper.vm.model.treeNodeSpec.state.selected).to.be.true;
    });
  });

  describe('when the node gets a keydown', () => {

    describe('and Shift is pressed', () => {

      beforeEach(async () => {
        wrapper = await createWrapper();
        var e = new Event('keydown');
        e.shift = true;
        e.keyCode = wrapper.vm.ariaKeyMap.focusPreviousItem[0];
        wrapper.vm.$refs.nodeElement.dispatchEvent(e);
        await wrapper.vm.$nextTick();
      });

      it('should ignore the keydown', () => {
        expect(wrapper.emitted().treeNodeAriaRequestPreviousFocus).not.to.exist;
      });
    });

    describe('and Alt is pressed', () => {

      beforeEach(async () => {
        wrapper = await createWrapper();
        var e = new Event('keydown');
        e.altKey = true;
        e.keyCode = wrapper.vm.ariaKeyMap.focusPreviousItem[0];
        wrapper.vm.$refs.nodeElement.dispatchEvent(e);
        await wrapper.vm.$nextTick();
      });

      it('should ignore the keydown', () => {
        expect(wrapper.emitted().treeNodeAriaRequestPreviousFocus).not.to.exist;
      });
    });

    describe('and Ctrl is pressed', () => {

      beforeEach(async () => {
        wrapper = await createWrapper();
        var e = new Event('keydown');
        e.ctrlKey = true;
        e.keyCode = wrapper.vm.ariaKeyMap.focusPreviousItem[0];
        wrapper.vm.$refs.nodeElement.dispatchEvent(e);
        await wrapper.vm.$nextTick();
      });

      it('should ignore the keydown', () => {
        expect(wrapper.emitted().treeNodeAriaRequestPreviousFocus).not.to.exist;
      });
    });

    describe('and the meta key is pressed', () => {

      beforeEach(async () => {
        wrapper = await createWrapper();
        var e = new Event('keydown');
        e.metaKey = true;
        e.keyCode = wrapper.vm.ariaKeyMap.focusPreviousItem[0];
        wrapper.vm.$refs.nodeElement.dispatchEvent(e);
        await wrapper.vm.$nextTick();
      });

      it('should ignore the keydown', () => {
        expect(wrapper.emitted().treeNodeAriaRequestPreviousFocus).not.to.exist;
      });
    });

    describe('and an activation key is pressed', () => {

      describe('and the node has an input', () => {

        describe('and the input is enabled', () => {

          const curWindow = window;

          beforeEach(async () => {
            wrapper = await createWrapper();
            window = null; // HACK TODO - Work around for what may be an webidl2js issue in JSDOM usage? Err: Failed to construct 'MouseEvent': member view is not of type Window.
            await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.activateItem[0]);
          });

          afterEach(() => {
            window = curWindow;
          });

          it('should perform the default action on the node', () => {
            expect(wrapper.find('input[type="checkbox"]').element.checked).to.be.true;
          });
        });

        describe('and the input is disabled', () => {

          beforeEach(async () => {
            wrapper = await createWrapper();
            wrapper.vm.model.treeNodeSpec.state.input.disabled = true;
            await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.activateItem[0]);
          });

          it('should perform no action on the node', () => {
            expect(wrapper.find('input[type="checkbox"]').element.checked).to.be.false;
          });
        });
      });

      describe('and the node does not have an input', () => {

        beforeEach(async () => {
          let defaultProps = getDefaultPropsData();
          wrapper = await createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['es'])[0] }));
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.activateItem[0]);
        });

        it('should not fire any custom events', () => {
          expect(Object.getOwnPropertyNames(wrapper.emitted()).length).to.equal(1);
          expect(Object.getOwnPropertyNames(wrapper.emitted())[0]).to.equal('keydown');
        });
      });
    });

    describe('and the selection key is pressed', () => {

      describe('and the selectionMode is null', () => {

        beforeEach(async () => {
          wrapper = await createWrapper();
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.selectItem[0]);
          await wrapper.vm.$nextTick();
        });

        it('should not toggle state.selected', () => {
          expect(wrapper.vm.model.treeNodeSpec.state.selected).to.be.false;
        });
      });

      describe('and the selectionMode is not null', () => {

        beforeEach(async () => {
          wrapper = await createWrapper();
          await wrapper.setProps({ selectionMode: SelectionMode.Multiple });
          await wrapper.vm.$nextTick();
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
            wrapper = await createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['esf', ['s', 's']])[0] }));
            await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.expandFocusedItem[0]);
          });

          it('should not expand the node', () => {
            expect(wrapper.emitted().treeNodeExpandedChange).to.be.an('array').that.has.length(1);
            expect(wrapper.vm.model.treeNodeSpec.state.expanded).to.be.true;
          });
        });

        describe('and the node is expanded', () => {

          beforeEach(async () => {
            let defaultProps = getDefaultPropsData();
            wrapper = await createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['Esf', ['s', 's']])[0] }));
            await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.expandFocusedItem[0]);
          });

          it('should focus the first child', () => {
            expect(wrapper.emitted().treeNodeAriaFocusableChange).to.be.an('array').that.has.length(1);
            expect(wrapper.vm.model.children[0].treeNodeSpec.focusable).to.be.true;
          });
        });
      });

      describe('and the node is not expandable', () => {

        beforeEach(async () => {
          let defaultProps = getDefaultPropsData();
          wrapper = await createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['sf', ['s', 's']])[0] }));
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.expandFocusedItem[0]);
        });

        it('should ignore the keydown', () => {
          expect(wrapper.emitted().treeNodeExpandedChange).not.to.exist;
        });
      });
    });

    describe('and a collapse focused item key is pressed', () => {

      describe('and the node is expandable', () => {

        describe('and the node is not expanded', () => {

          beforeEach(async () => {
            let defaultProps = getDefaultPropsData();
            wrapper = await createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['Es', ['esf', ['s']]])[0] }));
            await triggerKeydown(wrapper.findAllComponents(TreeViewNode)[0], wrapper.vm.ariaKeyMap.collapseFocusedItem[0]);
            await wrapper.vm.$nextTick();
          });

          it('should focus the parent node', async () => {
            expect(wrapper.findAllComponents(TreeViewNode)[0].emitted().treeNodeAriaRequestParentFocus).to.be.an('array').that.has.length(1);
            expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.true;
          });
        });

        describe('and the node is expanded', () => {

          beforeEach(async () => {
            let defaultProps = getDefaultPropsData();
            wrapper = await createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['Esf', ['es']])[0] }));
            await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.collapseFocusedItem[0]);
          });

          it('should collapse the node', () => {
            expect(wrapper.emitted().treeNodeExpandedChange).to.be.an('array').that.has.length(1);
            expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.true;
          });
        });
      });

      describe('and the node is not expandable', () => {

        beforeEach(async () => {
          let defaultProps = getDefaultPropsData();
          wrapper = await createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['Es', ['sf']])[0] }));
          await triggerKeydown(wrapper.findAllComponents(TreeViewNode)[0], wrapper.vm.ariaKeyMap.collapseFocusedItem[0]);
        });

        it('should focus the parent node', () => {
          expect(wrapper.findAllComponents(TreeViewNode)[0].emitted().treeNodeAriaRequestParentFocus).to.be.an('array').that.has.length(1);
          expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.true;
        });
      });
    });

    describe('and a focus first item key is pressed', () => {

      beforeEach(async () => {
        wrapper = await createWrapper();
        await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.focusFirstItem[0]);
      });

      it('should emit a treeViewNodeAriaRequestFirstFocus event', () => {
        expect(wrapper.emitted().treeNodeAriaRequestFirstFocus).to.be.an('array').that.has.length(1);
      });
    });

    describe('and a focus last item key is pressed', () => {

      beforeEach(async () => {
        wrapper = await createWrapper();
        await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.focusLastItem[0]);
      });

      it('should emit a treeViewNodeAriaRequestLastFocus event', () => {
        expect(wrapper.emitted().treeNodeAriaRequestLastFocus).to.be.an('array').that.has.length(1);
      });
    });

    describe('and a focus previous item key is pressed', () => {

      beforeEach(async () => {
        wrapper = await createWrapper();
        await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.focusPreviousItem[0]);
      });

      it('should emit a treeViewNodeAriaRequestPreviousFocus event', () => {
        expect(wrapper.emitted().treeNodeAriaRequestPreviousFocus).to.be.an('array').that.has.length(1);
      });
    });

    describe('and a focus next item key is pressed', () => {

      beforeEach(async () => {
        wrapper = await createWrapper();
        await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.focusNextItem[0]);
      });

      it('should emit a treeViewNodeAriaRequestNextFocus event', () => {
        expect(wrapper.emitted().treeNodeAriaRequestNextFocus).to.be.an('array').that.has.length(1);
      });
    });

    describe('and an insert item key is pressed', () => {

      describe('and there is no addChildCallback defined on the node', () => {

        beforeEach(async () => {
          wrapper = await createWrapper();
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.insertItem[0]);
        });

        it('should do nothing', () => {
          expect(wrapper.emitted().treeNodeAdd).not.to.exist;
        });
      });

      describe('and there is an addChildCallback defined on the node', () => {

        beforeEach(async () => {
          let defaultProps = getDefaultPropsData();
          let nodeAddCallback = function () { return Promise.resolve({ id: 100, label: 'labelText' }) };
          wrapper = await createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['sf'], "", nodeAddCallback)[0] }));
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.insertItem[0]);
        });

        it('should add a child to the current node', () => {
          expect(wrapper.emitted().treeNodeAdd).to.be.an('array').that.has.length(1);
          expect(wrapper.vm.model.children.length).to.equal(1);
        });
      });
    });

    describe('and a delete item key is pressed', () => {

      describe('and the node is not deletable', () => {

        beforeEach(async () => {
          wrapper = await createWrapper();
          await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.deleteItem[0]);
        });

        it('should do nothing', () => {
          expect(wrapper.emitted().treeNodeDelete).not.to.exist;
        });
      });

      describe('and the node is deletable', () => {

        describe('always', () => {

          beforeEach(async () => {
            let defaultProps = getDefaultPropsData();
            wrapper = await createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['Es', ['esdf']])[0] }));
            await triggerKeydown(wrapper.findAllComponents(TreeViewNode)[0], wrapper.vm.ariaKeyMap.deleteItem[0]);
          });

          it('should delete the current node', () => {
            // wrapper will emit the event as it bubbles up the tree; the child node
            // originated it, but is deleted by this point so we can't check it here.
            expect(wrapper.emitted().treeNodeDelete).to.be.an('array').that.has.length(1);
            expect(wrapper.vm.model.children.length).to.equal(0);
          });
        });

        describe('and the deleted node is the first of multiple siblings', () => {

          beforeEach(async () => {
            let defaultProps = getDefaultPropsData();
            wrapper = await createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['Es', ['esdf', 'es']])[0] }));
            await triggerKeydown(wrapper.findAllComponents(TreeViewNode)[0], wrapper.vm.ariaKeyMap.deleteItem[0]);
          });

          it('should focus the next node', () => {
            expect(wrapper.vm.model.children[0].treeNodeSpec.focusable).to.be.true;
          });
        });

        describe('and the deleted node is not the first of multiple siblings', () => {

          beforeEach(async () => {
            let defaultProps = getDefaultPropsData();
            wrapper = await createWrapper(Object.assign(defaultProps, { initialModel: generateNodes(['Es', ['es', 'es', 'esdf']])[0] }));
            await triggerKeydown(wrapper.findAllComponents(TreeViewNode)[2], wrapper.vm.ariaKeyMap.deleteItem[0]);
          });

          it('should focus the previous node', () => {
            expect(wrapper.vm.model.children[1].treeNodeSpec.focusable).to.be.true;
          });
        });
      });
    });

    describe('and an unhandled key is pressed', () => {

      let event;

      beforeEach(async () => {
        wrapper = await createWrapper();
        event = await triggerKeydown(wrapper, 1000);
      });

      it('should do nothing', () => {
        expect(Object.getOwnPropertyNames(wrapper.emitted()).length).to.equal(1);
        expect(Object.getOwnPropertyNames(wrapper.emitted())[0]).to.equal('keydown');
        expect(event.stopPropagation.mock.calls.length).to.equal(0);
        expect(event.preventDefault.mock.calls.length).to.equal(0);
      });
    });
  });

  describe('when setting focusable to the previous node from a child node', () => {

    let initialModel = null;
    let defaultProps = getDefaultPropsData();

    describe('and the currently focusable node is the first sibling', () => {

      beforeEach(async () => {
        initialModel = generateNodes(['Es', ['esf']])[0];
        wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
        wrapper.vm.$_grtvnAria_handlePreviousFocus(initialModel.children[0]);
        await wrapper.vm.$nextTick();
      });

      it('should set this node as focusable', () => {
        expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the previous sibling node is expanded', () => {

      beforeEach(async () => {
        initialModel = generateNodes(['Es', ['Es', ['s', 's'], 'sf']])[0];
        wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
        wrapper.vm.$_grtvnAria_handlePreviousFocus(initialModel.children[1]);
        await wrapper.vm.$nextTick();
      });

      it('should set the last child of the previous sibling node as focusable', () => {
        expect(wrapper.vm.model.children[0].children[1].treeNodeSpec.focusable).to.be.true;
      });
    });

    describe('and the previous sibling node is not expanded', () => {

      beforeEach(async () => {
        initialModel = generateNodes(['Es', ['es', ['s', 's'], 'sf']])[0];
        wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
        wrapper.vm.$_grtvnAria_handlePreviousFocus(initialModel.children[1]);
        await wrapper.vm.$nextTick();
      });

      it('should set the previous sibling node as focusable', () => {
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
          wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
          wrapper.vm.$_grtvnAria_handleNextFocus(initialModel.children[0], false);
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
            wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
            wrapper.vm.$_grtvnAria_handleNextFocus(initialModel.children[0], true);
            await wrapper.vm.$nextTick();
          });

          it('should set the next sibling as focusable', () => {
            expect(wrapper.vm.model.children[1].treeNodeSpec.focusable).to.be.true;
          });
        });

        describe('and it does not have a next sibling', () => {

          beforeEach(async () => {
            initialModel = generateNodes(['Es', ['Esf', ['s', 's']]])[0];
            wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
            wrapper.vm.$_grtvnAria_handleNextFocus(initialModel.children[0], true);
            await wrapper.vm.$nextTick();
          });

          it('should pass up the chain to this node\'s parent, ignoring children', () => {
            expect(wrapper.emitted().treeNodeAriaRequestNextFocus).to.be.an('array').that.has.length(1);
            expect(wrapper.emitted().treeNodeAriaRequestNextFocus[0][1]).to.be.true;
          });
        });
      });
    });

    describe('and the child is not expanded', () => {

      describe('and it has a next sibling', () => {

        beforeEach(async () => {
          initialModel = generateNodes(['Es', ['esf', ['s', 's'], 's']])[0];
          wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
          wrapper.vm.$_grtvnAria_handleNextFocus(initialModel.children[0], false);
          await wrapper.vm.$nextTick();
        });

        it('should set the next sibling as focusable', () => {
          expect(wrapper.vm.model.children[1].treeNodeSpec.focusable).to.be.true;
        });
      });

      describe('and it does not have a next sibling', () => {

        beforeEach(async () => {
          initialModel = generateNodes(['Es', ['esf', ['s', 's']]])[0];
          wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
          wrapper.vm.$_grtvnAria_handleNextFocus(initialModel.children[0], false);
          await wrapper.vm.$nextTick();
        });

        it('should pass up the chain to this node\'s parent, ignoring children', () => {
          expect(wrapper.emitted().treeNodeAriaRequestNextFocus).to.be.an('array').that.has.length(1);
          expect(wrapper.emitted().treeNodeAriaRequestNextFocus[0][1]).to.be.true;
        });
      });
    });
  });
});
