import TreeGrid from '../components/TreeGrid.vue';
import ExamplesDocs from './TreeGridExamples.docs.mdx';

// Default export to define the component =====================================

export default {
  title: 'Examples/TreeGrid',
  component: TreeGrid,
  argTypes: {
    expanderColumnIndex: {
      description:
        "The index of the column that controls expansion",
    },
    initialModel: {
      description:
        "The actual tree data",
    },
  },
  parameters: {
    controls: { sort: "requiredFirst" },
    docs: {
      page: ExamplesDocs,
    },
  },
};

// Stories ====================================================================

export { Basic } from './definitions/TreeGrid.Basic';