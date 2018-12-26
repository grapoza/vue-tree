<template>
  <ul class="tree-view">
    <tree-view-node v-for="(model, index) in treeData"
                    :key="index"
                    :model="model"
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
        required: true,
      }
    },
    data() {
      return {
        treeData: [],
        uniqueId: '',
      };
    },
    created() {
      this.$set(this, 'treeData', this.createNodeData(this.model));
    },
    mounted() {
      this.$set(this, 'uniqueId', this.$el.id ? this.$el.id : null);
    },
    methods: {
      /*
       * Given a set of raw data, converts it to objects consumable by TreeViewNode.
       *
       * @param {Array} data The object to convert to nodes
       * @param {Number} depth The depth of the current nodes (0 indexed).
       * @return {Array} The updated tree
       */
      createNodeData(data, depth = 0) {
        const self = this;

        for (var index = 0; index < data.length; index++) {
          var currentObj = data[index];
          currentObj.depth = depth;

          // Set expected properties if not provided
          if (Array.isArray(currentObj.children)) {
            self.createNodeData(currentObj.children, depth + 1);
          }
          else {
            currentObj.children = [];
          }
          if (typeof currentObj.expandable !== 'boolean') {
            currentObj.expandable = true;
          }
          if (typeof currentObj.checkable !== 'boolean') {
            currentObj.checkable = false;
          }
          if (typeof currentObj.selectable !== 'boolean') {
            currentObj.selectable = false;
          }
          if (currentObj.state === null || typeof currentObj.state !== 'object') {
            currentObj.state = {};
          }
          if (typeof currentObj.state.expanded !== 'boolean') {
            currentObj.state.expanded = false;
          }
          if (typeof currentObj.state.checked !== 'boolean') {
            currentObj.state.checked = false;
          }
          if (typeof currentObj.state.selected !== 'boolean') {
            currentObj.state.selected = false;
          }
        }

        return data;
      },
    },
  };
</script>

<style lang="scss" scoped>

  .tree-view {
    margin: 0;
    padding: 0;
    list-style: none;
  }

</style>
