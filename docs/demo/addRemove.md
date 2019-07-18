---
layout: demo
---

## Add/Remove Nodes Demo

This page demonstrates adding and removing nodes. [See the data used](./addRemove.js). The callback for adding nodes is set in `modelDefaults` so any newly created node will use the same creation method automatically.

{% raw  %}
<div id="app">
    <tree id="customtree" :model="model" :model-defaults="modelDefaults" ref="tree"></tree>
</div>
{% endraw  %}

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
                addChildCallback: this.addChildCallback
            }
        };
      },
      methods: {
        addChildCallback (parentModel) {
          this.childCounter++;
          return Promise.resolve({ id: `child-node${this.childCounter}`, label: `Added Child ${this.childCounter}`, deletable: true });
        }
      }
    }).$mount('#app');
</script>