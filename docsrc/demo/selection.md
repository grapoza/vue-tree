---
title-prefix: Selection Demo
...

[Back to Demos list](../demos.html)

## Selection Demo

This page demonstrates selection in a basic treeview. [See the data used](./selection.js).

```{=html5}
<div id="app">
    <label for="modeSelect">Selection Mode</label>
    <select v-model="selectionMode" id="modeSelect" style="margin-bottom: 2rem;">
        <option value="single">Single</option>
        <option value="selectionFollowsFocus">Selection Follows Focus</option>
        <option value="multiple">Multiple</option>
        <option value="">No Selection</option>
    </select>
    <tree id="customtree" :initial-model="model" :model-defaults="modelDefaults" :selection-mode="normalizedSelectionMode" ref="tree"></tree>
    <section id="selectedStuff">
        <button type="button" @click="refreshSelectedList">What's selected?</button>
        <ul id="selectedList">
            <li v-for="selectedNode in selectedNodes">{{ selectedNode.id }}</li>
        </ul>
    </section>
</div>

<script type='module'>
    import selectionData from './selection.js';

    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
          model: selectionData,
          modelDefaults: {
            addChildTitle: 'Add a new child node',
            deleteTitle: 'Delete this node',
            expanderTitle: 'Expand this node'
          },
          selectionMode: 'single',
          selectedNodes: []
        };
      },
      computed: {
        normalizedSelectionMode() {
          return this.selectionMode === '' ? null : this.selectionMode;
        }
      },
      methods: {
        refreshSelectedList() {
          this.$set(this, 'selectedNodes', this.$refs.tree.getSelected());
        }
      }
    }).$mount('#app');
</script>
```