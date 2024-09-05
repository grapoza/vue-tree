import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, Ref, ref } from 'vue';
import { useTreeViewFilter } from './treeViewFilter';
import { generateMetaNodes } from '../../../tests/data/node-generator';
import { TreeViewNodeMetaModel } from 'types/treeView';

function createTestComponent(nodes: Ref<TreeViewNodeMetaModel[]>) {
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

describe('treeViewFilter', () => {

  let nodes: Ref<TreeViewNodeMetaModel[]>;
  let wrapper: ReturnType<typeof createTestComponent>;

  beforeEach(() => {
    nodes = ref(generateMetaNodes(['e', 'ef']));
    //mimic filter matching the sectable nodes
    nodes.value[0]._.state.matchesFilter = true;
    nodes.value[0]._.state.subnodeMatchesFilter = false;
    nodes.value[1]._.state.matchesFilter = true;
    nodes.value[1]._.state.subnodeMatchesFilter = false;
    wrapper = createTestComponent(nodes);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when all nodes are filtered', () => {

    beforeEach(async () => {
      nodes.value[0]._.state.matchesFilter = false;
      nodes.value[1]._.state.matchesFilter = false;
      await flushPromises();
    });

    describe('and then nodes are unfiltered', () => {

      beforeEach(async () => {
        nodes.value[0]._.state.matchesFilter = true;
        await flushPromises();
        vi.runAllTimers();
      });

      it('should set the first node as focusable', () => {
        expect(nodes.value[0].focusable).to.be.true;
      });
    });
  });
});