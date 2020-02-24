<template>
  <ul class="tree-view"
      :class="skinClass"
      role="tree"
      :aria-multiselectable="ariaMultiselectable">
    <tree-view-node v-for="(nodeModel) in model"
                    :key="nodeModel[nodeModel.treeNodeSpec && nodeModel.treeNodeSpec.idProperty ? nodeModel.treeNodeSpec.idProperty : 'id']"
                    :aria-key-map="ariaKeyMap"
                    :depth="0"
                    :model-defaults="modelDefaults"
                    :initial-model="nodeModel"
                    :selection-mode="selectionMode"
                    :tree-id="uniqueId"
                    :radio-group-values="radioGroupValues"
                    @treeViewNodeClick="(t, e)=>$emit('treeViewNodeClick', t, e)"
                    @treeViewNodeDblclick="(t, e)=>$emit('treeViewNodeDblclick', t, e)"
                    @treeViewNodeCheckboxChange="(t, e)=>$emit('treeViewNodeCheckboxChange', t, e)"
                    @treeViewNodeRadioChange="(t, e)=>$emit('treeViewNodeRadioChange', t, e)"
                    @treeViewNodeExpandedChange="(t, e)=>$emit('treeViewNodeExpandedChange', t, e)"
                    @treeViewNodeSelectedChange="(t, e)=>$_treeView_handleNodeSelectedChange(t, e)"
                    @treeViewNodeAdd="(t, p, e)=>$emit('treeViewNodeAdd', t, p, e)"
                    @treeViewNodeDelete="(t, e)=>$_treeView_handleChildDeletion(t, e)"
                    @treeViewNodeAriaFocusable="$_treeViewAria_handleFocusableChange"
                    @treeViewNodeAriaRequestFirstFocus="$_treeViewAria_focusFirstNode"
                    @treeViewNodeAriaRequestLastFocus="$_treeViewAria_focusLastNode"
                    @treeViewNodeAriaRequestPreviousFocus="$_treeViewAria_handlePreviousFocus"
                    @treeViewNodeAriaRequestNextFocus="$_treeViewAria_handleNextFocus">

      <template #checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
        <slot name="checkbox" :model="model" :customClasses="customClasses" :inputId="inputId" :checkboxChangeHandler="checkboxChangeHandler"></slot>
      </template>
      <template #radio="{ model, customClasses, inputId, inputModel, radioChangeHandler }">
        <slot name="radio" :model="model" :customClasses="customClasses" :inputId="inputId" :inputModel="inputModel" :radioChangeHandler="radioChangeHandler"></slot>
      </template>
      <template #text="{ model, customClasses }">
        <slot name="text" :model="model" :customClasses="customClasses"></slot>
      </template>
    </tree-view-node>
  </ul>
</template>

<script>
  import TreeViewAria from '../mixins/TreeViewAria';
  import TreeViewNode from './TreeViewNode.vue';

  export default {
    name: 'TreeView',
    mixins: [
      TreeViewAria
    ],
    components: {
      TreeViewNode,
    },
    props: {
      initialModel: {
        type: Array,
        required: true
      },
      modelDefaults: {
        type: Object,
        required: false,
        default: function () { return {}; }
      },
      radioGroupValues: {
        type: Object,
        required: false,
        default: function () { return {}; }
      },
      selectionMode: {
        type: String,
        required: false,
        default: null,
        validator: function (value) {
          return ['single', 'selectionFollowsFocus', 'multiple'].includes(value);
        }
      },
      skinClass: {
        type: String,
        required: false,
        default: 'default-tree-view-skin',
        validator: function (value) {
          return value === null || !value.match(/\s/);
        }
      }
    },
    data() {
      return {
        uniqueId: null,
        model: this.initialModel
      };
    },
    computed: {
      ariaMultiselectable() {
        // If there's no selectionMode, return a boolean so aria-multiselectable isn't included.
        // Otherwise, return either the string 'true' or 'false' as the attribute's value.
        return this.selectionMode === null ? false : (this.selectionMode === 'multiple').toString();
      }
    },
    mounted() {
      this.$_treeView_enforceSingleSelectionMode();
      this.$set(this, 'uniqueId', this.$el.id ? this.$el.id : null);
    },
    methods: {
      getCheckedCheckboxes() {
        return this.getMatching((current) =>
          current.treeNodeSpec.input
          && current.treeNodeSpec.input.type === 'checkbox'
          && current.treeNodeSpec.state.input.value);
      },
      getCheckedRadioButtons() {
        return this.getMatching((current) =>
          current.treeNodeSpec.input
          && current.treeNodeSpec.input.type === 'radio'
          && this.radioGroupValues[current.treeNodeSpec.input.name] === current.treeNodeSpec.input.value);
      },
      getMatching(matcherFunction) {
        let matches = [];

        if (typeof matcherFunction === 'function') {
          this.$_treeView_depthFirstTraverse((current) => {
            if (matcherFunction(current)) {
              matches.push(current);
            }
          });
        }

        return matches;
      },
      getSelected() {
        return this.selectionMode === null ? [] : this.getMatching((current) => current.treeNodeSpec.selectable && current.treeNodeSpec.state.selected);
      },
      $_treeView_depthFirstTraverse(nodeActionCallback) {
        if (this.model.length === 0) {
          return;
        }

        let nodeQueue = this.model.slice();
        let continueCallbacks = true;

        while (nodeQueue.length > 0 && continueCallbacks !== false) {
          let current = nodeQueue.shift();

          // Push children to the front (depth first traversal)
          let childrenPropName = current.treeNodeSpec.childrenProperty;
          if (Array.isArray(current[childrenPropName])) {
            nodeQueue = current[childrenPropName].concat(nodeQueue);
          }

          // Use a return value of false to halt calling the callback on further nodes.
          continueCallbacks = nodeActionCallback(current);
        }
      },
      $_treeView_handleChildDeletion(node, event) {
        // Remove the node from the array of children if this is an immediate child.
        // Note that only the node that was deleted fires these, not any subnode.
        let targetIndex = this.model.indexOf(node);
        if (targetIndex > -1) {
          this.$_treeViewAria_handleNodeDeletion(node);
          this.model.splice(targetIndex, 1);
        }

        this.$emit('treeViewNodeDelete', node, event);
      },
      $_treeView_handleNodeSelectedChange(node, event) {
        // For single selection mode, unselect any other selected node.
        // For selectionFollowsFocus mode, selection state is handled in TreeViewAria.$_treeViewAria_handleFocusableChange.
        // In all cases this emits treeViewNodeSelectedChange for the node parameter.
        if (this.selectionMode === "single" && node.treeNodeSpec.state.selected) {
          this.$_treeView_depthFirstTraverse((current) => {
            if (current.treeNodeSpec.state.selected && current.id !== node.id) {
              current.treeNodeSpec.state.selected = false;
              return false;
            }
            return true;
          });
        }

        this.$emit('treeViewNodeSelectedChange', node, event);
      },
      $_treeView_enforceSingleSelectionMode() {
        // For single selection mode, only allow one selected node.
        if (this.selectionMode === 'single') {
          let alreadyFoundSelected = false;
          this.$_treeView_depthFirstTraverse((node) => {
            if (node.treeNodeSpec.state && node.treeNodeSpec.state.selected === true) {
              if (alreadyFoundSelected) {
                node.treeNodeSpec.state.selected = false;
              }
              else {
                alreadyFoundSelected = true;
              }
            }
          });
        }
      }
    }
  };
</script>

<style lang="scss">

  // Embedded SCSS is the 'default-tree-view-skin' skin
  .tree-view.default-tree-view-skin {
    margin: 0;
    padding: 0;
    list-style: none;
  }

</style>
