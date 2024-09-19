import { mount } from '@vue/test-utils';
import TreeViewNode from '../../components/TreeViewNode.vue';
import { generateMetaNodes } from '../../../tests/data/node-generator';
import { DropEffect, EffectAllowed } from '../../types/dragDrop';
import { MimeType } from '../../types/mimeType';
import { TreeViewNodeMetaModel } from 'types/treeView';

const serializedNodeData = '{"data":{"id":"n0","label":"Node 0","children":[]},"childMetaModels":[],"_":{"dragging":false,"state":{"areChildrenLoaded":true,"areChildrenLoading":false,"matchesFilter":true,"subnodeMatchesFilter":false}},"childrenProperty":"children","idProperty":"id","labelProperty":"label","loadChildrenAsync":null,"expandable":false,"selectable":true,"deletable":false,"focusable":false,"input":{"type":"checkbox","name":"n0-cbx"},"state":{"expanded":false,"selected":false,"input":{"disabled":false,"value":false}},"addChildCallback":null,"draggable":false,"allowDrop":false,"dataTransferEffectAllowed":"copyMove","deleteNodeCallback":null,"title":null,"expanderTitle":null,"addChildTitle":null,"deleteTitle":null,"customizations":{}}';

let wrapper: ReturnType<typeof mount<typeof TreeViewNode>>;

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
    modelValue: generateMetaNodes(["csf"])[0],
    'update:modelValue': (e: TreeViewNodeMetaModel) => wrapper!.setProps({ modelValue: e }),
    modelDefaults: () => ({}),
    depth: 0,
    treeId: 'tree-id',
    initialRadioGroupValues: {},
    isMounted: false
  }
};

let elem: HTMLDivElement;

function createWrapper(customPropsData?: object, customAttrs?: Record<string, unknown>) {
  // https://vue-test-utils.vuejs.org/api/options.html#attachtodocument
  elem = document.createElement('div');
  if (document.body) {
    document.body.appendChild(elem);
  }

  return mount(TreeViewNode, {
    sync: false,
    props: Object.assign(getDefaultPropsData(), customPropsData ?? {}),
    attrs: customAttrs,
    attachTo: elem,
    global: {
      provide: {
        filterMethod: null
      }
    }
  });
};

describe('TreeViewNode.vue (Drag and Drop)', () => {

  let eventData: { dataTransfer: { [key: string]: any } };

  beforeEach(() => {
    eventData = {
      dataTransfer: {
        dropEffect: DropEffect.Move,
        getData: function (mime: MimeType) { return this.privateData[mime]; },
        setData: function (mime: MimeType, value: any) {
          this.privateData[mime] = value;
          this.types.push(mime);
        },
        types: [] as MimeType[],
        privateData: {} as { [key: string]: any },
      },
    };
  });

  afterEach(() => {
    elem.remove();
  });

  describe('when a node is starting to get dragged', () => {

    describe('always', () => {

      beforeEach(() => {
        wrapper = createWrapper();
        let node = wrapper.find('.grtvn-self');
        node.trigger('dragstart', eventData);
      });

      it('should mark the node as being dragged', () => {
        expect(wrapper.find('.grtvn-dragging').exists()).to.be.true;
      });

      it('should set the MimeType.TreeViewNode data to a wrapped serialized node', () => {
        expect(eventData.dataTransfer.getData(MimeType.TreeViewNode)).to.equal(`{"treeId":"tree-id","data":${serializedNodeData}}`);
      });

      it('should set the MimeType.Json data to a wrapped serialized node', () => {
        expect(eventData.dataTransfer.getData(MimeType.Json)).to.equal(serializedNodeData);
      });

      it('should set the MimeType.PlainText data to a wrapped serialized node', () => {
        expect(eventData.dataTransfer.getData(MimeType.PlainText)).to.equal(serializedNodeData);
      });

      it('should set the focusable attribute to false for the serialized node', () => {
        expect(eventData.dataTransfer.getData(MimeType.Json)).to.contain('"focusable":false');
      });
    });

    describe('and the node specifies an allowed dataTransferEffectAllowed property', () => {

      beforeEach(() => {
        const nodeModel = generateMetaNodes(['ecs', ['ecs']])[0];
        nodeModel.dataTransferEffectAllowed = EffectAllowed.Move;
        wrapper = createWrapper(Object.assign(getDefaultPropsData(), {
          modelValue: nodeModel
        }));
        let node = wrapper.find('.grtvn-self');
        node.trigger('dragstart', eventData);
      });

      it('should set the event.dataTransfer.effectAllowed to that value', () => {
        expect(eventData.dataTransfer.effectAllowed).to.equal(EffectAllowed.Move);
      });
    });

    describe('and the node specifies a disallowed dataTransferEffectAllowed property', () => {

      beforeEach(() => {
        const nodeModel = generateMetaNodes(['ecs', ['ecs']])[0];
        nodeModel.dataTransferEffectAllowed = EffectAllowed.Link;
        wrapper = createWrapper(Object.assign(getDefaultPropsData(), {
          modelValue: nodeModel
        }));
        let node = wrapper.find('.grtvn-self');
        node.trigger('dragstart', eventData);
      });

      it('should set the event.dataTransfer.effectAllowed to CopyMove', () => {
        expect(eventData.dataTransfer.effectAllowed).to.equal(EffectAllowed.CopyMove);
      });
    });

    describe('and the node specifies an invalid dataTransferEffectAllowed property', () => {

      beforeEach(() => {
        const nodeModel = generateMetaNodes(['ecs', ['ecs']])[0];
        nodeModel.dataTransferEffectAllowed = 'cow' as EffectAllowed;
        wrapper = createWrapper(Object.assign(getDefaultPropsData(), {
          modelValue: nodeModel
        }));
        let node = wrapper.find('.grtvn-self');
        node.trigger('dragstart', eventData);
      });

      it('should set the event.dataTransfer.effectAllowed to CopyMove', () => {
        expect(eventData.dataTransfer.effectAllowed).to.equal(EffectAllowed.CopyMove);
      });
    });
  });

  describe('when a node is entered by a drag operation', () => {

    beforeEach(() => {
      wrapper = createWrapper();
      eventData.dataTransfer.setData(MimeType.TreeViewNode, `{"treeId":"tree-id","data":${serializedNodeData}}`);
    });

    describe('and the node is a valid drop target', () => {

      beforeEach(() => {
        wrapper.vm.modelValue.allowDrop = true;
      });

      it('should mark the node as a drop target', async () => {
        let node = wrapper.find('.grtvn-self');
        node.trigger('dragenter', eventData);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.grtvn-self-drop-target').exists()).to.be.true;
      });

      describe('and the event occurs on the node itself', () => {

        beforeEach(async () => {
          let node = wrapper.find('.grtvn-self');
          node.trigger('dragenter', eventData);
          await wrapper.vm.$nextTick();
        });

        it('should mark the node as an affected drop target', () => {
          expect(wrapper.find('.grtvn-self-child-drop-target').exists()).to.be.true;
        });
      });

      describe('and the event occurs on the prev node target', () => {

        beforeEach(async () => {
          let node = wrapper.find('.grtvn-self-prev-target');
          node.trigger('dragenter', eventData);
          await wrapper.vm.$nextTick();
        });

        it('should mark the prev drop target as an affected drop target', () => {
          expect(wrapper.find('.grtvn-self-prev-target.grtvn-self-sibling-drop-target-hover').exists()).to.be.true;
        });
      });

      describe('and the event occurs on the next node target', () => {

        beforeEach(async () => {
          let node = wrapper.find('.grtvn-self-prev-target');
          node.trigger('dragenter', eventData);
          await wrapper.vm.$nextTick();
        });

        it('should mark the next drop target as an affected drop target', () => {
          expect(wrapper.find('.grtvn-self-prev-target.grtvn-self-sibling-drop-target-hover').exists()).to.be.true;
        });
      });
    });

    describe('and the node is not a valid drop target', () => {

      it('should not mark the node as a drop target', async () => {
        let node = wrapper.find('.grtvn-self');
        node.trigger('dragenter', eventData);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.grtvn-self-drop-target').exists()).to.be.false;
      });
    });
  });

  describe('when a node is moved through by a drag operation', () => {

    beforeEach(() => {
      wrapper = createWrapper();
      eventData.dataTransfer.setData(MimeType.TreeViewNode, `{"treeId":"tree-id","data":${serializedNodeData}}`);
    });

    describe('and the node is a valid drop target', () => {

      beforeEach(() => {
        wrapper.vm.modelValue.allowDrop = true;
      });

      it('should mark the node as a drop target', async () => {
        let node = wrapper.find('.grtvn-self');
        node.trigger('dragover', eventData);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.grtvn-self-drop-target').exists()).to.be.true;
      });

      describe('and the event occurs on the node itself', () => {

        beforeEach(async () => {
          let node = wrapper.find('.grtvn-self');
          node.trigger('dragover', eventData);
          await wrapper.vm.$nextTick();
        });

        it('should mark the node as an affected drop target', () => {
          expect(wrapper.find('.grtvn-self-child-drop-target').exists()).to.be.true;
        });
      });

      describe('and the event occurs on the prev node target', () => {

        beforeEach(async () => {
          let node = wrapper.find('.grtvn-self-prev-target');
          node.trigger('dragover', eventData);
          await wrapper.vm.$nextTick();
        });

        it('should mark the prev drop target as an affected drop target', () => {
          expect(wrapper.find('.grtvn-self-prev-target.grtvn-self-sibling-drop-target-hover').exists()).to.be.true;
        });
      });

      describe('and the event occurs on the next node target', () => {

        beforeEach(async () => {
          let node = wrapper.find('.grtvn-self-next-target');
          node.trigger('dragover', eventData);
          await wrapper.vm.$nextTick();
        });

        it('should mark the next drop target as an affected drop target', () => {
          expect(wrapper.find('.grtvn-self-next-target.grtvn-self-sibling-drop-target-hover').exists()).to.be.true;
        });
      });
    });

    describe('and the node is not a valid drop target', () => {

      it('should not mark the node as a drop target', async () => {
        let node = wrapper.find('.grtvn-self');
        node.trigger('dragenter', eventData);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.grtvn-self-drop-target').exists()).to.be.false;
      });
    });
  });

  describe('when a node is exited by a drag operation', () => {

    beforeEach(() => {
      wrapper = createWrapper();
      wrapper.vm.modelValue.allowDrop = true;
      eventData.dataTransfer.setData(MimeType.TreeViewNode, `{"treeId":"tree-id","data":${serializedNodeData}}`);
    });

    describe('and the drag leaves the node itself', () => {

      beforeEach(async () => {
        let node = wrapper.find('.grtvn-self');
        node.trigger('dragenter', eventData);
        node.trigger('dragleave', eventData);
        await wrapper.vm.$nextTick();
      });

      it('should unmark the node as an affected drop target', () => {
        expect(wrapper.find('.grtvn-self-child-drop-target').exists()).to.be.false;
      });
    });

    describe('and the drag leaves the prev node drop zone', () => {

      beforeEach(async () => {
        let node = wrapper.find('.grtvn-self-prev-target');
        node.trigger('dragenter', eventData);
        node.trigger('dragleave', eventData);
        await wrapper.vm.$nextTick();
      });

      it('should unmark the prev drop target as an affected drop target', () => {
        expect(wrapper.find('.grtvn-self-prev-target.grtvn-self-sibling-drop-target-hover').exists()).to.be.false;
      });
    });

    describe('and the drag leaves the next node drop zone', () => {

      beforeEach(async () => {
        let node = wrapper.find('.grtvn-self-next-target');
        node.trigger('dragenter', eventData);
        node.trigger('dragleave', eventData);
        await wrapper.vm.$nextTick();
      });

      it('should unmark the next drop target as an affected drop target', () => {
        expect(wrapper.find('.grtvn-self-next-target.grtvn-self-sibling-drop-target-hover').exists()).to.be.false;
      });
    });
  });

  describe('when a drop occurs on the node', () => {

    beforeEach(() => {
      wrapper = createWrapper();
      wrapper.vm.modelValue.allowDrop = true;
      eventData.dataTransfer.setData(MimeType.TreeViewNode, `{"treeId":"tree-id","data":${serializedNodeData}}`);
    });

    describe('always', () => {

      beforeEach(async () => {
        let node = wrapper.find('.grtvn-self');
        node.trigger('dragenter', eventData);
        node.trigger('drop', eventData);
        await wrapper.vm.$nextTick();
      });

      it('should emit a treeNodeDrop event', () => {
        expect(wrapper.emitted().treeNodeDrop.length).to.equal(1);
      });

      it('should include the dropped model data in the treeNodeDrop event', () => {
        expect((wrapper.emitted().treeNodeDrop as any)[0][0].droppedModel).to.eql(JSON.parse(serializedNodeData));
      });

      it('should include the target model in the treeNodeDrop event', () => {
        expect((wrapper.emitted().treeNodeDrop as any)[0][0].targetModel).to.eql(wrapper.vm.modelValue);
      });

      it('should include the drop effect in the treeNodeDrop event', () => {
        expect((wrapper.emitted().treeNodeDrop as any)[0][0].dropEffect).to.eql(eventData.dataTransfer.dropEffect);
      });

      it('should unmark the node as a drop target', () => {
        expect(wrapper.find('.grtvn-self-drop-target').exists()).to.be.false;
      });
    });

    describe('and the source tree is the same as the destination tree', () => {

      beforeEach(async () => {
        let node = wrapper.find('.grtvn-self');
        node.trigger('drop', eventData);
        await wrapper.vm.$nextTick();
      });

      it('should have isSameTree === true in the treeNodeDrop event', () => {
        expect((wrapper.emitted().treeNodeDrop as any)[0][0].isSameTree).to.be.true;
      });
    });

    describe('and the source tree is not the same as the destination tree', () => {

      beforeEach(async () => {
        eventData.dataTransfer.setData(MimeType.TreeViewNode, `{"treeId":"different-tree-id","data":${serializedNodeData}}`);
        let node = wrapper.find('.grtvn-self');
        node.trigger('drop', eventData);
        await wrapper.vm.$nextTick();
      });

      it('should have isSameTree === false in the treeNodeDrop event', () => {
        expect((wrapper.emitted().treeNodeDrop as any)[0][0].isSameTree).to.be.false;
      });
    });

    describe('and the drop is on the node itself', () => {

      beforeEach(async () => {
        let node = wrapper.find('.grtvn-self');
        node.trigger('dragenter', eventData);
        node.trigger('drop', eventData);
        await wrapper.vm.$nextTick();
      });

      it('should include the children of the current node as the sibling node set in the treeNodeDrop event', () => {
        expect((wrapper.emitted().treeNodeDrop as any)[0][0].siblingNodeSets).to.eql({
          nodes: wrapper.vm.modelValue.data.children,
          metaNodes: wrapper.vm.modelValue.childMetaModels,
        });
      });

      it('should unmark the node as an affected drop target', () => {
        expect(wrapper.find('.grtvn-self-child-drop-target').exists()).to.be.false;
      });
    });

    describe('and the drop is on the prev node drop zone', () => {

      beforeEach(async () => {
        let node = wrapper.find('.grtvn-self-prev-target');
        node.trigger('dragenter', eventData);
        node.trigger('drop', eventData);
        await wrapper.vm.$nextTick();
      });

      it('should have a null sibling node set in the treeNodeDrop event', () => {
        expect((wrapper.emitted().treeNodeDrop as any)[0][0].siblingNodeSets).to.be.null;
      });

      it('should unmark the prev drop target as an affected drop target', () => {
        expect(wrapper.find('.grtvn-self-prev-target.grtvn-self-sibling-drop-target-hover').exists()).to.be.false;
      });
    });

    describe('and the drop is on the next node drop zone', () => {

      beforeEach(async () => {
        let node = wrapper.find('.grtvn-self-next-target');
        node.trigger('dragenter', eventData);
        node.trigger('drop', eventData);
        await wrapper.vm.$nextTick();
      });

      it('should have a null sibling node set in the treeNodeDrop event', () => {
        expect((wrapper.emitted().treeNodeDrop as any)[0][0].siblingNodeSets).to.be.null;
      });

      it('should unmark the next drop target as an affected drop target', () => {
        expect(wrapper.find('.grtvn-self-next-target.grtvn-self-sibling-drop-target-hover').exists()).to.be.false;
      });
    });
  });

  describe('when dragging ends', () => {

    describe('and it was a Move operation', () => {

      beforeEach(() => {
        eventData.dataTransfer.dropEffect = DropEffect.Move;
      });

      describe('and the node was dropped in the original tree', () => {

        beforeEach(() => {
          wrapper = createWrapper();
          wrapper.vm.modelValue._.dragMoved = true;
          let node = wrapper.find('.grtvn-self');
          node.trigger('dragend', eventData);
        });

        it('should do nothing, having delegated move operations to the TreeView', () => {
          expect(wrapper.emitted().length).to.be.undefined;
        });
      });

      describe('and the node was dropped in a different tree', () => {

        beforeEach(() => {
          wrapper = createWrapper();
          let node = wrapper.find('.grtvn-self');
          node.trigger('dragend', eventData);
        });

        it('should emit a treeViewNodeDragMove', () => {
          expect(wrapper.emitted().treeNodeDragMove.length).to.equal(1);
          expect((wrapper.emitted().treeNodeDragMove as any)[0][0]).to.eql(wrapper.vm.modelValue);
        });
      });
    });

    describe('and it was a Copy operation', () => {

      beforeEach(() => {
        eventData.dataTransfer.dropEffect = DropEffect.Copy;
        wrapper = createWrapper();
        let node = wrapper.find('.grtvn-self');
        node.trigger('dragend', eventData);
      });

      it('should unmark all drop targets', () => {
        expect(wrapper.find('.grtvn-self-sibling-drop-target-hover').exists()).to.be.false;
        expect(wrapper.find('.grtvn-self-drop-target').exists()).to.be.false;
        expect(wrapper.find('.grtvn-self-child-drop-target').exists()).to.be.false;
      });

      it('should unmark the node as being dragged', () => {
        expect(wrapper.find('.grtvn-dragging').exists()).to.be.false;
      });
    });
  });

  describe('when a child node has emitted a treeViewNodeDragMove event', () => {

    beforeEach(() => {
      wrapper = createWrapper(Object.assign(getDefaultPropsData(), {
        modelValue: generateMetaNodes(['ecs', ['ecs']])[0]
      }));

      let node = wrapper.findAllComponents(TreeViewNode)[0];
      node.vm.$emit('treeNodeDragMove', node.vm.modelValue);
    });

    it('should remove that node from the list of children', () => {
      expect(wrapper.vm.modelValue.data.children.length).to.equal(0);
    });
  });

  describe('when a child node has emitted a treeNodeDrop event', () => {

    describe('always', () => {

      beforeEach(() => {
        wrapper = createWrapper(Object.assign(getDefaultPropsData(), {
          modelValue: generateMetaNodes(['ecs', ['ecs']])[0]
        }));
        wrapper.vm.modelValue.allowDrop = true;
        eventData.dataTransfer.setData(MimeType.TreeViewNode, `{"treeId":"tree-id","data":${serializedNodeData}}`);

        let node = wrapper.findAllComponents(TreeViewNode)[0].find('.grtvn-self');
        node.trigger('drop', eventData);
      });

      it('should re-emit the event', () => {
        expect(wrapper.emitted().treeNodeDrop.length).to.equal(1);
      });
    });

    describe('when the event does not have a sibling node set populated', () => {

      beforeEach(() => {
        wrapper = createWrapper(Object.assign(getDefaultPropsData(), {
          modelValue: generateMetaNodes(['ecs', ['ecs']])[0]
        }));
        wrapper.vm.modelValue.allowDrop = true;
        eventData.dataTransfer.setData(MimeType.TreeViewNode, `{"treeId":"tree-id","data":${serializedNodeData}}`);

        let node = wrapper.findAllComponents(TreeViewNode)[0].find('.grtvn-self-prev-target');
        node.trigger('drop', eventData);
      });

      it('should populate the sibling node set with its children', () => {
        expect((wrapper.emitted().treeNodeDrop as any)[0][0].siblingNodeSets).to.eql({
          nodes: wrapper.vm.modelValue.data.children,
          metaNodes: wrapper.vm.modelValue.childMetaModels,
        });
      });
    });
  });
});