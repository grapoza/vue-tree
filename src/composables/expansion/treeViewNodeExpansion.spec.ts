import { flushPromises, mount } from '@vue/test-utils';
import { ComponentPublicInstance, defineComponent, Ref, ref } from 'vue';
import { useTreeViewNodeExpansion } from './treeViewNodeExpansion';
import { generateMetaNodes } from '../../../tests/data/node-generator';
import { TreeEvent } from '../../types/event';
import { Mock } from 'vitest';
import { TreeViewNodeMetaModel } from 'types/treeView';

let emit: Mock<ComponentPublicInstance['$emit']>;

function createTestComponent(node: Ref<TreeViewNodeMetaModel>) {
  const TestComponent = defineComponent({
    template: "<div></div>",
    setup() { return useTreeViewNodeExpansion(node, emit) }
  });

  const wrapper = mount(TestComponent, {
    global: {
      provide: {
        'filterMethod': null
      }
    }
  });

  return wrapper;
}

describe('treeViewNodeExpansion', () => {

  beforeEach(() => {
    emit = vi.fn();
  });

  describe('when getting the aria-expanded value', () => {

    describe('and the node is not expandable', () => {

      it('should return undefined', () => {
        const node = ref(generateMetaNodes(["s"])[0]);
        const wrapper = createTestComponent(node);
        expect(wrapper.vm.ariaExpanded).to.be.undefined;
      })
    });

    describe('and the node is expandable', () => {

      describe('and the node is not expanded', () => {

        it('should return false', () => {
          const node = ref(generateMetaNodes(['es', ['s']])[0]);
          const wrapper = createTestComponent(node);
          expect(wrapper.vm.ariaExpanded).to.be.false;
        });
      });

      describe('and the node is expanded', () => {

        it('should return true', () => {
          const node = ref(generateMetaNodes(['Es', ['s']])[0]);
          const wrapper = createTestComponent(node);
          expect(wrapper.vm.ariaExpanded).to.be.true;
        });
      });
    });
  });

  describe('when checking if a node can expand', () => {

    describe('and the node does not have children', () => {

      it('should return false', () => {
        const node = ref(generateMetaNodes(['es'])[0]);
        const wrapper = createTestComponent(node);
        expect(wrapper.vm.canExpand).to.be.false;
      });
    });

    describe('and the node is not expandable', () => {

      it('should return false', () => {
        const node = ref(generateMetaNodes(['s', ['s']])[0]);
        const wrapper = createTestComponent(node);
        expect(wrapper.vm.canExpand).to.be.false;
      });
    });

    describe('and the node is expandable and may have children', () => {

      it('should return true', () => {
        const node = ref(generateMetaNodes(['es', ['s']])[0]);
        const wrapper = createTestComponent(node);
        expect(wrapper.vm.canExpand).to.be.true;
      });
    });
  });

  describe('when the expanded state changes', () => {

    it('should emit the expanded event', async () => {
      const node = ref(generateMetaNodes(['es', ['s']])[0]);
      createTestComponent(node);
      node.value.state.expanded = true;
      await flushPromises();
      expect(emit).toHaveBeenCalledWith(TreeEvent.ExpandedChange, node.value);
    });
  });

  describe('when checking if the node is expandable', () => {

    describe('and the node is expandable', () => {

      it('should return true', () => {
        const node = ref(generateMetaNodes(['es'])[0]);
        const wrapper = createTestComponent(node);
        expect(wrapper.vm.isNodeExpandable()).to.be.true;
      });
    });

    describe('and the node is not expandable', () => {

      it('should return false', () => {
        const node = ref(generateMetaNodes(['s'])[0]);
        const wrapper = createTestComponent(node);
        expect(wrapper.vm.isNodeExpandable()).to.be.false;
      });
    });
  });

  describe('when checking if the node is expanded', () => {

    describe('and the node is expanded', () => {

      it('should return true', () => {
        const node = ref(generateMetaNodes(['Es'])[0]);
        const wrapper = createTestComponent(node);
        expect(wrapper.vm.isNodeExpanded()).to.be.true;
      });
    });

    describe('and the node is not expanded', () => {

      it('should return false', () => {
        const node = ref(generateMetaNodes(['es'])[0]);
        const wrapper = createTestComponent(node);
        expect(wrapper.vm.isNodeExpanded()).to.be.false;
      });
    });
  });

  describe('when collapsing the node', () => {

    describe('and the node is expanded', () => {

      it('should set the node as not expanded', () => {
        const node = ref(generateMetaNodes(['Es', ['s']])[0]);
        const wrapper = createTestComponent(node);
        wrapper.vm.collapseNode();
        expect(node.value.state.expanded).to.be.false;
      });

      it('should return true', () => {
        const node = ref(generateMetaNodes(['Es', ['s']])[0]);
        const wrapper = createTestComponent(node);
        expect(wrapper.vm.collapseNode()).to.be.true;
      });
    });

    describe('and the node is not expanded', () => {

      it('should return false', () => {
        const node = ref(generateMetaNodes(['es', ['s']])[0]);
        const wrapper = createTestComponent(node);
        expect(wrapper.vm.collapseNode()).to.be.false;
      });
    });
  });

  describe('when expanding the node', () => {

    describe('and the node is expanded', () => {

      it('should return false', () => {
        const node = ref(generateMetaNodes(['Es', ['s']])[0]);
        const wrapper = createTestComponent(node);
        expect(wrapper.vm.expandNode()).to.be.false;
      });
    });

    describe('and the node is not expanded', () => {

      it('should set the node as expanded', () => {
        const node = ref(generateMetaNodes(['es', ['s']])[0]);
        const wrapper = createTestComponent(node);
        wrapper.vm.expandNode();
        expect(node.value.state.expanded).to.be.true;
      });

      it('should return true', () => {
        const node = ref(generateMetaNodes(['es', ['s']])[0]);
        const wrapper = createTestComponent(node);
        expect(wrapper.vm.expandNode()).to.be.true;
      });
    });
  });

  describe('when toggling the node expansion', () => {

    describe('and the node is expanded', () => {

      it('should set the node as not expanded', () => {
        const node = ref(generateMetaNodes(['Es', ['s']])[0]);
        const wrapper = createTestComponent(node);
        wrapper.vm.toggleNodeExpanded();
        expect(node.value.state.expanded).to.be.false;
      });
    });

    describe('and the node is not expanded', () => {

      it('should set the node as expanded', () => {
        const node = ref(generateMetaNodes(['es', ['s']])[0]);
        const wrapper = createTestComponent(node);
        wrapper.vm.toggleNodeExpanded();
        expect(node.value.state.expanded).to.be.true;
      });
    });
  });
});