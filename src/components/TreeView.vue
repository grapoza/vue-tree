<template>
  <ul class="tree-view">
    <tree-view-node v-for="(nodeModel) in model"
                    :key="nodeModel.id"
                    :model="nodeModel"
                    :depth="0"
                    :tree-id="uniqueId">
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
