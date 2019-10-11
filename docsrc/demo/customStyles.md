---
title-prefix: Custom Styling Demo
...

[Back to Demos list](../demos.html)

## Custom Styling Demo

This page demonstrates customized tree styling. This is achieved through a combination of using the `customizations` property of TreeViewNode data to apply custom styles to parts of nodes, along with a custom `skinStyle` TreeView prop and associated stylesheet. Of course, you can also just write some very specific selectors to override the default styles if you like pain.

First, let's look at the default styles. There's not much to see here, since the intention is for the user to handle styling the treeview while the component focuses on creating a workable structure. Things generally line up right, but not much more can be said for it.

```html
<tree id="customtree-default" :initial-model="model" :model-defaults="modelDefaults"></tree>
```

```{=html5}
<div id="app-default" class="demo-tree">
    <tree id="customtree-default" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
    import { defaultData } from './customStyles.js';
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            childCounter: 0,
            model: defaultData,
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
    }).$mount('#app-default');
</script>
```

Some simple customizations can be done by applying custom classes to various parts of the tree using the `customizations` property, most likely in the `modelDefaults` parameter of the TreeView itself. In this example, `customizations.classes.treeViewNodeSelfText` is given a value of `big-text`. The `big-text` class is defined in a [classbased.css stylesheet](../style/demo/classbased.css).

```html
<tree id="customtree-classbased" :initial-model="model" :model-defaults="modelDefaults"></tree>
```

```{=html5}
<div id="app-classbased" class="demo-tree">
    <tree id="customtree-classbased" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
    import { classbasedData } from './customStyles.js';
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            childCounter: 0,
            model: classbasedData,
            modelDefaults: {
                addChildCallback: this.addChildCallback,
                addChildTitle: 'Add a new child node',
                deleteTitle: 'Delete this node',
                expanderTitle: 'Expand this node',
                customizations: {
                    classes: {
                        treeViewNodeSelf: 'large-line',
                        treeViewNodeSelfText: 'big-text'
                    }
                }
            }
        };
      },
      methods: {
        addChildCallback(parentModel) {
          this.childCounter++;
          return Promise.resolve({ id: `child-node${this.childCounter}`, label: `Added Child ${this.childCounter}`, deletable: true });
        }
      }
    }).$mount('#app-classbased');
</script>
```

In this example, a treeview has been given a `skin-class` prop value of `grayscale`. This effectively swaps out a class named `default` on the TreeView for the one specified as the `skin-class`. This _completely removes_ the default styling. To provide new styles, a [new stylesheet](../style/demo/grayscale.css) was created based on the default styles (copied right from the browser). This gives complete control of the styling, allowing for easier usage of things like Font Awesome as seen here.

```html
<tree id="customtree-gray" :initial-model="model" :model-defaults="modelDefaults" :skin-class="'grayscale'"></tree>
```

```{=html5}
<div id="app-gray" class="demo-tree">
    <tree id="customtree-gray" :initial-model="model" :model-defaults="modelDefaults" :skin-class="'grayscale'"></tree>
</div>
<script type='module'>
    import { grayData } from './customStyles.js';
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            childCounter: 0,
            model: grayData,
            modelDefaults: {
                addChildCallback: this.addChildCallback,
                addChildTitle: 'Add a new child node',
                deleteTitle: 'Delete this node',
                expanderTitle: 'Expand this node',
                customizations: {
                    classes: {
                        treeViewNodeSelfExpander: 'action-button',
                        treeViewNodeSelfExpandedIndicator: 'fas fa-chevron-right',
                        treeViewNodeSelfAction: 'action-button',
                        treeViewNodeSelfAddChildIcon: 'fas fa-plus-circle',
                        treeViewNodeSelfDeleteIcon: 'fas fa-minus-circle'
                    }
                }
            }
        };
      },
      methods: {
        addChildCallback(parentModel) {
          this.childCounter++;
          return Promise.resolve({ id: `child-node${this.childCounter}`, label: `Added Child ${this.childCounter}`, deletable: true });
        }
      }
    }).$mount('#app-gray');
</script>
```