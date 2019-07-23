import { expect } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import TreeViewNode from '../../src/components/TreeViewNode.vue';
import { generateNodes } from '../data/node-generator.js';

const localVue = createLocalVue();

const getDefaultPropsData = function () {
  let radioState = {};
  return {
    ariaKeyMap: {},
    initialModel: generateNodes(['ces'], radioState)[0],
    modelDefaults: {},
    depth: 0,
    treeId: 'tree-id',
    radioGroupValues: radioState
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

describe('TreeViewNode.vue', () => {

  let wrapper = null;

  afterEach(() => {
    wrapper.vm.$destroy();
    wrapper = null;
  });

  describe('when given minimal model data', () => {

    beforeEach(() => {
      let initialModel = { id: 'my-node', label: 'My Node' };

      wrapper = createWrapper({
        ariaKeyMap: {},
        depth: 0,
        initialModel,
        modelDefaults: {},
        radioGroupValues: {}
      });
    });

    it('normalizes model data', () => {
      expect(wrapper.vm.model.id).to.equal('my-node');
      expect(wrapper.vm.model.label).to.equal('My Node');
      expect(wrapper.vm.model.title).to.be.null;
      expect(wrapper.vm.model.expandable).to.be.true;
      expect(wrapper.vm.model.selectable).to.be.false;
      expect(wrapper.vm.model.deletable).to.be.false;
      expect(wrapper.vm.model.state).to.exist;
      expect(wrapper.vm.model.state.expanded).to.be.false;
      expect(wrapper.vm.model.state.selected).to.be.false;
      expect(wrapper.vm.model.input).to.be.null;
      expect(wrapper.vm.model.state.input).to.not.exist;
    });
  });

  describe('when given default model data', () => {

    beforeEach(() => {
      let initialModel = { id: 'my-node', label: 'My Node', expandable: true };

      wrapper = createWrapper({
        ariaKeyMap: {},
        depth: 0,
        initialModel,
        modelDefaults: {
          expandable: false,
          selectable: true,
          state: {
            selected: true
          }
        },
        radioGroupValues: {}
      });
    });

    it('should incorporate the default data into the model for unspecified properties', () => {
      expect(wrapper.vm.model.selectable).to.be.true;
      expect(wrapper.vm.model.state.selected).to.be.true;
    });

    it('should use the model\'s data over the default data for specified properties', () => {
      expect(wrapper.vm.model.expandable).to.be.true;
    });
  });

  describe('when given a title in the model data for a text node', () => {

    beforeEach(() => {
      wrapper = createWrapper({
        ariaKeyMap: {},
        depth: 0,
        initialModel: { id: 'my-node', label: 'My Node', title: 'My Title' },
        modelDefaults: {},
        radioGroupValues: {}
      });
    });

    it('should have a title attribute on the node\'s text', () => {
      let elem = wrapper.find(`.tree-view-node-self-text`).element;
      expect(elem.getAttribute("title")).to.equal("My Title");
    });
  });

  describe('when given a title in the model data for an input node', () => {

    beforeEach(() => {
      let data = getDefaultPropsData();
      data.initialModel.title = "My Title";

      wrapper = createWrapper(data);
    });

    it('should have a title attribute on the node\'s label', () => {
      let elem = wrapper.find(`.tree-view-node-self-label`).element;
      expect(elem.getAttribute("title")).to.equal("My Title");
    });
  });

  describe('when passed a tree ID', () => {

    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('has a nodeId made of the tree ID and model ID', () => {
      expect(wrapper.vm.nodeId).to.equal(wrapper.vm.treeId + '-' + wrapper.vm.model.id);
    });

    it('has an expanderId made of the node ID and -exp', () => {
      expect(wrapper.vm.expanderId).to.equal(wrapper.vm.nodeId + '-exp');
    });

    describe('and the node has an input', () => {

      it('has an inputId made of the node ID and -input', () => {
        expect(wrapper.vm.inputId).to.equal(wrapper.vm.nodeId + '-input');
      });
    });
  });

  describe('when not passed a tree ID', () => {

    beforeEach(() => {
      let radioState = {};
      wrapper = createWrapper({
        ariaKeyMap: {},
        initialModel: generateNodes(['ces'], radioState)[0],
        modelDefaults: {},
        depth: 0,
        radioGroupValues: radioState
      });
    });

    it('has a null nodeId', () => {
      expect(wrapper.vm.nodeId).to.be.null;
    });

    it('has a null inputId', () => {
      expect(wrapper.vm.inputId).to.be.null;
    });

    it('has a null expanderId', () => {
      expect(wrapper.vm.expanderId).to.be.null;
    });
  });

  describe('when there is not an addChildCallback method', () => {

    let addChildButton = null;

    beforeEach(() => {
      let radioState = {};

      wrapper = createWrapper({
        ariaKeyMap: {},
        initialModel: generateNodes(['es'], radioState)[0],
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        radioGroupValues: radioState
      });

      addChildButton = wrapper.find('#' + wrapper.vm.nodeId + '-add-child');
    });

    it('should not include an add button', async () => {
      expect(addChildButton.exists()).to.be.false;
    });
  });

  describe('when there is an addChildCallback method', () => {

    let addChildButton = null;

    beforeEach(() => {
      let radioState = {};
      let addChildCallback = () => {
        return Promise.resolve(null);
      };

      wrapper = createWrapper({
        ariaKeyMap: {},
        initialModel: generateNodes(['esa'], radioState, "", addChildCallback)[0],
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        radioGroupValues: radioState
      });

      addChildButton = wrapper.find('#' + wrapper.vm.nodeId + '-add-child');
    });

    it('should include an add button', async () => {
      expect(addChildButton.exists()).to.be.true;
    });
  });

  describe('when a node\'s model is disabled', () => {

    beforeEach(() => {
      let radioState = {};
      let initialModel = generateNodes(['ces!'], radioState)[0];

      wrapper = createWrapper({
        ariaKeyMap: {},
        initialModel,
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        radioGroupValues: radioState
      });
    });

    it('has a disabled input', () => {
      let input = wrapper.find('#' + wrapper.vm.inputId);
      expect(input.element.disabled).to.be.true;
    });
  });

  describe('when a node\'s model is not disabled', () => {

    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('has an enabled input', () => {
      let input = wrapper.find('#' + wrapper.vm.inputId);
      expect(input.element.disabled).to.be.false;
    });
  });

  describe('when a node\'s model is expandable', () => {

    describe('and the model has children', () => {

      beforeEach(() => {

        let radioState = {};
        let initialModel = generateNodes(['es', ['es']], radioState)[0];

        wrapper = createWrapper({
          ariaKeyMap: {},
          initialModel,
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          radioGroupValues: radioState
        });
      });

      it('should have an expander', () => {
        let target = wrapper.find('.tree-view-node-self-expander');
        expect(target.exists()).to.be.true;
      });

      describe('and the model is not expanded', () => {

        it('should have an aria-expanded attribute set to false', () => {
          let target = wrapper.find('.tree-view-node[aria-expanded="false"]');
          expect(target.exists()).to.be.true;
        });

        it('should have an aria-hidden attribute set to true on the child list', () => {
          let target = wrapper.find('.tree-view-node-children[aria-hidden="true"]');
          expect(target.exists()).to.be.true;
        });
      });

      describe('and the model is expanded', () => {

        beforeEach(() => {

          let radioState = {};
          let initialModel = generateNodes(['Es', ['es']], radioState)[0];

          wrapper = createWrapper({
            ariaKeyMap: {},
            initialModel,
            modelDefaults: {},
            depth: 0,
            treeId: 'tree',
            radioGroupValues: radioState
          });
        });

        it('should have an aria-expanded attribute set to true', () => {
          let target = wrapper.find('.tree-view-node[aria-expanded="true"]');
          expect(target.exists()).to.be.true;
        });

        it('should have an aria-hidden attribute set to false on the child list', () => {
          let target = wrapper.find('.tree-view-node-children[aria-hidden="false"]');
          expect(target.exists()).to.be.true;
        });
      });
    });

    describe('and the model does not have children', () => {

      beforeEach(() => {

        let radioState = {};
        let initialModel = generateNodes(['es'], radioState)[0];

        wrapper = createWrapper({
          ariaKeyMap: {},
          initialModel,
          modelDefaults: {},
          depth: 0,
          treeId: 'tree',
          radioGroupValues: radioState
        });
      });

      it('should not have an expander', () => {
        let target = wrapper.find('.tree-view-node-self-expander');
        expect(target.exists()).to.be.false;
      });
    });
  });

  describe('when a node\'s model is not expandable', () => {

    beforeEach(() => {

      let radioState = {};
      let initialModel = generateNodes(['s', ['es']], radioState)[0];

      wrapper = createWrapper({
        ariaKeyMap: {},
        initialModel,
        modelDefaults: {},
        depth: 0,
        treeId: 'tree',
        radioGroupValues: radioState
      });
    });

    it('should not have an expander', () => {
      let target = wrapper.find('.tree-view-node-self-expander');
      expect(target.exists()).to.be.false;
    });
  });
});
