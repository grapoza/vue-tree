<template>
  <ul class="tree-view" role="tree">
    <tree-view-node v-for="(nodeModel) in model"
                    :key="nodeModel.id"
                    :initial-model="nodeModel"
                    :model-defaults="modelDefaults"
                    :depth="0"
                    :tree-id="uniqueId"
                    :radio-group-values="radioGroupValues"
                    :aria-key-map="ariaKeyMap"
                    @treeViewNodeClick="(t, e)=>$emit('treeViewNodeClick', t, e)"
                    @treeViewNodeDblclick="(t, e)=>$emit('treeViewNodeDblclick', t, e)"
                    @treeViewNodeCheckboxChange="(t, e)=>$emit('treeViewNodeCheckboxChange', t, e)"
                    @treeViewNodeRadioChange="(t, e)=>$emit('treeViewNodeRadioChange', t, e)"
                    @treeViewNodeExpandedChange="(t, e)=>$emit('treeViewNodeExpandedChange', t, e)"
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
      }
    },
    data() {
      return {
        uniqueId: null,
        model: this.initialModel
      };
    },
    mounted() {
      this.$set(this, 'uniqueId', this.$el.id ? this.$el.id : null);
    },
    methods: {
      getCheckedCheckboxes() {
        let checked = [];
        let toCheck = this.model.slice();

        while (toCheck.length > 0) {
          let current = toCheck.pop();
          toCheck = toCheck.concat(current.children);

          if (current.input && current.input.type === 'checkbox' && current.state.input.value) {
            checked.push(current);
          }
        }

        return checked;
      },
      getCheckedRadioButtons() {
        let checked = [];
        let toCheck = this.model.slice();

        while (toCheck.length > 0) {
          let current = toCheck.pop();
          toCheck = toCheck.concat(current.children);

          if (current.input && current.input.type === 'radio' && this.radioGroupValues[current.input.name] === current.input.value) {
            checked.push(current);
          }
        }

        return checked;
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
      }
    }
  };
</script>

<style lang="scss">

  .tree-view {
    margin: 0;
    padding: 0;
    list-style: none;
  }

</style>
