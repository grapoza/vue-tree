---
title-prefix: Add/Delete Demo
...

[Back to Demos list](../demos.html)

## Add/Remove Nodes Demo

This page demonstrates adding and removing nodes. [See the data used](./addRemove.js). The callback for adding nodes is set in `modelDefaults` so any newly created node will use the same creation method automatically.

```{=html5}
<div id="app">
    <tree id="customtree" :initial-model="model" :model-defaults="modelDefaults" ref="tree"></tree>
</div>

<script type='module'>
    import arModel from './addRemove.js';

    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            childCounter: 0,
            model: arModel,
            modelDefaults: {
                addChildCallback: this.addChildCallback,
                addChildTitle: 'Add a new child node',
                deleteTitle: 'Delete this node',
                expanderTitle: 'Expand this node'
            }
        };
      },
      methods: {
        addChildCallback(parentModel) {
          this.childCounter++;
          return Promise.resolve({ id: `child-node${this.childCounter}`, label: `Added Child ${this.childCounter}`, deletable: true });
        }
      }
    }).$mount('#app');
</script>
```