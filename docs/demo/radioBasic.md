---
layout: demo
---

## Basic Treeview Radio Button Demo

<div id="app">
    <tree id="customtree" :model="model" :radio-group-values="radioGroupValues" ref="tree"></tree>
    <section id="checkedStuff">
        <button type="button" @click="refreshCheckedList">What's been checked?</button>
        <ul id="checkedList">
        <li v-for="checkedNode in checkedNodes">{{ checkedNode.id }}</li>
        </ul>
    </section>
</div>

<script type='module'>
    import basicRadioData from './radioBasic.js';

    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
          model: basicRadioData,
          checkedNodes: [],
          radioGroupValues: { 'radio1': 'aValueToSubmit' }
        };
      },
      methods: {
        refreshCheckedList() {
          let nodes = this.$refs.tree.getCheckedRadioButtons();
          this.$set(this, 'checkedNodes', nodes);
        }
      }
    }).$mount('#app')
</script>