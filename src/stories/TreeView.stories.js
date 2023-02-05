import TreeView from '../components/TreeView.vue';
import ExamplesDocs from './Examples.docs.mdx';

// Default export to define the component =====================================

export default {
  title: 'Examples/TreeView',
  component: TreeView,
  argTypes: {
    initialModel: {
      description:
        "The actual tree data",
    },
    skinClass: {
      description:
        "A class added to the top-most element; used in CSS selectors for all of the component's styles",
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

export { Basic } from './definitions/TreeView.Basic';
export { Static } from './definitions/TreeView.Static';
export { SettingDefaults } from './definitions/TreeView.SettingDefaults';
export { Checkboxes } from './definitions/TreeView.Checkboxes';
export { Radiobuttons } from './definitions/TreeView.Radiobuttons';
export { Slots } from './definitions/TreeView.Slots';
export { AddRemove } from './definitions/TreeView.AddRemove';
export { Selection } from './definitions/TreeView.Selection';
export { Async } from './definitions/TreeView.Async';
export { DragDrop } from './definitions/TreeView.DragDrop';
export { Filtering } from './definitions/TreeView.Filtering';
export { ClassCustomization, SkinCustomization } from './definitions/TreeView.Customization';