import { beforeEach, expect, describe, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { useTreeViewNodeFilter } from './treeViewNodeFilter.js';
import { generateMetaNodes } from '../../../tests/data/node-generator.js';
import TreeEvent from '../../enums/event.js';

let emit;

function createTestComponent(node, filterMethod) {
  const TestComponent = defineComponent({
    template: "<div></div>",
    setup() { return useTreeViewNodeFilter(node, emit) }
  });

  const wrapper = mount(TestComponent, {
    global: {
      provide: {
        'filterMethod': filterMethod
      }
    }
  });

  return wrapper;
}

function setChildFilteredState(child, forNode, forSubnodes) {
  // The composable only filters for the current node; in a real tree, each node would have its own watch.
  // Simulate the subnodes states here.
  child._.state.matchesFilter = forNode;
  child._.state.subnodeMatchesFilter = forSubnodes;
}

describe('treeViewNodeFilter.js', () => {

  let node;
  let wrapper;

  beforeEach(() => {
    emit = vi.fn();
  });

  describe('when the filterMethod is set', () => {

    describe('always', () => {

      beforeEach(async () => {
        node = ref(generateMetaNodes(['fe', ['e', 's']])[0]);
        wrapper = createTestComponent(node, (n) => n.expandable);
        setChildFilteredState(node.value.childMetaModels[0], true, false);
        setChildFilteredState(node.value.childMetaModels[1], false, false);
        await flushPromises();
      });

      it('should set isFilteringEnabled to true', () => {
        expect(wrapper.vm.isFilteringEnabled).to.be.true;
      });

      it('should only include subnodes included in the filter in filteredChildren', () => {
        expect(wrapper.vm.filteredChildren.length).to.equal(1);
        expect(wrapper.vm.filteredChildren[0].data.id).to.equal('n0n0');
      });
    });

    describe('and the node matches the filter', () => {

      beforeEach(async () => {
        node = ref(generateMetaNodes(['fe', ['e', 's']])[0]);
        wrapper = createTestComponent(node, (n) => n.expandable);
        await flushPromises();
      });

      it('should set filterIncludesNode to true', () => {
        expect(wrapper.vm.filterIncludesNode).to.be.true;
      });
    });

    describe('and the node does not match the filter', () => {

      beforeEach(async () => {
        node = ref(generateMetaNodes(['fe', ['e', 's']])[0]);
        wrapper = createTestComponent(node, (n) => n.selectable);
        await flushPromises();
      });

      describe('and the node has filtered children', () => {

        beforeEach(async () => {
          setChildFilteredState(node.value.childMetaModels[0], true, false);
          await flushPromises();
        });

        it('should set filterIncludesNode to true', () => {
          expect(wrapper.vm.filterIncludesNode).to.be.true;
        });
      });

      describe('and the node has no filtered children', () => {

        beforeEach(async () => {
          setChildFilteredState(node.value.childMetaModels[0], false, false);
          setChildFilteredState(node.value.childMetaModels[1], false, false);
          await flushPromises();
        });

        it('should set filterIncludesNode to false', () => {
          expect(wrapper.vm.filterIncludesNode).to.be.false;
        });
      });
    });

    describe('and children are loaded', () => {

      describe('and the node has filtered children', () => {

        beforeEach(async () => {
          node = ref(generateMetaNodes(['fe', ['e']])[0]);
          wrapper = createTestComponent(node, (n) => n.expandable);
          setChildFilteredState(node.value.childMetaModels[0], true, false);
          await flushPromises();
        });

        it('should set mayHaveFilteredChildren to true', () => {
          expect(wrapper.vm.mayHaveFilteredChildren).to.be.true;
        });
      });

      describe('and the node has no filtered children', () => {

        beforeEach(async () => {
          node = ref(generateMetaNodes(['fe', ['e']])[0]);
          wrapper = createTestComponent(node, (n) => n.expandable);
          setChildFilteredState(node.value.childMetaModels[0], false, false);
          await flushPromises();
        });

        it('should set mayHaveFilteredChildren to false', () => {
          expect(wrapper.vm.mayHaveFilteredChildren).to.be.false;
        });
      });
    });

    describe('and children are not loaded', () => {

      beforeEach(async () => {
        node = ref(generateMetaNodes(['fe'])[0]);
        node.value.loadChildrenAsync = () => { };
        node.value._.state.areChildrenLoaded = false;
        wrapper = createTestComponent(node, (n) => n.expandable);
        await flushPromises();
      });

      it('should set mayHaveFilteredChildren to true', () => {
        expect(wrapper.vm.mayHaveFilteredChildren).to.be.true;
      });
    });

    describe('and the node changes to not match the filter', () => {

      beforeEach(async () => {
        node = ref(generateMetaNodes(['fe'])[0]);
        wrapper = createTestComponent(node, (n) => n.expandable);
        await flushPromises();
        node.value.expandable = false;
        await flushPromises();
      });

      it('should set the node as not matching the filter', () => {
        expect(node.value._.state.matchesFilter).to.be.false;
      });

      describe('and it is the focused node', () => {

        it('should emit the requestFirstFocus event', () => {
          expect(emit).toHaveBeenCalledWith(TreeEvent.RequestFirstFocus, true);
        });
      });
    });

    describe('and the node changes to match the filter', () => {

      beforeEach(async () => {
        node = ref(generateMetaNodes(['f'])[0]);
        wrapper = createTestComponent(node, (n) => n.expandable);
        await flushPromises();
        node.value.expandable = true;
        await flushPromises();
      });

      it('should set the node as matching the filter', () => {
        expect(node.value._.state.matchesFilter).to.be.true;
      });
    });
  });

  describe('when the filterMethod is not set', () => {

    beforeEach(async () => {
      node = ref(generateMetaNodes(['fe', ['e', 's']])[0]);
      wrapper = createTestComponent(node, null);

      // The composable only filters for the current node; in a real tree, each node would have it's own watch.
      // Simulate the subnodes states here.
      node.value.childMetaModels[0]._.state.matchesFilter = true;
      node.value.childMetaModels[0]._.state.subnodeMatchesFilter = false;
      node.value.childMetaModels[1]._.state.matchesFilter = false;
      node.value.childMetaModels[1]._.state.subnodeMatchesFilter = false;

      await flushPromises();
    });

    it('should set isFilteringEnabled to false', () => {
      expect(wrapper.vm.isFilteringEnabled).to.be.false;
    });
  });
});