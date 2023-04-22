import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import TreeViewNode from './TreeViewNode.vue';
import { generateNodes } from '../../tests/data/node-generator.js';
import SelectionMode from '../enums/selectionMode';
import TreeEvent from '../../src/enums/event.js';

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

async function createWrapper(customPropsData, slotsData) {
  var w = mount(TreeViewNode, {
    sync: false,
    props: customPropsData || getDefaultPropsData(),
    slots: slotsData,
    attachTo: '#root',
    global: {
      provide: {
        filterMethod: null
      }
    }
  });

  await w.setProps({ isMounted: true });

  return w;
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

describe('TreeViewNode.vue', () => {

  let wrapper = null;
  let root = null;

  beforeEach(async () => {
    // Create an element to which the component will be mounted.
    root = document.createElement('div');
    root.id = "root";
    document.body.appendChild(root);
  });

  afterEach(() => {
    wrapper = null;
    document.body.removeChild(root);
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

  describe('when given a title in the model data for a text node', () => {

    beforeEach(async () => {
      wrapper = await createWrapper({
        ariaKeyMap: {},
        depth: 0,
        initialModel: { id: 'my-node', label: 'My Node', treeNodeSpec: { title: 'My Title' } },
        modelDefaults: {},
        treeId: 'tree-id',
        initialRadioGroupValues: {},
        isMounted: false
      });
    });

    it('should have a title attribute on the node\'s text', () => {
      let elem = wrapper.find(`.grtvn-self-text`).element;
      expect(elem.getAttribute('title')).to.equal('My Title');
    });
  });

  describe('when given a title in the model data for an input node', () => {

    beforeEach(async () => {
      let data = getDefaultPropsData();
      data.initialModel.treeNodeSpec.title = 'My Title';

      wrapper = await createWrapper(data);
    });

    it('should have a title attribute on the node\'s label', () => {
      let elem = wrapper.find(`.grtvn-self-label`).element;
      expect(elem.getAttribute('title')).to.equal('My Title');
    });
  });

  describe('when generating element IDs', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
    });

    it('should have a nodeId made of the tree ID and the model[idPropName] property', () => {
      expect(wrapper.vm.nodeId).to.equal(wrapper.vm.treeId + '-' + wrapper.vm.model.id);
    });

    it('should have an expanderId made of the node ID and -exp', () => {
      expect(wrapper.vm.expanderId).to.equal(wrapper.vm.nodeId + '-exp');
    });

    describe('and the node has an input', () => {

      it('should have an inputId made of the node ID and -input', () => {
        expect(wrapper.vm.inputId).to.equal(wrapper.vm.nodeId + '-input');
      });
    });
  });

  describe('when there is not an addChildCallback method', () => {

    let addChildButton = null;

    beforeEach(async () => {
      wrapper = await createWrapper({
        ariaKeyMap: {},
        initialModel: generateNodes(['es'])[0],
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {},
        isMounted: false
      });

      addChildButton = wrapper.find('#' + wrapper.vm.nodeId + '-add-child');
    });

    it('should not include an add button', async () => {
      expect(addChildButton.exists()).to.be.false;
    });
  });

  describe('when there is an addChildCallback method in the model', () => {

    let addChildButton = null;

    beforeEach(async () => {
      let addChildCallback = () => {
        return Promise.resolve(null);
      };

      wrapper = await createWrapper({
        ariaKeyMap: {},
        initialModel: generateNodes(['esa'], '', addChildCallback)[0],
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {},
        isMounted: false
      });

      addChildButton = wrapper.find('#' + wrapper.vm.nodeId + '-add-child');
    });

    it('should include an add button', async () => {
      expect(addChildButton.exists()).to.be.true;
    });
  });

  describe('when there is an addChildCallback method in the model defaults', () => {

    let addChildButton = null;

    beforeEach(async () => {
      let addChildCallback = () => {
        return Promise.resolve(null);
      };

      wrapper = await createWrapper({
        ariaKeyMap: {},
        initialModel: generateNodes(['esa'])[0],
        modelDefaults: { addChildCallback },
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {},
        isMounted: false
      });

      addChildButton = wrapper.find('#' + wrapper.vm.nodeId + '-add-child');
    });

    it('should include an add button', async () => {
      expect(addChildButton.exists()).to.be.true;
    });
  });

  describe('when a node\'s model is disabled', () => {

    beforeEach(async () => {
      let initialModel = generateNodes(['ces!'])[0];

      wrapper = await createWrapper({
        ariaKeyMap: {},
        initialModel,
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {},
        isMounted: false
      });
    });

    it('should have a disabled input', () => {
      let input = wrapper.find('#' + wrapper.vm.inputId);
      expect(input.element.disabled).to.be.true;
    });
  });

  describe('when a node\'s model is not disabled', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
    });

    it('should have an enabled input', () => {
      let input = wrapper.find('#' + wrapper.vm.inputId);
      expect(input.element.disabled).to.be.false;
    });
  });

  describe('when a node\'s model is expandable', () => {

    describe('and the model has children', () => {

      beforeEach(async () => {

        let initialModel = generateNodes(['es', ['es']])[0];

        wrapper = await createWrapper({
          ariaKeyMap: {},
          initialModel,
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {},
          isMounted: false
        });
      });

      it('should have an expander', () => {
        let target = wrapper.find('.grtvn-self-expander');
        expect(target.exists()).to.be.true;
      });

      describe('and the model is not expanded', () => {

        it('should have an aria-expanded attribute set to false', () => {
          let target = wrapper.find('.grtvn[aria-expanded="false"]');
          expect(target.exists()).to.be.true;
        });

        it('should have an aria-hidden attribute set to true on the child list', () => {
          let target = wrapper.find('.grtvn-children[aria-hidden="true"]');
          expect(target.exists()).to.be.true;
        });

        it('should have an aria-expanded attribute value of false', () => {
          expect(wrapper.vm.$refs.nodeElement.attributes['aria-expanded'].value).to.equal('false');
        });
      });

      describe('and the model is expanded', () => {

        beforeEach(async () => {

          let initialModel = generateNodes(['Es', ['es']])[0];

          wrapper = await createWrapper({
            ariaKeyMap: {},
            initialModel,
            modelDefaults: {},
            depth: 0,
            treeId: 'tree',
            initialRadioGroupValues: {},
            isMounted: false
          });
        });

        it('should have an aria-expanded attribute set to true', () => {
          let target = wrapper.find('.grtvn[aria-expanded="true"]');
          expect(target.exists()).to.be.true;
        });

        it('should have an aria-hidden attribute set to false on the child list', () => {
          let target = wrapper.find('.grtvn-children[aria-hidden="false"]');
          expect(target.exists()).to.be.true;
        });

        it('should have an aria-expanded attribute value of true', () => {
          expect(wrapper.vm.$refs.nodeElement.attributes['aria-expanded'].value).to.equal('true');
        });
      });
    });

    describe('and the model does not have children', () => {

      beforeEach(async () => {

        let initialModel = generateNodes(['es'])[0];

        wrapper = await createWrapper({
          ariaKeyMap: {},
          initialModel,
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {},
          isMounted: false
        });
      });

      it('should not have an expander', () => {
        let target = wrapper.find('.grtvn-self-expander');
        expect(target.exists()).to.be.false;
      });
    });
  });

  describe('when a node\'s model is not expandable', () => {

    beforeEach(async () => {

      let initialModel = generateNodes(['s', ['es']])[0];

      wrapper = await createWrapper({
        ariaKeyMap: {},
        initialModel,
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {},
        isMounted: false
      });
    });

    it('should not have an expander', () => {
      let target = wrapper.find('.grtvn-self-expander');
      expect(target.exists()).to.be.false;
    });

    it('should not have an aria-expanded attribute', () => {
      expect(wrapper.vm.$refs.nodeElement.attributes['aria-expanded']).to.be.undefined;
    });
  });

  describe('when selectionMode is null', () => {

    beforeEach(async () => {

      let initialModel = generateNodes(['S'])[0];

      wrapper = await createWrapper({
        ariaKeyMap: {},
        initialModel,
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {},
        selectionMode: SelectionMode.None,
        isMounted: false
      });
    });

    it('should not have an aria-selected attribute', () => {
      expect(wrapper.vm.$refs.nodeElement.attributes['aria-selected']).to.be.undefined;
    });
  });

  describe('when model.selectable is false', () => {

    beforeEach(async () => {

      let initialModel = generateNodes([''])[0];

      wrapper = await createWrapper({
        ariaKeyMap: {},
        initialModel,
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {},
        selectionMode: SelectionMode.Multiple,
        isMounted: false
      });
    });

    it('should not have an aria-selected attribute', () => {
      expect(wrapper.vm.$refs.nodeElement.attributes['aria-selected']).to.be.undefined;
    });
  });

  describe('when selectionMode is single', () => {

    describe('and the node is selected', () => {

      beforeEach(async () => {

        let initialModel = generateNodes(['S'])[0];

        wrapper = await createWrapper({
          ariaKeyMap: {},
          initialModel,
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {},
          selectionMode: SelectionMode.Single,
          isMounted: false
        });
      });

      it('should have an aria-selected attribute of true', () => {
        expect(wrapper.vm.$refs.nodeElement.attributes['aria-selected'].value).to.equal('true');
      });
    });

    describe('and the node is not selected', () => {

      beforeEach(async () => {

        let initialModel = generateNodes(['s'])[0];

        wrapper = await createWrapper({
          ariaKeyMap: {},
          initialModel,
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {},
          selectionMode: SelectionMode.Single,
          isMounted: false
        });
      });

      it('should not have an aria-selected attribute', () => {
        expect(wrapper.vm.$refs.nodeElement.attributes['aria-selected']).to.be.undefined;
      });
    });
  });

  describe('when selectionMode is selectionFollowsFocus', () => {

    describe('and the node is selected', () => {

      beforeEach(async () => {

        let initialModel = generateNodes(['S'])[0];

        wrapper = await createWrapper({
          ariaKeyMap: {},
          initialModel,
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {},
          selectionMode: SelectionMode.SelectionFollowsFocus,
          isMounted: false
        });
      });

      it('should have an aria-selected attribute of true', () => {
        expect(wrapper.vm.$refs.nodeElement.attributes['aria-selected'].value).to.equal('true');
      });
    });

    describe('and the node is not selected', () => {

      beforeEach(async () => {

        let initialModel = generateNodes(['s'])[0];

        wrapper = await createWrapper({
          ariaKeyMap: {},
          initialModel,
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {},
          selectionMode: SelectionMode.SelectionFollowsFocus,
          isMounted: false
        });

        await wrapper.vm.$nextTick();
      });

      it('should not have an aria-selected attribute', () => {
        expect(wrapper.vm.$refs.nodeElement.attributes['aria-selected']).to.be.undefined;
      });
    });
  });

  describe('when selectionMode is multiple', () => {

    describe('and the node is selected', () => {

      beforeEach(async () => {

        let initialModel = generateNodes(['S'])[0];

        wrapper = await createWrapper({
          ariaKeyMap: {},
          initialModel,
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {},
          selectionMode: SelectionMode.Multiple,
          isMounted: false
        });
      });

      it('should have an aria-selected attribute of true', () => {
        expect(wrapper.vm.$refs.nodeElement.attributes['aria-selected'].value).to.equal('true');
      });
    });

    describe('and the node is not selected', () => {

      beforeEach(async () => {

        let initialModel = generateNodes(['s'])[0];

        wrapper = await createWrapper({
          ariaKeyMap: {},
          initialModel,
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {},
          selectionMode: SelectionMode.Multiple,
          isMounted: false
        });
      });

      it('should have an aria-selected attribute of false', () => {
        expect(wrapper.vm.$refs.nodeElement.attributes['aria-selected'].value).to.equal('false');
      });
    });
  });

  describe('when the node\'s selected state changes', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
      wrapper.vm.model.treeNodeSpec.state.selected = true;
      await wrapper.vm.$nextTick();
    });

    it('should emit the treeNodeSelectedChange event', () => {
      expect(wrapper.emitted().treeNodeSelectedChange).to.be.an('array').that.has.length(1);
    });
  });

  describe('when idProperty is specified', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
      wrapper.vm.model.treeNodeSpec.idProperty = 'label';
      await wrapper.vm.$nextTick();
    });

    it('should have an idPropName matching the idProperty', () => {
      expect(wrapper.vm.idPropName).to.equal('label');
    });

    it('should have a nodeId made of the tree ID and the model[idPropName] property', () => {
      expect(wrapper.vm.nodeId).to.equal(wrapper.vm.treeId + '-' + wrapper.vm.model.label);
    });
  });

  describe('when idProperty is not specified', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
      wrapper.vm.model.treeNodeSpec.idProperty = null;
      await wrapper.vm.$nextTick();
    });

    it('should have an idPropName of id', () => {
      expect(wrapper.vm.idPropName).to.equal('id');
    });

    it('should have a nodeId made of the tree ID and the model.id property', () => {
      expect(wrapper.vm.nodeId).to.equal(wrapper.vm.treeId + '-' + wrapper.vm.model.id);
    });
  });

  describe('when the model does not have a property that matches idProperty', () => {

    beforeEach(async () => {

      vi.spyOn(console, 'error').mockImplementation(() => { });

      wrapper = await createWrapper({
        ariaKeyMap: {},
        depth: 0,
        treeId: 'tree',
        initialModel: { badid: 'asf', label: 'asdf' },
        modelDefaults: {},
        initialRadioGroupValues: {},
        isMounted: false
      });
    });

    it('should log an error', () => {
      expect(console.error.mock.calls[0][0])
        .to.equal('initialModel id is required and must be a number or string. Expected prop id to exist on the model.');
    });
  });

  describe('when labelProperty is specified', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
      wrapper.vm.model.treeNodeSpec.labelProperty = 'id';
      await wrapper.vm.$nextTick();
    });

    it('should have a labelPropName matching the labelProperty', () => {
      expect(wrapper.vm.labelPropName).to.equal('id');
    });

    it('should have a label of the  model[labelPropName] property', () => {
      expect(wrapper.text()).to.equal(wrapper.vm.model.id + '');
    });
  });

  describe('when labelProperty is not specified', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
      wrapper.vm.model.treeNodeSpec.labelProperty = null;
      await wrapper.vm.$nextTick();
    });

    it('should have a labelPropName of label', () => {
      expect(wrapper.vm.labelPropName).to.equal('label');
    });

    it('should have a label of the  model.label property', () => {
      expect(wrapper.text()).to.equal(wrapper.vm.model.label + '');
    });
  });

  describe('when the model does not have a property that matches labelProperty', () => {

    beforeEach(async () => {

      vi.spyOn(console, 'error').mockImplementation(() => { });

      wrapper = await createWrapper({
        ariaKeyMap: {},
        depth: 0,
        treeId: 'tree',
        initialModel: { id: 'asf', badlabel: 'asdf' },
        modelDefaults: {},
        initialRadioGroupValues: {},
        isMounted: false
      });
    });

    it('should log an error', () => {
      expect(console.error.mock.calls[0][0])
        .to.equal('initialModel label is required and must be a string. Expected prop label to exist on the model.');
    });
  });

  describe('when childrenProperty is specified', () => {

    beforeEach(async () => {
      let defaultProps = getDefaultPropsData();
      wrapper = await createWrapper(Object.assign(defaultProps, {
        initialModel: generateNodes(['sf', ['s', 's']])[0]
      }));
      wrapper.vm.model.treeNodeSpec.childrenProperty = 'children';
      await wrapper.vm.$nextTick();
    });

    it('should have a children property of the expected values', () => {
      expect(wrapper.vm.model.children.length).to.equal(2);
    });
  });

  describe('when given custom classes', () => {

    const customizations = {
      classes: {
        treeViewNode: 'customnodeclass',
        treeViewNodeSelf: 'customnodeselfclass',
        treeViewNodeSelfExpander: 'customnodeselfexpanderclass',
        treeViewNodeSelfExpanded: 'customnodeselfexpandedclass',
        treeViewNodeSelfExpandedIndicator: 'customnodeselfexpandedindicatorclass',
        treeViewNodeSelfSelected: 'customnodeselfselectedclass',
        treeViewNodeSelfSpacer: 'customnodeselfspacerclass',
        treeViewNodeSelfLabel: 'customnodeselflabelclass',
        treeViewNodeSelfInput: 'customnodeselfinputclass',
        treeViewNodeSelfCheckbox: 'customnodeselfcheckboxclass',
        treeViewNodeSelfRadio: 'customnodeselfradioclass',
        treeViewNodeSelfText: 'customnodeselftextclass',
        treeViewNodeSelfAction: 'customnodeselfactionclass',
        treeViewNodeSelfAddChild: 'customnodeselfaddchildclass',
        treeViewNodeSelfAddChildIcon: 'customnodeselfaddchildiconclass',
        treeViewNodeSelfDelete: 'customnodeselfdeleteclass',
        treeViewNodeSelfDeleteIcon: 'customnodeselfdeleteiconclass',
        treeViewNodeChildrenWrapper: 'customnodechildrenwrapperclass',
        treeViewNodeChildren: 'customnodechildrenclass',
        treeViewNodeLoading: 'customnodeloadingclass'
      }
    };

    beforeEach(async () => {
      let initialModel = generateNodes(['cEdS', ['res', 'esa']], "", () => Promise.resolve())[0];

      wrapper = await createWrapper({
        ariaKeyMap: {},
        initialModel,
        modelDefaults: { customizations },
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {},
        selectionMode: SelectionMode.Single,
        isMounted: false
      });
    });

    it('should add the custom class to the tree view node\'s root element', () => {
      let target = wrapper.find('.grtvn.' + customizations.classes.treeViewNode);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s self element', () => {
      let target = wrapper.find('.grtvn-self.' + customizations.classes.treeViewNodeSelf);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s expander element', () => {
      let target = wrapper.find('.grtvn-self-expander.' + customizations.classes.treeViewNodeSelfExpander);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s expanded element', () => {
      let target = wrapper.find('.grtvn-self-expanded.' + customizations.classes.treeViewNodeSelfExpanded);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s expanded indicator element', () => {
      let target = wrapper.find('.grtvn-self-expanded-indicator.' + customizations.classes.treeViewNodeSelfExpandedIndicator);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s selected element', () => {
      let target = wrapper.find('.grtvn-self-selected.' + customizations.classes.treeViewNodeSelfSelected);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s spacer element', () => {
      let target = wrapper.find('.grtvn-self-spacer.' + customizations.classes.treeViewNodeSelfSpacer);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s label element', () => {
      let target = wrapper.find('.grtvn-self-label.' + customizations.classes.treeViewNodeSelfLabel);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s input element', () => {
      let target = wrapper.find('.grtvn-self-input.' + customizations.classes.treeViewNodeSelfInput);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s checkbox element', () => {
      let target = wrapper.find('.grtvn-self-checkbox.' + customizations.classes.treeViewNodeSelfCheckbox);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s radio button element', () => {
      let target = wrapper.find('.grtvn-self-radio.' + customizations.classes.treeViewNodeSelfRadio);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s text element', () => {
      let target = wrapper.find('.grtvn-self-text.' + customizations.classes.treeViewNodeSelfText);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom add child class to the tree view node\'s add child element', () => {
      let target = wrapper.find('.grtvn-self-action.' + customizations.classes.treeViewNodeSelfAddChild);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom action class to the tree view node\'s add child element', () => {
      let target = wrapper.find('.grtvn-self-action.' + customizations.classes.treeViewNodeSelfAddChild + '.' + customizations.classes.treeViewNodeSelfAction);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s add child icon element', () => {
      let target = wrapper.find('.grtvn-self-add-child-icon.' + customizations.classes.treeViewNodeSelfAddChildIcon);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom delete class to the tree view node\'s delete element', () => {
      let target = wrapper.find('.grtvn-self-action.' + customizations.classes.treeViewNodeSelfDelete);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom action class to the tree view node\'s delete element', () => {
      let target = wrapper.find('.grtvn-self-action.' + customizations.classes.treeViewNodeSelfDelete + '.' + customizations.classes.treeViewNodeSelfAction);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s delete icon element', () => {
      let target = wrapper.find('.grtvn-self-delete-icon.' + customizations.classes.treeViewNodeSelfDeleteIcon);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s children wrapper element', () => {
      let target = wrapper.find('.grtvn-children-wrapper.' + customizations.classes.treeViewNodeChildrenWrapper);
      expect(target.exists()).to.be.true;
    });

    it('should add the custom class to the tree view node\'s children element', () => {
      let target = wrapper.find('.grtvn-children.' + customizations.classes.treeViewNodeChildren);
      expect(target.exists()).to.be.true;
    });
  });

  describe('when using slots', () => {

    describe('and rendering a text node', () => {

      const customClasses = { treeViewNode: 'customnodeclass' };

      beforeEach(async () => {
        let initialModel = generateNodes([''], "baseId")[0];

        wrapper = await createWrapper(
          {
            ariaKeyMap: {},
            initialModel,
            modelDefaults: { customizations: { classes: customClasses } },
            depth: 0,
            treeId: 'tree',
            initialRadioGroupValues: {},
            isMounted: false
          },
          {
            text: '<template #text="props"><span :id="props.model.id" class="text-slot-content"><span class="slot-custom-classes">{{ JSON.stringify(props.customClasses) }}</span></span></template>',
          }
        );
      });

      it('should render the slot template', () => {
        expect(wrapper.find('.text-slot-content').exists()).to.be.true;
      });

      it('should have model data', () => {
        expect(wrapper.find('span#baseIdn0.text-slot-content').exists()).to.be.true;
      });

      it('should have custom classes data', () => {
        expect(wrapper.find('span.slot-custom-classes').text()).to.equal(JSON.stringify(customClasses));
      });
    });

    describe('and rendering a checkbox node', () => {

      const customClasses = { treeViewNode: 'customnodeclass' };

      beforeEach(async () => {
        let initialModel = generateNodes(['c'], "baseId")[0];

        wrapper = await createWrapper(
          {
            ariaKeyMap: {},
            initialModel,
            modelDefaults: { customizations: { classes: customClasses } },
            depth: 0,
            treeId: 'tree',
            initialRadioGroupValues: {},
            isMounted: false
          },
          {
            checkbox: `<template #checkbox="props">
                          <span :id="props.model.id" class="text-slot-content">
                            <span class="slot-custom-classes">{{ JSON.stringify(props.customClasses) }}</span>
                            <span class="slot-input-id">{{ props.inputId }}</span>
                            <span class="slot-has-handler">{{ typeof props.checkboxChangeHandler == 'function' }}</span>
                          </span>
                       </template>`,
          }
        );
      });

      it('should render the slot template', () => {
        expect(wrapper.find('.text-slot-content').exists()).to.be.true;
      });

      it('should get a model property', () => {
        expect(wrapper.find('span#baseIdn0.text-slot-content').exists()).to.be.true;
      });

      it('should get a customClasses property', () => {
        expect(wrapper.find('span.slot-custom-classes').text()).to.equal(JSON.stringify(customClasses));
      });

      it('should get an inputId property', () => {
        expect(wrapper.find('span.slot-input-id').text()).to.equal('tree-baseIdn0-input');
      });

      it('should get a checkboxChangeHandler property function', () => {
        expect(wrapper.find('span.slot-has-handler').text()).to.equal('true');
      });
    });

    describe('and rendering a radiobutton node', () => {

      const customClasses = { treeViewNode: 'customnodeclass' };

      beforeEach(async () => {
        let initialModel = generateNodes(['R'], "baseId")[0];

        wrapper = await createWrapper(
          {
            ariaKeyMap: {},
            initialModel,
            modelDefaults: { customizations: { classes: customClasses } },
            depth: 0,
            treeId: 'tree',
            initialRadioGroupValues: {},
            isMounted: false
          },
          {
            radio: `<template #radio="props">
                      <span :id="props.model.id" class="text-slot-content">
                        <span class="slot-custom-classes">{{ JSON.stringify(props.customClasses) }}</span>
                        <span class="slot-input-id">{{ props.inputId }}</span>
                        <span class="slot-has-handler">{{ typeof props.radioChangeHandler == 'function' }}</span>
                        <span class="slot-radio-group-values">{{ JSON.stringify(props.radioGroupValues) }}</span>
                      </span>
                    </template>`,
          }
        );
      });

      it('should render the slot template', () => {
        expect(wrapper.find('.text-slot-content').exists()).to.be.true;
      });

      it('should get a model property', () => {
        expect(wrapper.find('span#baseIdn0.text-slot-content').exists()).to.be.true;
      });

      it('should get a customClasses property', () => {
        expect(wrapper.find('span.slot-custom-classes').text()).to.equal(JSON.stringify(customClasses));
      });

      it('should get an inputId property', () => {
        expect(wrapper.find('span.slot-input-id').text()).to.equal('tree-baseIdn0-input');
      });

      it('should get a radioGroupValues property', () => {
        expect(wrapper.find('span.slot-radio-group-values').text()).to.equal('{"baseId-rb":"baseIdn0-val"}');
      });

      it('should get a radioChangeHandler property function', () => {
        expect(wrapper.find('span.slot-has-handler').text()).to.equal('true');
      });
    });

    describe('and rendering a custom loader message', () => {

      const customClasses = { treeViewNode: 'customnodeclass' };

      beforeEach(async () => {
        let loadChildrenAsync = () => new Promise(resolve => setTimeout(resolve.bind(null, []), 1000));
        let initialModel = generateNodes(['e'], "baseId", null, loadChildrenAsync)[0];

        wrapper = await createWrapper(
          {
            ariaKeyMap: {},
            initialModel,
            modelDefaults: { customizations: { classes: customClasses } },
            depth: 0,
            treeId: 'tree',
            initialRadioGroupValues: {},
            isMounted: false
          },
          {
            loading: '<template #loading="props"><span :id="props.model.id" class="loading-slot-content"><span class="slot-custom-classes">{{ JSON.stringify(props.customClasses) }}</span></span></template>',
          }
        );

        wrapper.find('#' + wrapper.vm.expanderId).trigger('click');
      });

      it('should render the slot template', () => {
        expect(wrapper.find('.loading-slot-content').exists()).to.be.true;
      });

      it('should have model data', () => {
        expect(wrapper.find('span#baseIdn0.loading-slot-content').exists()).to.be.true;
      });

      it('should have custom classes data', () => {
        expect(wrapper.find('span.slot-custom-classes').text()).to.equal(JSON.stringify(customClasses));
      });
    });
  });

  describe('when the node\'s body is clicked', () => {

    let nodeBody = null;

    describe('always', () => {

      beforeEach(async () => {
        wrapper = await createWrapper();
        nodeBody = wrapper.find(`#${wrapper.vm.nodeId} .grtvn-self`);
        nodeBody.trigger('click');
      });

      it('should emit the treeNodeClick event', () => {
        expect(wrapper.emitted().treeNodeClick.length).to.equal(1);
      });
    });

    describe('and the node is selectable', () => {

      beforeEach(async () => {
        wrapper = await createWrapper();
        nodeBody = wrapper.find(`#${wrapper.vm.nodeId} .grtvn-self`);
        nodeBody.trigger('click');
      });

      it('should toggle the selected state', () => {
        expect(wrapper.vm.model.treeNodeSpec.state.selected).to.be.true;
      });
    });

    describe('and the node is not selectable', () => {

      beforeEach(async () => {
        wrapper = await createWrapper(Object.assign(getDefaultPropsData(), { selectionMode: SelectionMode.None }));
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

    beforeEach(async () => {
      wrapper = await createWrapper();
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

      beforeEach(async () => {
        wrapper = await createWrapper({
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

      it('should emit the treeNodeExpandedChange event', async () => {
        expander.trigger('click');
        await wrapper.vm.$nextTick();
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

      beforeEach(async () => {

        let loadChildrenAsync = () => new Promise(resolve => setTimeout(resolve.bind(null, generateNodes(['', ''])), 1000));
        let initialModel = generateNodes(['ces'], '', null, loadChildrenAsync)[0];

        wrapper = await createWrapper({
          ariaKeyMap: {},
          initialModel,
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          initialRadioGroupValues: {},
          isMounted: false
        });

        vi.useFakeTimers();

        wrapper.find('#' + wrapper.vm.expanderId).trigger('click');
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      describe('and the the loadChildrenAsync Promise has not returned', () => {

        it('should show the loading area while children load', () => {
          expect(wrapper.find('.grtvn-loading').exists()).to.be.true;
        });
      });

      describe('and the loadChildrenAsync Promise returns', () => {

        beforeEach(async () => {
          vi.runAllTimers();
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

    beforeEach(async () => {
      wrapper = await createWrapper();
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

  describe('when a child node\'s checkbox is toggled', () => {

    let checkbox = null;

    beforeEach(async () => {
      wrapper = await createWrapper({
        ariaKeyMap: {},
        initialModel: generateNodes(['es', ['ces']])[0],
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        initialRadioGroupValues: {},
        isMounted: false
      });

      const childWrapper = wrapper.find('.grtvn-children').findComponent(TreeViewNode);
      checkbox = childWrapper.find('#' + childWrapper.vm.inputId);
    });

    it('should emit the treeNodeChildCheckboxChange event', () => {
      checkbox.setChecked();
      expect(wrapper.emitted().treeNodeCheckboxChange.length).to.equal(1);
    });
  });

  describe('when the node\'s radiobutton is toggled', () => {

    let radioButton = null;

    beforeEach(async () => {
      wrapper = await createWrapper({
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

    describe('and a deleteNodeCallback is not provided', () => {

      beforeEach(async () => {
        wrapper = await createWrapper({
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

      it('should emit the treeNodeDelete event', async () => {
        deleteButton.trigger('click');
        await flushPromises();

        expect(wrapper.emitted().treeNodeDelete.length).to.equal(1);
      });

      it('should remove the target node from the model', async () => {
        deleteButton.trigger('click');
        await flushPromises();

        expect(wrapper.vm.model.children.length).to.equal(0);
      });
    });

    describe('and a deleteNodeCallback is provided', () => {

      describe('and that callback returns true', () => {

        beforeEach(async () => {
          wrapper = await createWrapper({
            ariaKeyMap: {},
            initialModel: generateNodes(['es', ['ds']])[0],
            modelDefaults: { deleteNodeCallback: () => Promise.resolve(true) },
            depth: 0,
            treeId: 'tree',
            initialRadioGroupValues: {},
            isMounted: false
          });

          let childNode = wrapper.findAllComponents(TreeViewNode)[0];
          deleteButton = wrapper.find('#' + childNode.vm.nodeId + '-delete');
        });

        it('should emit the treeNodeDelete event', async () => {
          deleteButton.trigger('click');
          await flushPromises();

          expect(wrapper.emitted().treeNodeDelete.length).to.equal(1);
        });

        it('should remove the target node from the model', async () => {
          deleteButton.trigger('click');
          await flushPromises();

          expect(wrapper.vm.model.children.length).to.equal(0);
        });
      });

      describe('and that callback returns false', () => {

        beforeEach(async () => {
          wrapper = await createWrapper({
            ariaKeyMap: {},
            initialModel: generateNodes(['es', ['ds']])[0],
            modelDefaults: { deleteNodeCallback: () => Promise.resolve(false) },
            depth: 0,
            treeId: 'tree',
            initialRadioGroupValues: {},
            isMounted: false
          });

          let childNode = wrapper.findAllComponents(TreeViewNode)[0];
          deleteButton = wrapper.find('#' + childNode.vm.nodeId + '-delete');
        });

        it('should not emit the treeNodeDelete event', async () => {
          deleteButton.trigger('click');
          await flushPromises();

          expect(wrapper.emitted().treeNodeDelete).to.be.undefined;
        });

        it('should not remove the target node from the model', async () => {
          deleteButton.trigger('click');
          await flushPromises();

          expect(wrapper.vm.model.children.length).to.equal(1);
        });
      });
    });
  });

  describe('when a node\'s add child button is clicked', () => {

    let addChildButton = null;

    describe('and the callback resolves to node data', () => {

      beforeEach(async () => {
        let addChildCallback = () => {
          return Promise.resolve({ id: 'newId', label: 'new label' });
        };

        wrapper = await createWrapper({
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
        await flushPromises();

        expect(wrapper.emitted().treeNodeAdd.length).to.equal(1);
      });

      it('should pass the new node data to the treeNodeAdd event', async () => {
        addChildButton.trigger('click');
        await flushPromises();

        expect(wrapper.emitted().treeNodeAdd[0][0].id).to.equal('newId');
      });

      it('should add a subnode to the target node from the model', async () => {
        addChildButton.trigger('click');
        await flushPromises();

        expect(wrapper.vm.model.children.length).to.equal(1);
      });
    });

    describe('and the callback does not resolve to node data', () => {

      beforeEach(async () => {
        let addChildCallback = () => {
          return Promise.resolve(null);
        };

        wrapper = await createWrapper({
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
        await flushPromises();

        expect(wrapper.emitted().treeNodeAdd).to.be.undefined;
      });

      it('should add a subnode to the target node from the model', async () => {
        addChildButton.trigger('click');
        await flushPromises();

        expect(wrapper.vm.model.children.length).to.equal(0);
      });
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
      wrapper = await createWrapper(Object.assign(getDefaultPropsData(), { initialModel: generateNodes(['Es', ['sf']])[0] }));

      expect(wrapper.vm.model.treeNodeSpec.focusable).to.be.false;
      const innerNode = wrapper.findAllComponents(TreeViewNode)[0];
      innerNode.vm.$emit(TreeEvent.RequestParentFocus);
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
      expect(wrapper.vm.model.treeNodeSpec.state.selected).to.be.true;
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

        const curWindow = window;

        afterEach(() => {
          window = curWindow;
        });

        describe('and the input is enabled', () => {

          beforeEach(async () => {
            wrapper = await createWrapper();
            window = null; // HACK TODO - Work around for what may be an webidl2js issue in JSDOM usage? Err: Failed to construct 'MouseEvent': member view is not of type Window.
            await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.activateItem[0]);
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

        describe('and the node is in a custom slot without the standard class applied', () => {

          beforeEach(async () => {
            let initialModel = generateNodes(['c'], "baseId")[0];

            wrapper = await createWrapper(
              {
                ariaKeyMap: {
                  activateItem: [32], // Space
                },
                initialModel,
                modelDefaults: { },
                depth: 0,
                treeId: 'tree',
                initialRadioGroupValues: {},
                isMounted: false
              },
              {
                checkbox: `<template #checkbox="props">
                            <span :id="props.model.id" class="text-slot-content">
                              <input type="checkbox" :id="props.inputId" />
                            </span>
                          </template>`,
              }
            );

            window = null; // HACK TODO - Work around for what may be an webidl2js issue in JSDOM usage? Err: Failed to construct 'MouseEvent': member view is not of type Window.
            await triggerKeydown(wrapper, wrapper.vm.ariaKeyMap.activateItem[0]);
          });

          it('should perform the default action on the node', () => {
            expect(wrapper.find('input[type="checkbox"]').element.checked).to.be.true;
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
          wrapper.setProps({ selectionMode: SelectionMode.None });
          await wrapper.vm.$nextTick();
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
        wrapper.vm.focusPreviousNode(initialModel.children[0]);
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
        wrapper.vm.focusPreviousNode(initialModel.children[1]);
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
        wrapper.vm.focusPreviousNode(initialModel.children[1]);
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
          wrapper.vm.focusNextNode(initialModel.children[0], false);
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
            wrapper.vm.focusNextNode(initialModel.children[0], true);
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
            wrapper.vm.focusNextNode(initialModel.children[0], true);
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
          wrapper.vm.focusNextNode(initialModel.children[0], false);
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
          wrapper.vm.focusNextNode(initialModel.children[0], false);
          await wrapper.vm.$nextTick();
        });

        it('should pass up the chain to this node\'s parent, ignoring children', () => {
          expect(wrapper.emitted().treeNodeAriaRequestNextFocus).to.be.an('array').that.has.length(1);
          expect(wrapper.emitted().treeNodeAriaRequestNextFocus[0][1]).to.be.true;
        });
      });
    });
  });

  describe('when a child node fires a treeNodeClick event', () => {

    beforeEach(async () => {
      const defaultProps = getDefaultPropsData();
      const initialModel = generateNodes(['es', ['es']])[0];
      wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
      wrapper.find('.grtvn-children').findComponent(TreeViewNode).vm.$emit('treeNodeClick');
    });

    it('should emit a treeNodeClick event', () => {
      expect(wrapper.emitted('treeNodeClick').length).to.equal(1);
    });
  });

  describe('when a child node fires a treeNodeDblclick event', () => {

    beforeEach(async () => {
      const defaultProps = getDefaultPropsData();
      const initialModel = generateNodes(['es', ['es']])[0];
      wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
      wrapper.find('.grtvn-children').findComponent(TreeViewNode).vm.$emit('treeNodeDblclick');
    });

    it('should emit a treeNodeDblclick event', () => {
      expect(wrapper.emitted('treeNodeDblclick').length).to.equal(1);
    });
  });

  describe('when a child node fires a treeNodeChildCheckboxChange event', () => {

    beforeEach(async () => {
      const defaultProps = getDefaultPropsData();
      const initialModel = generateNodes(['es', ['es', ['esc']]])[0];
      wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
      wrapper.find('.grtvn-children').findComponent(TreeViewNode).vm.$emit('treeNodeChildCheckboxChange', initialModel.children[0], initialModel.children[0].children[0], null);
    });

    it('should emit a treeNodeChildCheckboxChange event', () => {
      expect(wrapper.emitted('treeNodeChildCheckboxChange').length).to.equal(1);
    });
  });

  describe('when a child node fires a treeNodeRadioChange event', () => {

    beforeEach(async () => {
      const defaultProps = getDefaultPropsData();
      const initialModel = generateNodes(['es', ['es']])[0];
      wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
      wrapper.find('.grtvn-children').findComponent(TreeViewNode).vm.$emit('treeNodeRadioChange');
    });

    it('should emit a treeNodeRadioChange event', () => {
      expect(wrapper.emitted('treeNodeRadioChange').length).to.equal(1);
    });
  });

  describe('when a child node fires a treeNodeExpandedChange event', () => {

    beforeEach(async () => {
      const defaultProps = getDefaultPropsData();
      const initialModel = generateNodes(['es', ['es']])[0];
      wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
      wrapper.find('.grtvn-children').findComponent(TreeViewNode).vm.$emit('treeNodeExpandedChange');
    });

    it('should emit a treeNodeExpandedChange event', () => {
      expect(wrapper.emitted('treeNodeExpandedChange').length).to.equal(1);
    });
  });

  describe('when a child node fires a treeNodeChildrenLoad event', () => {

    beforeEach(async () => {
      const defaultProps = getDefaultPropsData();
      const initialModel = generateNodes(['es', ['es']])[0];
      wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
      wrapper.find('.grtvn-children').findComponent(TreeViewNode).vm.$emit('treeNodeChildrenLoad');
    });

    it('should emit a treeNodeChildrenLoad event', () => {
      expect(wrapper.emitted('treeNodeChildrenLoad').length).to.equal(1);
    });
  });

  describe('when a child node fires a treeNodeAdd event', () => {

    beforeEach(async () => {
      const defaultProps = getDefaultPropsData();
      const initialModel = generateNodes(['es', ['es']])[0];
      wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
      wrapper.find('.grtvn-children').findComponent(TreeViewNode).vm.$emit('treeNodeAdd');
    });

    it('should emit a treeNodeAdd event', () => {
      expect(wrapper.emitted('treeNodeAdd').length).to.equal(1);
    });
  });

  describe('when a child node fires a treeNodeAriaRequestFirstFocus event', () => {

    beforeEach(async () => {
      const defaultProps = getDefaultPropsData();
      const initialModel = generateNodes(['es', ['es']])[0];
      wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
      wrapper.find('.grtvn-children').findComponent(TreeViewNode).vm.$emit('treeNodeAriaRequestFirstFocus');
    });

    it('should emit a treeNodeAriaRequestFirstFocus event', () => {
      expect(wrapper.emitted('treeNodeAriaRequestFirstFocus').length).to.equal(1);
    });
  });

  describe('when a child node fires a treeNodeAriaRequestLastFocus event', () => {

    beforeEach(async () => {
      const defaultProps = getDefaultPropsData();
      const initialModel = generateNodes(['es', ['es']])[0];
      wrapper = await createWrapper(Object.assign(defaultProps, { initialModel }));
      wrapper.find('.grtvn-children').findComponent(TreeViewNode).vm.$emit('treeNodeAriaRequestLastFocus');
    });

    it('should emit a treeNodeAriaRequestLastFocus event', () => {
      expect(wrapper.emitted('treeNodeAriaRequestLastFocus').length).to.equal(1);
    });
  });
});
