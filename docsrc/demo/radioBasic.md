---
title-prefix: Basic Radiobutton Demo
...

[Back to Demos list](../demos.html)

## Basic Treeview Radio Button Demo

This page demonstrates a basic treeview using radio buttons, with some nodes expanded or selected by default and multiple button groups. [See the data used](./radioBasic.js).

```{=html5}
<div id="app">
    <tree id="customtree" :initial-model="model" :radio-group-values="radioGroupValues" ref="tree"></tree>
    <section id="checkedStuff">
        <button type="button" class="treeProcessTrigger" v-on:click="refreshCheckedList">What's been checked?</button>
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
```