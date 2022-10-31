import { expect, describe, it, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import TreeView from '../../components/TreeView.vue';
import TreeViewNode from '../../components/TreeViewNode.vue';
import { generateNodes } from '../../../tests/data/node-generator.js';
import { dropEffect as DropEffect } from '../../enums/dragDrop';

const getDefaultPropsData = function () {
  return {
    initialModel: generateNodes(['ecs', 'ecs', 'ecs', ['ecs', 'ecs', 'ecs']])
  }
};

let elem;

async function createWrapper(customPropsData, customAttrs) {
  elem = document.createElement('div');
  if (document.body) {
    document.body.appendChild(elem);
  }

  let attrs = customAttrs || { id: 'grtv-1' };

  let wrapper = mount(TreeView, {
    sync: false,
    props: customPropsData || getDefaultPropsData(),
    attrs: attrs,
    attachTo: elem
  });

  await flushPromises();

  return wrapper;
};

describe('TreeView.vue (Drag and Drop)', () => {

  let wrapper = null;
  let eventData = null;

  beforeEach(() => {
    eventData = {
      dataTransfer: {
        dropEffect: DropEffect.Move,
        getData: function (mime) { return this.privateData[mime]; },
        setData: function (mime, value) { this.privateData[mime] = value; },
        privateData: {}
      }
    };
  });

  afterEach(() => {
    wrapper = null;
    eventData = null;

    elem.remove();
  });

  describe('when dropping', () => {

    describe('and the source tree is the same as the destination tree', () => {

      describe('and it is a Move operation', () => {

        beforeEach(async () => {
          wrapper = await createWrapper(null, { id: 'grtv-1' });
        });

        describe('and the drop is directly on a node', () => {

          beforeEach(() => {
            let startingNode = wrapper.find('#grtv-1-n0 .grtvn-self');
            startingNode.trigger('dragstart', eventData);

            let endingNode = wrapper.find('#grtv-1-n2 .grtvn-self');
            endingNode.trigger('drop', eventData);
          });

          it('should move the node to the end of the child list of the target', () => {
            expect(wrapper.vm.model.length).to.equal(2);
            expect(wrapper.vm.model[1].children.length).to.equal(4);
            expect(wrapper.vm.model[1].children[3].id).to.equal('n0');
          });
        });

        describe('and the drop is on the prev node marker', () => {

          beforeEach(() => {
            let startingNode = wrapper.find('#grtv-1-n0 .grtvn-self');
            startingNode.trigger('dragstart', eventData);

            let endingNode = wrapper.find('#grtv-1-n2 .grtvn-self-prev-target');
            endingNode.trigger('drop', eventData);
          });

          it('should move the node to before the target', () => {
            expect(wrapper.vm.model.length).to.equal(3);
            expect(wrapper.vm.model[1].id).to.equal('n0');
          });
        });

        describe('and the drop is on the next node marker', () => {

          beforeEach(() => {
            let startingNode = wrapper.find('#grtv-1-n0 .grtvn-self');
            startingNode.trigger('dragstart', eventData);

            let endingNode = wrapper.find('#grtv-1-n1 .grtvn-self-next-target');
            endingNode.trigger('drop', eventData);
          });

          it('should move the node to after the target', () => {
            expect(wrapper.vm.model.length).to.equal(3);
            expect(wrapper.vm.model[1].id).to.equal('n0');
          });
        });

        describe('and the target node is in a different node level than the source node', () => {

          beforeEach(() => {
            let startingNode = wrapper.find('#grtv-1-n2n0 .grtvn-self');
            startingNode.trigger('dragstart', eventData);

            let endingNode = wrapper.find('#grtv-1-n0 .grtvn-self-next-target');
            endingNode.trigger('drop', eventData);
          });

          it('should move the node to the new location', () => {
            expect(wrapper.vm.model.length).to.equal(4);
            expect(wrapper.vm.model[3].children.length).to.equal(2);
            expect(wrapper.vm.model[1].id).to.equal('n2n0');
          });
        });
      });

      describe('and it is a Copy operation', () => {

        beforeEach(() => {
          eventData.dataTransfer.dropEffect = DropEffect.Copy;
        });

        describe('always', () => {

          beforeEach(async () => {

            // Set a node ID that collides with the first
            // available name for the node ID collision resolution
            let model = generateNodes(['ecs', 'ecs', 'ecs', ['ecs', 'ecs', 'ecs']]);
            model[1].id = 'n0-1';

            wrapper = await createWrapper({ initialModel: model });
            wrapper.vm.model[0].treeNodeSpec.focusable = true;

            let startingNode = wrapper.find('#grtv-1-n0 .grtvn-self');
            startingNode.trigger('dragstart', eventData);

            let endingNode = wrapper.find('#grtv-1-n2 .grtvn-self-prev-target');
            endingNode.trigger('drop', eventData);
          });

          it('should make a non-focusable uniquely identified copy of the source node', () => {
            expect(wrapper.vm.model.length).to.equal(4);
            expect(wrapper.vm.model[2].id).to.equal('n0-2');
            expect(wrapper.vm.model[2].treeNodeSpec.focusable).to.be.false;
          });
        });

        describe('and the target node is in a different node level than the source node', () => {

          beforeEach(async () => {
            let model = generateNodes(['ecs', 'ecs', 'ecs', ['ecs', 'ecs', 'ecs']]);
            wrapper = await createWrapper({ initialModel: model });

            let startingNode = wrapper.find('#grtv-1-n2n0 .grtvn-self');
            startingNode.trigger('dragstart', eventData);

            let endingNode = wrapper.find('#grtv-1-n1 .grtvn-self-prev-target');
            endingNode.trigger('drop', eventData);
          });

          it('should copy the node to the new location', () => {
            expect(wrapper.vm.model[3].children.length).to.equal(3);
            expect(wrapper.vm.model.length).to.equal(4);
            expect(wrapper.vm.model[1].id).to.equal('n2n0-1');
          });
        });
      });
    });

    describe('and the source tree is different from the destination tree', () => {

      let tree2;

      beforeEach(async () => {
        wrapper = await createWrapper();
        tree2 = await createWrapper(null, { id: 'grtv-2' });

        let startingNode = wrapper.find('#grtv-1-n0 .grtvn-self');
        startingNode.trigger('dragstart', eventData);

        let endingNode = tree2.find('#grtv-2-n0 .grtvn-self-prev-target');
        endingNode.trigger('drop', eventData);

        startingNode.trigger('dragend', eventData);
      });

      afterEach(() => {
        tree2 = null;
      });

      it('should remove the node from the original tree', () => {
        expect(wrapper.vm.model.length).to.equal(2);
      });

      it('should add the node to the new tree', () => {
        expect(tree2.vm.model.length).to.equal(4);
      });
    });

    describe('and node IDs in the dragged data conflict with target tree node IDs', () => {

      let tree2;

      beforeEach(async () => {
        let tree2Data = getDefaultPropsData();

        wrapper = await createWrapper();
        tree2 = await createWrapper(tree2Data, { id: 'grtv-2' });

        // Await here so tree2's ID can trickle down to the nodes' computeds
        await tree2.vm.$nextTick();

        let startingNode = wrapper.find('#grtv-1-n2 .grtvn-self');
        startingNode.trigger('dragstart', eventData);

        let endingNode = tree2.find('#grtv-2-n0 .grtvn-self-prev-target');
        endingNode.trigger('drop', eventData);

        startingNode.trigger('dragend', eventData);
      });

      afterEach(() => {
        tree2 = null;
      });

      it('should assign new IDs to the conflicting nodes', () => {
        expect(tree2.vm.model[0].id).to.equal('n2-1');
        expect(tree2.vm.model[0].children[0].id).to.equal('n2n0-1');
      });
    });
  });

  describe('when a child node has emitted treeViewNodeDragMove', () => {

    beforeEach(async () => {
      wrapper = await createWrapper();
      let node = wrapper.findComponent(TreeViewNode);
      node.vm.$emit('treeNodeDragMove', node.vm.model);
    });

    it('should remove that node from the list of children', () => {
      expect(wrapper.vm.model.length).to.equal(2);
    });
  });
});
