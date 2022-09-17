import TreeView from '../../components/TreeView.vue';

const Template = (args) => ({
  components: { TreeView },
  setup() {
    return { args };
  },
  template: '<tree-view v-bind="args" />'
});

// CLASS BASED CUSTOMIZATIONS -----------------------------------------------------

export const ClassCustomization = Template.bind({});
ClassCustomization.args = {
  initialModel: [
    {
      id: 'customization-class-rootNode',
      label: 'Root Node',
      children: [
        {
          id: 'customization-class-subNode',
          label: 'Subnode'
        }
      ]
    }
  ],
  modelDefaults: {
    addChildCallback: addChildCallback,
    customizations: {
      classes: {
        treeViewNodeSelf: 'large-line',
        treeViewNodeSelfText: 'big-text'
      }
    }
  },
};

let classChildCounter = 0;
async function addChildCallback(parentModel) {
  classChildCounter++;
  return Promise.resolve({ id: `customization-class-child-node${this.childCounter}`, label: `Added Child ${this.childCounter} of ${parentModel.id}`, treeNodeSpec: { deletable: true } });
}

const docClassSourceCode = `
<template>
  <tree-view :initial-model="tvModel" :model-defaults="modelDefaults"></tree-view>
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";

const tvModel = ref([
    {
      id: 'customization-class-rootNode',
      label: 'Root Node',
      children: [
        {
          id: 'customization-class-subNode',
          label: 'Subnode'
        }
      ]
    }
  ]
);

const modelDefaults = ref({
    addChildCallback: addChildCallback,
    customizations: {
      classes: {
        treeViewNodeSelf: 'large-line',
        treeViewNodeSelfText: 'big-text'
      }
    }
  }
);

let classChildCounter = 0;
async function addChildCallback(parentModel) {
  classChildCounter++;
  return Promise.resolve({ id: \`customization-class- child - node\${ this.childCounter } \`, label: \`Added Child \${ this.childCounter } of \${ parentModel.id }\`, treeNodeSpec: { deletable: true } });
}

</script>`;

ClassCustomization.parameters = {
  docs: {
    source: {
      code: docClassSourceCode,
      language: "html",
      type: "auto",
    },
  },
};

// SKIN BASED CUSTOMIZATIONS ------------------------------------------------------

export const SkinCustomization = Template.bind({});
SkinCustomization.args = {
  initialModel: [
    {
      id: 'customization-skin-rootNode',
      label: 'Root Node',
      children: [
        {
          id: 'customization-skin-subNode',
          label: 'Subnode'
        }
      ]
    }
  ],
  modelDefaults: {
    addChildCallback: addSkinChildCallback,
    customizations: {
      classes: {
        treeViewNodeSelfExpander: 'action-button',
        treeViewNodeSelfExpandedIndicator: 'fas fa-chevron-right',
        treeViewNodeSelfAction: 'action-button',
        treeViewNodeSelfAddChildIcon: 'fas fa-plus-circle',
        treeViewNodeSelfDeleteIcon: 'fas fa-minus-circle'
      }
    }
  },
  skinClass: 'grayscale'
};

let skinChildCounter = 0;
async function addSkinChildCallback(parentModel) {
  skinChildCounter++;
  return Promise.resolve({ id: `customization-skin-child-node${this.childCounter}`, label: `Added Child ${this.childCounter} of ${parentModel.id}`, treeNodeSpec: { deletable: true } });
}

const docSkinSourceCode = `
<template>
  <tree-view :initial-model="tvModel" :model-defaults="modelDefaults" :skin-class="skinClass"></tree-view>
</template>
<script setup>
import { ref } from "vue";
import TreeView from "../../src/components/TreeView.vue";

const tvModel = ref([
    {
      id: 'customization-skin-rootNode',
      label: 'Root Node',
      children: [
        {
          id: 'customization-skin-subNode',
          label: 'Subnode'
        }
      ]
    }
  ]
);

const modelDefaults = ref({
    addChildCallback: addSkinChildCallback,
    customizations: {
      classes: {
        treeViewNodeSelfExpander: 'action-button',
        treeViewNodeSelfExpandedIndicator: 'fas fa-chevron-right',
        treeViewNodeSelfAction: 'action-button',
        treeViewNodeSelfAddChildIcon: 'fas fa-plus-circle',
        treeViewNodeSelfDeleteIcon: 'fas fa-minus-circle'
      }
    }
  }
);

const skinClass - ref("grayscale");

let classChildCounter = 0;
async function addChildCallback(parentModel) {
  classChildCounter++;
  return Promise.resolve({ id: \`customization-class-child-node\${ this.childCounter } \`, label: \`Added Child \${ this.childCounter } of \${ parentModel.id }\`, treeNodeSpec: { deletable: true } });
}

</script>`;

SkinCustomization.parameters = {
  docs: {
    source: {
      code: docSkinSourceCode,
      language: "html",
      type: "auto",
    },
  },
};