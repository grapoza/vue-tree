# vue-tree

vue-tree is a Vue component that implements a Tree View control. Its aim is to provide common tree options in a way that is easy to use and easy to customize.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build status](https://ci.appveyor.com/api/projects/status/j8d19gt0vh16amhh/branch/master?svg=true)](https://ci.appveyor.com/project/Gregg/vue-tree/branch/master)

## Full Documentation

See the full documentation over at the [project's Github Pages](https://grapoza.github.io/vue-tree/). This includes information on how to use and configure the tree view, features (both existing and planned) as well as some demos.

##  Installation

Install the component with your favorite package manager:
```shell
yarn add @grapoza/vue-tree
```
or
```shell
npm install --save @grapoza/vue-tree
```
or
```shell
bun add @grapoza/vue-tree
```

## Usage

If you're using it in a .vue file:

```html
<template>
  <TreeView  id="my-tree" v-model="dataModel" />
</template>

// Options API
<script>
import { TreeView } from "@grapoza/vue-tree"

export default {
  components: {
    TreeView
  },
  data() {
    return {
      dataModel: [
        {
          id: "numberOrString",
          label: "Root Node",
          children: [
            {id: 1, label: "Child Node"},
            {id: "node2", label: "Second Child"}
          ]
        }
      ]
    }
  }
}
</script>

// Composition API
<script setup>
import { TreeView } from "@grapoza/vue-tree"
const dataModel = ref([
  {
    id: "numberOrString",
    label: "Root Node",
    children: [
      {id: 1, label: "Child Node"},
      {id: "node2", label: "Second Child"}
    ]
  }
])
</script>
```

Or, import it into your application:

```javascript
import { TreeView } from "@grapoza/vue-tree"
Vue.use(TreeView)
```
Then add the component:
```html
<TreeView id="my-tree" v-model="dataModel" />
```
```javascript
export default {
  data() {
    return {
      dataModel: [
        {id: "numberOrString", label: "Root Node", children: [
          {id: 1, label: "Child Node"},
          {id: "node2", label: "Second Child"}]
        }]
    }
  }
}
```
