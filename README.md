# vue-tree

vue-tree is a Vue component that implements a TreeView control. Its aim is to provide common tree options in a way that is easy to use and easy to customize.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build status](https://ci.appveyor.com/api/projects/status/j8d19gt0vh16amhh/branch/master?svg=true)](https://ci.appveyor.com/project/Gregg/vue-tree/branch/master)

## Full Documentation

See the full documentation over at the [project's Github Pages](https://grapoza.github.io/vue-tree/). This includes information on how to use and configure the treeview, features (both existing and planned) as well as some demos.

##  Installation

Install the component with your favorite package manager:
```shell
yarn add @grapoza/vue-tree
```
or
```shell
npm install --save @grapoza/vue-tree
```

The default import from this package is the components from the .vue files. In addition to this, pre-compiled versions of the TreeView component and CSS are also available in the package but you will need to reference them manually from your own project.

## Usage

If you're using it in a .vue file:

```html
<template>
  <tree-view  id="my-tree" :initial-model="dataModel"></tree-view>
</template>

<script>
import TreeView from "@grapoza/vue-tree"

export default {
  components: {
	  TreeView
  },
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
</script>
```

Or, import it into your application:

```javascript
import TreeView from "@grapoza/vue-tree"
Vue.use(TreeView)
```
Then add the component:
```html
<tree-view id="my-tree" :initial-model="dataModel"></tree-view>
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
