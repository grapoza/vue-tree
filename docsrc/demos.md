---
title-prefix: Demos
...

## Demos

<!--- -------------------------------------------------------------------------------------- --->
### A Basic Tree

The most basic use of the treeview consists of giving it some data and letting the tree populate the model with the default tree node properties, which it does by adding a `treeNodeSpec` property to each object in the hierarchy. This can be useful if you have a model and want it in a treeview, and also don't care if the treeview modifies that data. If you don't want the treeview to modify your data at all, you'll need to make a copy first and provide that to the treeview.

```{=html5}
<details>
<summary>
```
```html
<tree id="customtree-basic" :initial-model="model"></tree>
```
```{=html5}
</summary>
```
<!--- The leading spaces are to render the html aligned correctly --->
```html
  <div id="app-basic" class="demo-tree">
  <tree id="customtree-basic" :initial-model="model"></tree>
</div>
<script type='module'>
  import TreeView from "@grapoza/vue-tree"
  new Vue({
    components: {
      tree: TreeView
    },
    data() {
      return {
        model: [
          {
            id: "node1",
            label: "Node with no children"
          },
          {
            id: "node2",
            label: "Node with a child",
            children: [
              {
                id: "childNode1",
                label: "A child node"
              }
            ]
          }
        ]
      };
    }
  }).$mount('#app-basic');
</script>
```
```{=html5}
</details>
```

```{=html5}
<div id="app-basic" class="demo-tree">
    <tree id="customtree-basic" :initial-model="model"></tree>
</div>
<script type='module'>
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            model: [
                {
                    id: "node1",
                    label: "Node with no children"
                },
                {
                    id: "node2",
                    label: "Node with a child",
                    children: [
                        {
                            id: "childNode1",
                            label: "A child node"
                        }
                    ]
                }
            ]
        };
      }
    }).$mount('#app-basic');
</script>
```

<!--- -------------------------------------------------------------------------------------- --->
### A Static Tree

If all you need is a static tree (no expanding subnodes) then you can just set the `expandable` property to false for each node. You can then just set the `expanded` property through code to hide/show children of a node as needed. The most common case is to always set it to `true` for all nodes.

```{=html5}
<details>
<summary>
```
```html
<tree id="customtree-static" :initial-model="model" :model-defaults="modelDefaults"></tree>
```
```{=html5}
</summary>
```
<!--- The leading spaces are to render the html aligned correctly --->
```html
  <div id="app-static" class="demo-tree">
  <tree id="customtree-static" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
  import TreeView from "@grapoza/vue-tree"
  new Vue({
    components: {
      tree: TreeView
    },
    data() {
      return {
        model: [
          {
            id: "node1",
            label: "Node with no children"
          },
          {
            id: "node2",
            label: "Node with a child",
            children: [
              {
                id: "childNode1",
                label: "A child node"
              }
            ]
          }
        ],
        modelDefaults: {
          expandable: false,
          state: {
            expanded: true
          }
        }
      };
    }
  }).$mount('#app-static');
</script>
```
```{=html5}
</details>
```

```{=html5}
<div id="app-static" class="demo-tree">
    <tree id="customtree-static" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            model: [
                {
                    id: "node1",
                    label: "Node with no children"
                },
                {
                    id: "node2",
                    label: "Node with a child",
                    children: [
                        {
                            id: "childNode1",
                            label: "A child node"
                        }
                    ]
                }
            ],
            modelDefaults: {
                expandable: false,
                state: {
                    expanded: true
                }
            }
        };
      }
    }).$mount('#app-static');
</script>
```

<!--- -------------------------------------------------------------------------------------- --->
### Setting Defaults

If there are common settings that should be used by all (or even most) nodes, these can be given to the tree in the `modelDefaults` property. This is a great place to customize things like what model props are used for the nodes' labels and whether all nodes are a certain type of input. Note that the expandable node below is expanded by default, as set from `modelDefaults`. The tree below uses the `identifier` and `description` properties of the node objects instead of `id` and `label`, and has all nodes expanded by default. These are set for all nodes at once by using `modelDefaults`. For more info, see [the docs](/#default-data).

```{=html5}
<details>
<summary>
```
```html
<tree id="customtree-custom" :initial-model="model" :model-defaults="modelDefaults"></tree>
```
```{=html5}
</summary>
```
<!--- The leading spaces are to render the html aligned correctly --->
```html
  <div id="app-custom" class="demo-tree">
  <tree id="customtree-custom" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
  import TreeView from "@grapoza/vue-tree"
  new Vue({
    components: {
      tree: TreeView
    },
    data() {
      return {
        model: [
          {
            identifier: "node1",
            description: "Node with no children"
          },
          {
            identifier: "node2",
            description: "Node with a child",
            children: [
              {
                identifier: "childNode1",
                description: "A child node"
              }
            ]
          }
        ],
        modelDefaults: {
          idProperty: 'identifier',
          labelProperty: 'description',
          state: {
            expanded: true
          }
        }
      };
    }
  }).$mount('#app-custom');
</script>
```
```{=html5}
</details>
```

```{=html5}
<div id="app-custom" class="demo-tree">
    <tree id="customtree-custom" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            model: [
                {
                    identifier: "node1",
                    description: "Node with no children"
                },
                {
                    identifier: "node2",
                    description: "Node with a child",
                    children: [
                        {
                            identifier: "childNode1",
                            description: "A child node"
                        }
                    ]
                }
            ],
            modelDefaults: {
                idProperty: 'identifier',
                labelProperty: 'description',
                state: {
                    expanded: true
                }
            }
        };
      }
    }).$mount('#app-custom');
</script>
```

<!--- -------------------------------------------------------------------------------------- --->
### Adding and Removing Nodes

Any node can be marked as deletable or provide a callback used to create a new child node. To make a node deletable, just set a `deletable` property to `true` in that node's `treeNodeSpec`. To allow a node to have children added, set an `addChildCallback` property on the node's `treeNodeSpec` (or use `modelDefaults` to use the same callback for all nodes). The `addChildCallback` can take the parent node's model data as an argument, and should return a Promise that resolves to the node data to add.

```{=html5}
<details>
<summary>
```
```html
<tree id="customtree-add-remove" :initial-model="model" :model-defaults="modelDefaults"></tree>
```
```{=html5}
</summary>
```
<!--- The leading spaces are to render the html aligned correctly --->
```html
  <div id="app-add-remove" class="demo-tree">
  <tree id="customtree-add-remove" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
  import TreeView from "@grapoza/vue-tree"
  new Vue({
    components: {
      tree: TreeView
    },
    data() {
      return {
        childCounter: 0,
        model: [
          {
            id: "add-remove-rootnode",
            label: "Root Node"
          }
        ],
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
        return Promise.resolve({
          id: `add-remove-child-node-${this.childCounter}`,
          label: `Added Child ${this.childCounter}`,
          treeNodeSpec: { deletable: true }
        });
      }
    }
  }).$mount('#app-add-remove');
</script>
```
```{=html5}
</details>
```

```{=html5}
<div id="app-add-remove" class="demo-tree">
    <tree id="customtree-add-remove" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            childCounter: 0,
            model: [
            {
                id: "add-remove-rootnode",
                label: "Root Node"
            }
            ],
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
          return Promise.resolve({
            id: `add-remove-child-node-${this.childCounter}`,
            label: `Added Child ${this.childCounter}`,
            treeNodeSpec: { deletable: true }
          });
        }
      }
    }).$mount('#app-add-remove');
</script>
```

<!--- -------------------------------------------------------------------------------------- --->
### Inputs

Support for checkboxes and radio buttons is built into the treeview.

To create a checkbox node, specify `input.type = 'checkbox'` on the node's `treeNodeSpec`. To initialize the node as checked, specify `state.input.value = true`.

To create a radio button node, specify `input.type = 'radio'` on the node's `treeNodeSpec`, give the node a name using the `input.name` property, and give the node a value using `input.value`. The name will determine the radio button group to which the radio button belongs. To initialize a node as checked set the node's `input.isInitialRadioGroupValue` to `true`. If multiple nodes within a radio button group are specified as `isInitialRadioGroupValue`, the last one in wins.

The convenience methods `getCheckedRadioButtons` and `getCheckedCheckboxes` are exposed on the tree component to make it easy to get the nodes that have been checked.

```{=html5}
<details>
<summary>
```
```html
<tree id="customtree-inputs" :initial-model="model" ref="treeInputs"></tree>
```
```{=html5}
</summary>
```
<!--- The leading spaces are to render the html aligned correctly --->
```html
  <div id="app-inputs" class="demo-tree">
  <tree id="customtree-inputs" :initial-model="model" ref="treeInputs"></tree>
  <section id="checked-stuff-inputs">
    <button type="button" class="tree-processor-trigger" v-on:click="refreshCheckedList">What's been checked?</button>
    <ul id="checked-list-inputs">
      <li v-for="checkedNode in checkedNodes">{{ checkedNode.id }}</li>
    </ul>
  </section>
</div>

<script type='module'>
  import TreeView from "@grapoza/vue-tree"
  new Vue({
    components: {
      tree: TreeView
    },
    data() {
      return {
        model: [
          {
            id: 'inputs-radio-1',
            label: 'My First Node',
            treeNodeSpec: {
              input: {
                type: 'radio',
                name: 'radio1',
                value: 'aValueToSubmit',
                isInitialRadioGroupValue: true
              }
            }
          },
          {
            id: 'inputs-radio-2',
            label: 'My Second Node',
            children: [
              {
                id: 'inputs-radio-2-sub-1',
                label: 'This is a subnode',
                treeNodeSpec: {
                  input: {
                    type: 'radio',
                    name: 'radio2'
                  }
                }
              },
              {
                id: 'inputs-radio-2-sub-2',
                label: 'This is another subnode',
                treeNodeSpec: {
                  input: {
                    type: 'radio',
                    name: 'radio2'
                  }
                }
              }
            ],
            treeNodeSpec: {
              input: {
                type: 'radio',
                name: 'radio1'
              },
              state: {
                expanded: true
              }
            }
          },
          {
            id: 'inputs-checkbox-1',
            label: 'Checkbox node',
            treeNodeSpec: {
              input: {
                type: 'checkbox'
              },
              state: {
                input: {
                    value: true
                }
              }
            }
          }
        ],
        checkedNodes: []
      };
    },
    methods: {
      refreshCheckedList() {
        let rbNodes = this.$refs.treeInputs.getCheckedRadioButtons();
        let cbNodes = this.$refs.treeInputs.getCheckedCheckboxes();
        this.$set(this, 'checkedNodes', [...rbNodes, ...cbNodes]);
      }
    }
  }).$mount('#app-inputs')
</script>
```
```{=html5}
</details>
```

```{=html5}
<div id="app-inputs" class="demo-tree">
    <tree id="customtree-inputs" :initial-model="model" ref="treeInputs"></tree>
    <section id="checked-stuff-inputs">
        <button type="button" class="tree-processor-trigger" v-on:click="refreshCheckedList">What's been checked?</button>
        <ul id="checked-list-inputs">
            <li v-for="checkedNode in checkedNodes">{{ checkedNode.id }}</li>
        </ul>
    </section>
</div>

<script type='module'>
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
          model: [
            {
              id: 'inputs-radio-1',
              label: 'My First Node',
              treeNodeSpec: {
                input: {
                  type: 'radio',
                  name: 'radio1',
                  value: 'aValueToSubmit',
                  isInitialRadioGroupValue: true
                }
              }
            },
            {
              id: 'inputs-radio-2',
              label: 'My Second Node',
              children: [
                {
                  id: 'inputs-radio-2-sub-1',
                  label: 'This is a subnode',
                  treeNodeSpec: {
                  input: {
                    type: 'radio',
                    name: 'radio2'
                  }
                }
                },
                {
                  id: 'inputs-radio-2-sub-2',
                  label: 'This is another subnode',
                  treeNodeSpec: {
                    input: {
                      type: 'radio',
                      name: 'radio2'
                    }
                  }
                }
              ],
              treeNodeSpec: {
                input: {
                  type: 'radio',
                  name: 'radio1'
                },
                state: {
                  expanded: true
                }
              }
            },
            {
              id: 'inputs-checkbox-1',
              label: 'Checkbox node',
              treeNodeSpec: {
                input: {
                  type: 'checkbox'
                },
                state: {
                  input: {
                      value: true
                  }
                }
              }
            }
          ],
          checkedNodes: []
        };
      },
      methods: {
        refreshCheckedList() {
          let rbNodes = this.$refs.treeInputs.getCheckedRadioButtons();
          let cbNodes = this.$refs.treeInputs.getCheckedCheckboxes();
          this.$set(this, 'checkedNodes', [...rbNodes, ...cbNodes]);
        }
      }
    }).$mount('#app-inputs')
</script>
```

<!--- -------------------------------------------------------------------------------------- --->
### Selection

Any node can be marked as selectable. To set a node's selectability, set a `selectable` property to `true` or `false` (the default) in that node's `treeNodeSpec`. Different selection modes allow different selection behavior, but only affect nodes that are selectable.

The convenience method `getSelected` is exposed on the tree component to make it easy to get the nodes that have been selected. For more info see [the docs](./#selection-mode).

```{=html5}
<details>
<summary>
```
```html
<tree id="customtree-selection"
      :initial-model="model"
      :model-defaults="modelDefaults"
      :selection-mode="normalizedSelectionMode"
      ref="treeSelection"></tree>
```
```{=html5}
</summary>
```
<!--- The leading spaces are to render the html aligned correctly --->
```html
  <div id="app-selection" class="demo-tree">
  <label for="modeSelect">Selection Mode</label>
  <select v-model="selectionMode" id="modeSelect" style="margin-bottom: 2rem;">
    <option value="single">Single</option>
    <option value="selectionFollowsFocus">Selection Follows Focus</option>
    <option value="multiple">Multiple</option>
    <option value="">No Selection</option>
  </select>
  <tree id="customtree-selection" :initial-model="model" :model-defaults="modelDefaults" :selection-mode="normalizedSelectionMode" ref="treeSelection"></tree>
  <section id="selected-stuff">
    <button type="button" class="tree-processor-trigger" @click="refreshSelectedList">What's selected?</button>
    <ul id="selectedList">
      <li v-for="selectedNode in selectedNodes">{{ selectedNode.id }}</li>
    </ul>
  </section>
</div>

<script type='module'>
  import TreeView from "@grapoza/vue-tree"
  new Vue({
    components: {
      tree: TreeView
    },
    data() {
      return {
        model: [
          {
            id: 'node1',
            label: 'My First Node',
            children: [],
            treeNodeSpec: {
              input: {
                type: 'checkbox',
                name: 'checkbox1'
              }
            }
          },
          {
            id: 'node2',
            label: 'My Second Node',
            children: [
              {
                id: 'subnode1',
                label: 'This is a subnode',
                children: [],
                treeNodeSpec: {
                  title: 'Even non-input nodes should get a title.'
                }
              },
              {
                id: 'subnode2',
                label: 'This is a checkable, checked subnode',
                children: [
                  {
                    id: 'subsubnode1',
                    label: 'An even deeper node',
                    children: []
                  }
                ],
                treeNodeSpec: {
                  input: {
                    type: 'checkbox',
                    name: 'checkbox3'
                  }
                }
              }
            ],
            treeNodeSpec: {
              title: 'My second node, and its fantastic title',
              input: {
                type: 'checkbox',
                name: 'checkbox2'
              },
              state: {
                expanded: true
              }
            }
          }
        ],
        modelDefaults: {
          selectable: true,
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
        this.$set(this, 'selectedNodes', this.$refs.treeSelection.getSelected());
      }
    }
  }).$mount('#app-selection');
</script>
```
```{=html5}
</details>
```

```{=html5}
<div id="app-selection" class="demo-tree">
    <label for="modeSelect">Selection Mode</label>
    <select v-model="selectionMode" id="modeSelect" style="margin-bottom: 2rem;">
        <option value="single">Single</option>
        <option value="selectionFollowsFocus">Selection Follows Focus</option>
        <option value="multiple">Multiple</option>
        <option value="">No Selection</option>
    </select>
    <tree id="customtree-selection" :initial-model="model" :model-defaults="modelDefaults" :selection-mode="normalizedSelectionMode" ref="treeSelection"></tree>
    <section id="selected-stuff">
        <button type="button" class="tree-processor-trigger" @click="refreshSelectedList">What's selected?</button>
        <ul id="selectedList">
            <li v-for="selectedNode in selectedNodes">{{ selectedNode.id }}</li>
        </ul>
    </section>
</div>

<script type='module'>
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
          model: [
            {
              id: 'node1-selection',
              label: 'My First Node',
              children: [],
              treeNodeSpec: {
                input: {
                  type: 'checkbox',
                  name: 'checkbox1'
                }
              }
            },
            {
              id: 'node2-selection',
              label: 'My Second Node',
              children: [
                {
                  id: 'subnode1-selection',
                  label: 'This is a subnode',
                  children: [],
                  treeNodeSpec: {
                    title: 'Even non-input nodes should get a title.'
                  }
                },
                {
                  id: 'subnode2-selection',
                  label: 'This is a checkable, checked subnode',
                  children: [
                    {
                      id: 'subsubnode1',
                      label: 'An even deeper node',
                      children: []
                    }
                  ],
                  treeNodeSpec: {
                    input: {
                      type: 'checkbox',
                      name: 'checkbox3'
                    }
                  }
                }
              ],
              treeNodeSpec: {
                title: 'My second node, and its fantastic title',
                input: {
                  type: 'checkbox',
                  name: 'checkbox2'
                },
                state: {
                  expanded: true
                }
              }
            }
          ],
          modelDefaults: {
            selectable: true,
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
          this.$set(this, 'selectedNodes', this.$refs.treeSelection.getSelected());
        }
      }
    }).$mount('#app-selection');
</script>
```

<!--- -------------------------------------------------------------------------------------- --->
### Slots

A treeview has slots available for replacing specific types of nodes. The `text`, `checkbox`, `radio`, `loading-root` and `loading` slots replace the correpsonding types of nodes. For more info, see [the docs](./#slots).

```{=html5}
<details>
<summary>
```
```html
<tree id="customtree-slots" :initial-model="model">
  <template v-slot:text="{ model, customClasses }">
    content
  </template>
  <template v-slot:checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
    content
  </template>
  <template v-slot:radio="{ model, customClasses, inputId, inputModel, radioChangeHandler }">
    content
  </template>
  <template v-slot:loading="{ model, customClasses }">
    content
  </template>
  <template v-slot:loading-root>
    content
  </template>
</tree>
```
```{=html5}
</summary>
```
<!--- The leading spaces are to render the html aligned correctly --->
```html
<div id="app-slots" class="demo-tree">
  <tree id="customtree-slots" :initial-model="model">
    <template v-slot:text="{ model, customClasses }">
      <span style="color: red;">{{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}</span>
    </template>
    <template v-slot:checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
      <label :for="inputId" :title="model.treeNodeSpec.title">
        <input :id="inputId"
               type="checkbox"
               :disabled="model.treeNodeSpec.state.input.disabled"
               v-model="model.treeNodeSpec.state.input.value"
               v-on:change="checkboxChangeHandler" />
        <marquee style="max-width: 6rem">{{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}</marquee>
      </label>
    </template>
    <template v-slot:radio="{ model, customClasses, inputId, inputModel, radioChangeHandler }">
      <label :for="inputId" :title="model.treeNodeSpec.title">
        <input :id="inputId"
               type="radio"
               :name="model.treeNodeSpec.input.name"
               :value="model.treeNodeSpec.input.value"
               :disabled="model.treeNodeSpec.state.input.disabled"
               v-model="inputModel"
               v-on:change="radioChangeHandler" />
        <span style="font-weight: bolder">{{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}</span>
      </label>
    </template>
    <template v-slot:loading="{ model, customClasses }">
      <span style="">LOADING CHILDREN OF {{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}</span>
    </template>
  </tree>
</div>

<script type='module'>
  import TreeView from "@grapoza/vue-tree"
  new Vue({
    components: {
      tree: TreeView
    },
    data() {
      return {
        model: [
          {
            id: 'node1-slots',
            label: 'Checkbox Node',
            treeNodeSpec: {
              customizations: {
                classes: {
                  treeViewNode: 'beep'
                }
              },
              input: {
                type: 'checkbox',
                name: 'checkbox1'
              }
            }
          },
          {
            id: 'node2-slots',
            label: 'Radio Button Node',
            treeNodeSpec: {
              customizations: {
                classes: {
                  treeViewNode: 'boop'
                }
              },
              input: {
                type: 'radio',
                name: 'radiobutton1'
              }
            }
          },
          {
            id: 'node3-slots',
            label: 'Text Node',
            children: [],
            treeNodeSpec: {
              expandable: true,
              loadChildrenAsync: (m) => axios.get(`/children/${m.id}`),
              customizations: {
                classes: {
                  treeViewNode: 'plop'
                }
              },
            }
          }
        ]
      };
    }
  }).$mount('#app-slots');
</script>
```
```{=html5}
</details>
```

```{=html5}
<div id="app-slots" class="demo-tree">
    <tree id="customtree-slots" :initial-model="model">
        <template v-slot:text="{ model, customClasses }">
            <span style="color: red;">{{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}</span>
        </template>
        <template v-slot:checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
            <label :for="inputId" :title="model.treeNodeSpec.title">
                <input :id="inputId"
                       type="checkbox"
                       :disabled="model.treeNodeSpec.state.input.disabled"
                       v-model="model.treeNodeSpec.state.input.value"
                       v-on:change="checkboxChangeHandler" />
                <marquee style="max-width: 20rem">{{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}</marquee>
            </label>
        </template>
        <template v-slot:radio="{ model, customClasses, inputId, inputModel, radioChangeHandler }">
            <label :for="inputId" :title="model.treeNodeSpec.title">
                <input :id="inputId"
                       type="radio"
                       :name="model.treeNodeSpec.input.name"
                       :value="model.treeNodeSpec.input.value"
                       :disabled="model.treeNodeSpec.state.input.disabled"
                       v-model="inputModel"
                       v-on:change="radioChangeHandler" />
                <span style="font-weight: bolder">{{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}</span>
            </label>
        </template>
        <template v-slot:loading="{ model, customClasses }">
          <span class="grtvn-loading">LOADING CHILDREN OF {{ model[model.treeNodeSpec.labelProperty] }}. Custom Classes: {{ JSON.stringify(customClasses) }}</span>
        </template>
    </tree>
</div>

<script type='module'>
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
          model: [
            {
              id: 'node1-slots',
              label: 'Checkbox Node',
              treeNodeSpec: {
                customizations: {
                  classes: {
                    treeViewNode: 'beep'
                  }
                },
                input: {
                  type: 'checkbox',
                  name: 'checkbox1'
                }
              }
            },
            {
              id: 'node2-slots',
              label: 'Radio Button Node',
              treeNodeSpec: {
                customizations: {
                  classes: {
                    treeViewNode: 'boop'
                  }
                },
                input: {
                  type: 'radio',
                  name: 'radiobutton1'
                }
              }
            },
            {
              id: 'node3-slots',
              label: 'Text Node',
              children: [],
              treeNodeSpec: {
                expandable: true,
                loadChildrenAsync: (m) => new Promise(() => {}), // Never resolve so the demo node stays up.
                customizations: {
                  classes: {
                    treeViewNode: 'plop'
                  }
                },
              }
            }
          ]
        };
      }
    }).$mount('#app-slots');
</script>
```

<!--- -------------------------------------------------------------------------------------- --->
### Asynchronous Loading

Two types of asynchronous loading are available. The first loads the root data for the treeview itself, and the second asynchronously loads child data when a node is expanded.

You can load root nodes asynchronously by providing a function to the `loadNodesAsync` property of the treeview. The function should return a Promise that resolves to an array of model data to add as root nodes.

You can load child nodes asynchronously by providing a function to the `loadChildrenAsync` property in a node's `treeNodeSpec` (or use `modelDefaults` to use the same method for all nodes). The function can take the parent node's model data as an argument, and should return a Promise that resolves to an array of model data to add as children.

A node's children can be reloaded by providing the target nodes ID to the `reloadNodeChildren` method of the treeview.

```{=html5}
<details>
<summary>
```
```html
<tree id="customtree-async" :load-nodes-async="loadNodesAsync" :model-defaults="modelDefaults"></tree>
```
```{=html5}
</summary>
```
<!--- The leading spaces are to render the html aligned correctly --->
```html
  <div id="app-async" class="demo-tree">
  <tree id="customtree-async"
        :load-nodes-async="loadNodesAsync"
        :model-defaults="modelDefaults"
        ref="treeAsync"></tree>
  <button type="button" class="tree-reload-trigger" @click="reloadDemoChildNodes">Reload Root Children</button>
</div>
<script type='module'>
  import TreeView from "@grapoza/vue-tree"
  new Vue({
    components: {
      tree: TreeView
    },
    data() {
      return {
        modelDefaults: {
          loadChildrenAsync: this.loadChildrenAsync,
          deleteTitle: 'Delete this node',
          expanderTitle: 'Expand this node'
        }
      };
    },
    methods: {
      async loadChildrenAsync(parentModel) {
        const id = Date.now();
        return new Promise(resolve => setTimeout(resolve.bind(null, [
          {
            id: `async-child-node-${id}-1`,
            label: `Child ${id}-1`
          },
          {
            id: `async-child-node-${id}-2`,
            label: `Child ${id}-2`,
            treeNodeSpec: { deletable: true }
          }
        ]), 1000));
      },
      async loadNodesAsync() {
        return new Promise(resolve => setTimeout(resolve.bind(null, [
          {
            id: "async-rootnode",
            label: "Root Node"
          }
        ]), 1000));
      },
      reloadDemoChildNodes() {
        this.$refs.treeAsync.reloadNodeChildren('async-rootnode');
      }
    }
  }).$mount('#app-async');
</script>
```
```{=html5}
</details>
```

```{=html5}
<div id="app-async" class="demo-tree">
    <tree id="customtree-async"
          :load-nodes-async="loadNodesAsync"
          :model-defaults="modelDefaults"
          ref="treeAsync"></tree>
    <button type="button" class="tree-reload-trigger" @click="reloadDemoChildNodes">Reload Root Children</button>
</div>
<script type='module'>
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            modelDefaults: {
                loadChildrenAsync: this.loadChildrenAsync,
                deleteTitle: 'Delete this node',
                expanderTitle: 'Expand this node'
            }
        };
      },
      methods: {
        async loadChildrenAsync(parentModel) {
          const id = Date.now();
          return new Promise(resolve => setTimeout(resolve.bind(null, [
            {
              id: `async-child-node-${id}-1`,
              label: `Child ${id}-1`
            },
            {
              id: `async-child-node-${id}-2`,
              label: `Child ${id}-2`,
              treeNodeSpec: { deletable: true }
            }
          ]), 1000));
        },
        async loadNodesAsync() {
          return new Promise(resolve => setTimeout(resolve.bind(null, [
            {
              id: "async-rootnode",
              label: "Root Node"
            }
          ]), 1000));
        },
        reloadDemoChildNodes() {
          this.$refs.treeAsync.reloadNodeChildren('async-rootnode');
        }
      }
    }).$mount('#app-async');
</script>
```

<!--- -------------------------------------------------------------------------------------- --->
### Custom Styles

Custom styling is achieved through a combination of using the `customizations` property of TreeViewNode data to apply custom styles to parts of nodes, along with a custom `skinStyle` TreeView prop and associated stylesheet. Of course, you could also just write some very specific selectors to override the default styles. For more info, see [the docs](./#customizing-the-treeview).

First, let's look at the default styles. There's not much to see here, since the intention is for the user to handle styling the treeview while the component focuses on creating a workable structure. Things generally line up right, but not much more can be said for it.

```{=html5}
<details>
<summary>
```
```html
<tree id="customtree-default" :initial-model="model" :model-defaults="modelDefaults"></tree>
```
```{=html5}
</summary>
```
<!--- The leading spaces are to render the html aligned correctly --->
```html
  <div id="app-custom-default" class="demo-tree">
  <tree id="customtree-default" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
  import TreeView from "@grapoza/vue-tree"
  new Vue({
    components: {
      tree: TreeView
    },
    data() {
      return {
        childCounter: 0,
        model: [
          {
            id: 'rootNode',
            label: 'Root Node',
            children: [
              {
                id: 'subNode',
                label: 'Subnode'
              }
            ]
          }
        ],
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
        return Promise.resolve({ id: `child-node${this.childCounter}`, label: `Added Child ${this.childCounter}`, treeNodeSpec: { deletable: true } });
      }
    }
  }).$mount('#app-custom-default');
</script>
```
```{=html5}
</details>
```

```{=html5}
<div id="app-custom-default" class="demo-tree">
    <tree id="customtree-default" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            childCounter: 0,
            model: [
              {
                id: 'rootNode',
                label: 'Root Node',
                children: [
                  {
                    id: 'subNode',
                    label: 'Subnode'
                  }
                ]
              }
            ],
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
          return Promise.resolve({ id: `child-node${this.childCounter}`, label: `Added Child ${this.childCounter}`, treeNodeSpec: { deletable: true } });
        }
      }
    }).$mount('#app-custom-default');
</script>
```

Some simple customizations can be done by applying custom classes to various parts of the tree using the `customizations` property, most likely in the `modelDefaults` parameter of the TreeView itself. In this example, `customizations.classes.treeViewNodeSelfText` is given a value of `big-text`. The `big-text` class is defined in a [classbased.css stylesheet](./style/demo/classbased.css).

```{=html5}
<details>
<summary>
```
```html
<tree id="customtree-classbased" :initial-model="model" :model-defaults="modelDefaults"></tree>
```
```{=html5}
</summary>
```
<!--- The leading spaces are to render the html aligned correctly --->
```html
  <div id="app-custom-classbased" class="demo-tree">
  <tree id="customtree-classbased" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
  import TreeView from "@grapoza/vue-tree"
  new Vue({
    components: {
      tree: TreeView
    },
    data() {
      return {
        childCounter: 0,
        model: [
          {
            id: 'rootNode',
            label: 'Root Node',
            children: [
              {
                id: 'subNode',
                label: 'Subnode'
              }
            ]
          }
        ],
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
        return Promise.resolve({ id: `child-node${this.childCounter}`, label: `Added Child ${this.childCounter}`, treeNodeSpec: { deletable: true } });
      }
    }
  }).$mount('#app-custom-classbased');
</script>
```
```{=html5}
</details>
```

```{=html5}
<div id="app-custom-classbased" class="demo-tree">
    <tree id="customtree-classbased" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            childCounter: 0,
            model: [
              {
                id: 'rootNode',
                label: 'Root Node',
                children: [
                  {
                    id: 'subNode',
                    label: 'Subnode'
                  }
                ]
              }
            ],
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
          return Promise.resolve({ id: `child-node${this.childCounter}`, label: `Added Child ${this.childCounter}`, treeNodeSpec: { deletable: true } });
        }
      }
    }).$mount('#app-custom-classbased');
</script>
```

In the next example, a treeview has been given a `skin-class` prop value of `grayscale`. This effectively swaps out a class named `grtv-default-skin` on the TreeView for the one specified as the `skin-class`. This _completely removes_ the default styling. To provide new styles, a [new stylesheet](./style/demo/grayscale.css) was created based on the default styles (copied right from the browser). This gives complete control of the styling, allowing for easier usage of things like Font Awesome as seen here.

```{=html5}
<details>
<summary>
```
```html
<tree id="customtree-gray" :initial-model="model" :model-defaults="modelDefaults" :skin-class="'grayscale'"></tree>
```
```{=html5}
</summary>
```
<!--- The leading spaces are to render the html aligned correctly --->
```html
  <div id="app-custom-gray" class="demo-tree">
  <tree id="customtree-gray" :initial-model="model" :model-defaults="modelDefaults" :skin-class="'grayscale'"></tree>
</div>
<script type='module'>
  import TreeView from "@grapoza/vue-tree"
  new Vue({
    components: {
      tree: TreeView
    },
    data() {
      return {
        childCounter: 0,
        model: [
          {
            id: 'rootNode',
            label: 'Root Node',
            children: [
              {
                id: 'subNode',
                label: 'Subnode'
              }
            ]
          }
        ],
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
        return Promise.resolve({ id: `child-node${this.childCounter}`, label: `Added Child ${this.childCounter}`, treeNodeSpec: { deletable: true } });
      }
    }
  }).$mount('#app-custom-gray');
</script>
```
```{=html5}
</details>
```

```{=html5}
<div id="app-custom-gray" class="demo-tree">
    <tree id="customtree-gray" :initial-model="model" :model-defaults="modelDefaults" :skin-class="'grayscale'"></tree>
</div>
<script type='module'>
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            childCounter: 0,
            model: [
              {
                id: 'rootNode',
                label: 'Root Node',
                children: [
                  {
                    id: 'subNode',
                    label: 'Subnode'
                  }
                ]
              }
            ],
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
          return Promise.resolve({ id: `child-node${this.childCounter}`, label: `Added Child ${this.childCounter}`, treeNodeSpec: { deletable: true } });
        }
      }
    }).$mount('#app-custom-gray');
</script>
```

<!--- -------------------------------------------------------------------------------------- --->
### Drag and Drop

You can drag a node that has the `draggable` property in a node's `treeNodeSpec` set to `true`. Any node with `allowDrop` set to `true` in the `treeNodeSpec` can accept a drop from any TreeView.

```{=html5}
<details>
<summary>
```
```html
<tree id="customtree-dnd" :initial-model="model" :model-defaults="modelDefaults"></tree>
```
```{=html5}
</summary>
```
<!--- The leading spaces are to render the html aligned correctly --->
```html
  <div id="app-dnd" class="demo-tree">
  <tree id="customtree-dnd" :initial-model="model" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
  import TreeView from "@grapoza/vue-tree"
  new Vue({
    components: {
      tree: TreeView
    },
    data() {
      return {
        model: [
          {
            id: "dnd-rootnode",
            label: "Root Node",
            children: [
              {
                id: "child-1",
                label: "Subnode 1"
              },
              {
                id: "child-2",
                label: "Subnode 2"
              }
            ]
          }
        ],
        modelDefaults: {
          draggable: true,
          allowDrop: true
        }
      };
    }
  }).$mount('#app-dnd');
</script>
```
```{=html5}
</details>
```

```{=html5}
<div id="app-dnd" class="demo-tree">
    <h4>Tree 1</h4>
    <tree id="customtree-dnd-1" :initial-model="model1" :model-defaults="modelDefaults"></tree>
    <h4>Tree 2</h4>
    <tree id="customtree-dnd-2" :initial-model="model2" :model-defaults="modelDefaults"></tree>
</div>
<script type='module'>
    new Vue({
      components: {
        tree: window['vue-tree']
      },
      data() {
        return {
            model1: [
              {
                id: "dnd-rootnode-1",
                label: "Root Node 1",
                children: [
                  {
                    id: "child-1",
                    label: "Subnode 1"
                  },
                  {
                    id: "child-2",
                    label: "Subnode 2"
                  }
                ]
              }
            ],
            model2: [
              {
                id: "dnd-rootnode-2",
                label: "Root Node 2",
                children: [
                  {
                    id: "child-3",
                    label: "Subnode 3"
                  },
                  {
                    id: "child-4",
                    label: "Subnode 4"
                  }
                ]
              }
            ],
            modelDefaults: {
              draggable: true,
              allowDrop: true,
              state: {
                expanded: true
              }
            }
        };
      }
    }).$mount('#app-dnd');
</script>
```