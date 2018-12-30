<template>
  <ul class="tree-view">
    <tree-view-node v-for="(nodeModel) in model"
                    :key="nodeModel.id"
                    :model="nodeModel"
                    :depth="0"
                    :tree-id="uniqueId"
                    @treeViewNodeClick="(t, e)=>$emit('treeViewNodeClick', t, e)"
                    @treeViewNodeDblclick="(t, e)=>$emit('treeViewNodeDblclick', t, e)"
                    @treeViewNodeCheckedChange="(t, e)=>$emit('treeViewNodeCheckedChange', t, e)"
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
      getChecked() {
        let checked = [];
        let toCheck = this.model.slice();

        while (toCheck.length > 0) {
          let current = toCheck.pop();
          toCheck = toCheck.concat(current.children);

          if (current.state.checked) {
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
