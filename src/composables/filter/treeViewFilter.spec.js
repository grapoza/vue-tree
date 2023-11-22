import { beforeEach, expect, describe, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { useTreeViewFilter } from './treeViewFilter.js';
import { useNodeGenerator } from '../../../tests/data/node-generator.js';

const { generateNodes } = useNodeGenerator();

function createTestComponent(nodes) {
  const TestComponent = defineComponent({
    template: "<div></div>",
    setup() { return useTreeViewFilter(nodes) }
  });

  const wrapper = mount(TestComponent, {
    global: {
      provide: {
        'filterMethod': null // unused here; the composable just reacts to state this sets elsewhere
      }
    }
  });

  return wrapper;
}

describe('treeViewFilter.js', () => {

  let nodes;
  let wrapper;

  beforeEach(() => {
    nodes = ref(generateNodes(['e', 'ef']));
    //mimic filter matching the sectable nodes
    nodes.value[0].treeNodeSpec._.state.matchesFilter = true;
    nodes.value[0].treeNodeSpec._.state.subnodeMatchesFilter = false;
    nodes.value[1].treeNodeSpec._.state.matchesFilter = true;
    nodes.value[1].treeNodeSpec._.state.subnodeMatchesFilter = false;
    wrapper = createTestComponent(nodes);
  });

  describe('when all nodes are filtered', () => {

    beforeEach(async () => {
      nodes.value[0].treeNodeSpec._.state.matchesFilter = false;
      nodes.value[1].treeNodeSpec._.state.matchesFilter = false;
      await flushPromises();
    });

    describe('and then nodes are unfiltered', () => {

      beforeEach(async () => {
        nodes.value[0].treeNodeSpec._.state.matchesFilter = true;
        await flushPromises();
      });

      it('should set the first node as focusable', () => {
        expect(nodes.value[0].treeNodeSpec.focusable).to.be.true;
      });
    });
  });
});