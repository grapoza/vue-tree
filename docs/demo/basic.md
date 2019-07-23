---
layout: demo
---

## Basic Treeview Checkbox Demo

This page demonstrates a basic treeview using checkboxes, with some nodes that are expanded, checked, and/or disabled by default. [See the data used](./basic.js).

{% raw  %}
<div id="app">
    <tree id="customtree" :initial-model="model" ref="tree"></tree>
    <section id="checkedStuff">
        <button type="button" class="treeProcessTrigger" v-on:click="refreshCheckedList">What's been checked?</button>
        <ul id="checkedList">
            <li v-for="checkedNode in checkedNodes">{{ checkedNode.id }}</li>
        </ul>
    </section>
</div>
{% endraw  %}

<script type='module'>
    import basicData from './basic.js';

    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
          model: basicData,
          checkedNodes: []
        };
      },
      methods: {
        refreshCheckedList() {
          this.$set(this, 'checkedNodes', this.$refs.tree.getCheckedCheckboxes());
        }
      }
    }).$mount('#app');
</script>