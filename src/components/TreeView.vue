<template>
  <ul class="tree-view">
    <tree-view-node v-for="(nodeModel) in model"
                    :key="nodeModel.id"
                    :model="nodeModel"
                    :model-defaults="modelDefaults"
                    :depth="0"
                    :tree-id="uniqueId"
                    :radio-group-values="radioGroupValues"
                    :customizations="customizations"
                    @treeViewNodeClick="(t, e)=>$emit('treeViewNodeClick', t, e)"
                    @treeViewNodeDblclick="(t, e)=>$emit('treeViewNodeDblclick', t, e)"
                    @treeViewNodeCheckboxChange="(t, e)=>$emit('treeViewNodeCheckboxChange', t, e)"
                    @treeViewNodeRadioChange="(t, e)=>$emit('treeViewNodeRadioChange', t, e)"
                    @treeViewNodeExpandedChange="(t, e)=>$emit('treeViewNodeExpandedChange', t, e)">
    </tree-view-node>
  </ul>
</template>

<script>
  import TreeViewNode from './TreeViewNode.vue';

  export default {
    name: 'TreeView',
    components: {
      TreeViewNode,
    },
    props: {
      model: {
        type: Array,
        required: true
      },
      customizations: {
        type: Object,
        required: false,
        default: function () { return {}; }
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
        uniqueId: null
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
