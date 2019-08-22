## Overview

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build status](https://ci.appveyor.com/api/projects/status/j8d19gt0vh16amhh/branch/master?svg=true)](https://ci.appveyor.com/project/Gregg/vue-tree/branch/master)

vue-tree is a Vue component that implements a TreeView control. Its aim is to provide common tree options in a way that is easy to use and easy to customize.

**The Component is still pre-1.0 and should be considered unstable. Breaking changes may occur at any time before the 1.0 release.**

Features include:

- Functions in modern browsers using the precompiled scripts, or can be included in your babel/webpack chain.
- Expandable nodes
- Checkboxes
- Radio buttons
- Addition and removal of nodes
- Slots for node content
- Follows ARIA guidelines for treeview accessibility

Planned:

- Node selection ([#5](https://github.com/grapoza/vue-tree/issues/5))
- Async loading ([#13](https://github.com/grapoza/vue-tree/issues/13))
- Icons ([#22](https://github.com/grapoza/vue-tree/issues/22))
- Searching ([#4](https://github.com/grapoza/vue-tree/issues/4))
- Drag n' Drop ([#6](https://github.com/grapoza/vue-tree/issues/6))

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

## Demos

To see it in action, try out the [demos](demo/demos.html).

## Tree Props

| Prop             | Type     | Description                                                                          | Default value                     | Required |
|:-----------------|:---------|:-------------------------------------------------------------------------------------|:----------------------------------|:---------|
| initialModel     | Array    | The data model containing [tree data](#tree-data)                                    | -                                 | Yes      |
| modelDefaults    | Object   | An object containing defaults for all nodes that do not specify the given properties | `{}`                              |          |
| radioGroupValues | Object   | An object, the properties of which correspond to radio button group selections       | `{}`                              |          |
| customAriaKeyMap | Object   | An object, the properties of which are arrays to keyCodes for various actions        | See [Aria](#setting-key-bindings) |          |

## Model Data

The data passed to the treeview's `initialModel` prop should be an array of nodes, where each node has the following structure. The data model passed to the treeview may be updated by the treeview nodes themselves on creation to include missing properties.

```javascript
{
  id: "node0",
  label: "A checkbox node",
  title: "This will be the value of the node text/label's 'title' attribute.",
  expandable: true,
  selectable: false,
  focusable: true,
  input: {
    type: 'checkbox'
  },
  state: {
    expanded: true,
    selected: false,
    input: {
      value: false,
      disabled: false
    }
  },
  children: []
},
{
  id: "node1",
  label: "A radio button node",
  expandable: true,
  selectable: false,
  input: {
    type: 'radio',
    name: 'rbGroup1',  // Used as the name attribute for the radio button
    value: 'thisValue' // Used as the value attribute for the radio button
  },
  state: {
    expanded: true,
    selected: false
    // No input.value here; to let complex radio button groupings work, state value is
    // bound to a tree-level property. input.disabled, however, is valid here for radio buttons.
  },
  children: [],
  addChildCallback: () => Promise.resolve({ id: '1', label: 'label' })
}
```

The properties below can be specified for each node.

| Prop                 | Type            | Description                                                  | Default value                      | Required |
|:---------------------|:----------------|:-------------------------------------------------------------|:-----------------------------------|:---------|
| id                   | Number/String   | An ID that uniquely identifies this node within the tree     | -                                  | Yes      |
| label                | String          | The text to show in the treeview                             | -                                  | Yes      |
| title                | String          | The text of the node's text or label's title attribute       | `null`                             |          |
| expandable           | Boolean         | True to show a toggle for expanding nodes' subnode lists     | `true`                             |          |
| selectable           | Boolean         | True to allow the node to be selected*                       | `false`                            |          |
| deletable            | Boolean         | True to allow the node to be deleted                         | `false`                            |          |
| focusable            | Boolean         | True to make the node the focus when the treeview is focused | See [Aria](#focusable) for details |          |
| input                | Object          | Contains data specific to the node's `input` element         | `null`                             |          |
| input.type           | String          | The type of input; valid values are `checkbox` or `radio`    | -                                  | Yes**    |
| input.name           | String          | The name attribute of the input; used with `radio` type      | `'unspecifiedRadioName'`           |          |
| input.value          | String          | The value attribute of the input; used with `radio` type     | `label`'s value***                 |          |
| state                | Object          | Contains the current state of the node                       | -                                  |          |
| state.expanded       | Boolean         | True if this node's subnode list is expanded                 | `false`                            |          |
| state.selected       | Boolean         | True if the node is selected*                                | `false`                            |          |
| state.input          | Object          | Contains any state related to the input field                | `{}` for checkbox, otherwise -     |          |
| state.input.value    | Boolean         | Contains the value of the input                              | `false` for checkbox, otherwise -  |          |
| state.input.disabled | Boolean         | True if the node's input field is disabled                   | `false`                            |          |
| children             | Array\<Object\> | The child nodes of this node                                 | `[]`                               |          |
| customizations       | Object          | A [customizations](#customizing-treeviewnode-markup) object  | `{}`                               |          |
| addChildCallback     | Function        | An async function that resolves to a new node model          | `null`                             |          |

\* Selection props are unused; see [#5](https://github.com/grapoza/vue-tree/issues/5).

\*\* If `input.type` is not supplied, `input` is forced to `null`.

\*\*\* If `input.value` is not supplied, it defaults to `label`'s value replaced with `label.replace(/[\s&<>"'\/]/g, '')`

## Default Data

If specified, the `modelDefaults` property of the treeview will be merged with node model data such that any data not explicitly specified for the node will be set to the value from `modelDefaults`. This is useful for situations where all (or most) nodes will use the same values. For instance, in a treeview that is all enabled, collapsed, unchecked checkboxes the user could use a `modelDefaults` of

```javascript
{
  expandable: true,
  selectable: true,
  input: {
    type: 'checkbox',
  },
  state: {
    expanded: false,
    selected: false,
    input: {
      value: false,
      disabled: false
    }
  }
}
```

## Public Methods

| Method                 | Description                            | Parameters | Returns                                                     |
|:-----------------------|:---------------------------------------|:-----------|:------------------------------------------------------------|
| getCheckedCheckboxes   | Gets models for checked checkbox nodes |            | An `Array<Object>` of models for checked checkbox nodes     |
| getCheckedRadioButtons | Gets models for checked radio nodes    |            | An `Array<Object>` of models for checked radio button nodes |

## Events

| Event                       | Description                                             | Handler Parameters                                                     |
|:----------------------------|:--------------------------------------------------------|:-----------------------------------------------------------------------|
| treeViewNodeAdd             | Emitted when a node is added                            | `target` The model of the target (child) node <br/> `parent` The model of the parent node <br/> `event` The original event |
| treeViewNodeClick           | Emitted when a node is clicked                          | `target` The model of the target node <br/> `event` The original event |
| treeViewNodeDblclick        | Emitted when a node is double clicked                   | `target` The model of the target node <br/> `event` The original event |
| treeViewNodeDelete          | Emitted when a node is deleted                          | `target` The model of the target node <br/> `event` The original event |
| treeViewNodeCheckboxChange  | Emitted when a node's checkbox emits a change event     | `target` The model of the target node <br/> `event` The original event |
| treeViewNodeRadioChange     | Emitted when a node's radio button emits a change event | `target` The model of the target node <br/> `event` The original event |
| treeViewNodeExpandedChange  | Emitted when a node is expanded or collapsed            | `target` The model of the target node <br/> `event` The original event |

## CSS Classes

The display of the treeview can be customized via CSS using the following classes. Class names are organized in a hierarchy, so a containing node's class is the prefix of its child classes.

| Class                                    | Affects                                                                          |
|:-----------------------------------------|:---------------------------------------------------------------------------------|
| `tree-view`                              | The top-level tree view list                                                     |
| `tree-view-node`                         | A single node's list item                                                        |
| `tree-view-node-self`                    | The div containing the current node's UI                                         |
| `tree-view-node-self-expander`           | The button used to expand the children                                           |
| `tree-view-node-self-expanded`           | Applied to the expander button when the node is expanded                         |
| `tree-view-node-self-expanded-indicator` | The `<i>` element containing the expansion indicator                             |
| `tree-view-node-self-spacer`             | An empty spacer to replace fixed-width elements, _e.g._ the expander or checkbox |
| `tree-view-node-self-label`              | The label for the checkbox of checkable nodes                                    |
| `tree-view-node-self-input`              | Any type of input field within the tree node                                     |
| `tree-view-node-self-checkbox`           | The checkbox                                                                     |
| `tree-view-node-self-radio`              | The radio button                                                                 |
| `tree-view-node-self-text`               | The text for a non-input node                                                    |
| `tree-view-node-self-action`             | The action buttons (e.g., add child or delete)                                   |
| `tree-view-node-self-add-child-icon`     | The `<i>` element containing the add child icon                                  |
| `tree-view-node-self-delete-icon`        | The `<i>` element containing the delete icon                                     |
| `tree-view-node-children`                | The list of child nodes                                                          |

## Customizing the TreeView

### Customizations Property

It's often helpful to be able to make adjustments to the markup or styles for the tree. You can provide an object to the `modelDefaults.customizations` property of the tree to set a customization affecting all nodes, or to the `customizations` property of a single node. Node-specific customizations will override `modelDefault` customizations.

A customizations object may have the following properties:

| Prop                                      | Type   | Description                                                            |
|:------------------------------------------|:-------|:-----------------------------------------------------------------------|
| classes                                   | Object | Properties are classes to add for various parts of a node              |
| classes.treeViewNode                      | String | Classes to add to a node's list item                                   |
| classes.treeViewNodeSelf                  | String | Classes to add to the div containing the current node's UI             |
| classes.treeViewNodeSelfExpander          | String | Classes to add to the button used to expand the children               |
| classes.treeViewNodeSelfExpanded          | String | Classes to add to the expander button when the node is expanded        |
| classes.treeViewNodeSelfExpandedIndicator | String | Classes to add to the `<i>` element containing the expansion indicator |
| classes.treeViewNodeSelfSpacer            | String | Classes to add to the fixed-width spacer                               |
| classes.treeViewNodeSelfLabel             | String | Classes to add to the label for the checkbox of checkable nodes        |
| classes.treeViewNodeSelfInput             | String | Classes to add to an input field                                       |
| classes.treeViewNodeSelfCheckbox          | String | Classes to add to the checkbox                                         |
| classes.treeViewNodeSelfRadio             | String | Classes to add to the radio button                                     |
| classes.treeViewNodeSelfText              | String | Classes to add to the text for a non-input node                        |
| classes.treeViewNodeSelfAction            | String | Classes to add to the action buttons                                   |
| classes.treeViewNodeSelfAddChild          | String | Classes to add to the add child buttons                                |
| classes.treeViewNodeSelfAddChildIcon      | String | Classes to add to the `<i>` element containing the add child icon      |
| classes.treeViewNodeSelfDelete            | String | Classes to add to the delete button                                    |
| classes.treeViewNodeSelfDeleteIcon        | String | Classes to add to the `<i>` element containing the delete icon         |
| classes.treeViewNodeChildren              | String | Classes to add to the list of child nodes                              |

### Slots

Sometimes the entire content of a node (_e.g._, the checkbox or text) needs customization beyond what is available through classes. In this case, some slots are available in the TreeView to allow this customization.

| Slot Name | Description                                           | Props                                                                                              |
|:----------|:------------------------------------------------------|:---------------------------------------------------------------------------------------------------|
| text      | Replaces the span used for non-input content          | model - The TreeViewNode's model                                                                   |
|           |                                                       | customClasses - Any custom classes specified in `customizations`                                   |
| checkbox  | Replaces the label and content used for checkboxes    | model - The TreeViewNode's model                                                                   |
|           |                                                       | customClasses - Any custom classes specified in `customizations`                                   |
|           |                                                       | inputId - The ID for the input (as generated by the TreeViewNode)                                  |
|           |                                                       | checkboxChangeHandler - The handler for checkbox change events. You should fire this on `change`.  |
| radio     | Replaces the label and content used for radio buttons | model - The TreeViewNode's model                                                                   |
|           |                                                       | customClasses - Any custom classes specified in `customizations`                                   |
|           |                                                       | inputId - The ID for the input (as generated by the TreeViewNode)                                  |
|           |                                                       | radioChangeHandler - The handler for radio button change events. You should fire this on `change`. |

Example usage:

```html
<tree-view id="customtree" :initial-model="model">
  <template #text="{ model, customClasses }">
    <marquee :title="model.title" <!-- The tree view node's model is available -->
              class="tree-view-node-self-text" <!-- Built in classes and overrides are available -->
              :class="customClasses.treeViewNodeSelfText">
          {{ model.label }}
    <marquee>
  </template>

  <template #checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
    <label :for="inputId"
        :title="model.title"
        class="tree-view-node-self-label"
        :class="customClasses.treeViewNodeSelfLabel">

      <input :id="inputId" <!-- The generated inputId for the node is available -->
             class="my-awesome-checkbox-class"
             type="checkbox"
             :disabled="model.state.input.disabled"
             v-model="model.state.input.value"
             @change="checkboxChangeHandler" /> <!-- The TreeViewNode change handler is available -->

      <blink>{{ "Slotted Content for " + model.label }}</blink>
    </label>
  </template>
</tree-view>
```

## Aria

ARIA Accessibility recommendations have been implemented at a basic level. This means keyboard navigation follows ARIA recommendations, but the component has not been tested with a screen reader and, since many screen readers exhibit different behaviors for treeview controls anyway, it would be expected to fail articulation checks in many cases. Additionally, some recommended keyboard controls are not implemented (e.g., Expand All Nodes, Type-ahead Focusing). When using the component, there are only a couple of things you need to know.

### Setting Key Bindings

The keys used to navigate the treeview can be customized using the `customAriaKeyMap` prop of the TreeView component. The value of the prop is an object, with each attribute named for a type of action and its value as an Array of integer key codes that trigger that action.

| Attribute           | Description                                                                                            | Default value            |
|:--------------------|:-------------------------------------------------------------------------------------------------------|:-------------------------|
| activateItem        | Triggers the default action for input nodes (generally `click`)                                        | [13, 32] (Return, Space) |
| focusLastItem       | Sets focus to the last visible item in the tree                                                        | [35] (End)               |
| focusFirstItem      | Sets focus to the first visible item in the tree                                                       | [36] (Home)              |
| collapseFocusedItem | Collapses the currently focused item, if expanded; otherwise focuses the parent node if one exists     | [37] (Left)              |
| expandFocusedItem   | Expands the currently focused item, if collapsed; otherwise focuses the first child node if one exists | [39] (Right)             |
| focusPreviousItem   | Focuses the previous visible node* in the tree if one exists.                                          | [38] (Up)                |
| focusNextItem       | Focuses the next visible node** in the tree if one exists.                                             | [40] (Down)              |
| insertItem          | Fires the callback to add a new node if the callback exists                                            | [45] (Insert)            |
| deleteItem          | Deletes the current node, if deletable                                                                 | [46] (Delete)            |

\* The previous visible node is a)the focused node's previous sibling's last child if visible, b)the previous sibling if it has no children or is collapsed, or c)the parent node.

\*\* The next visible node is a)the focused node's first child if one exists and the focused node is expanded, b)the focused node's next sibling if one exists, or c)the focused node's parent's next sibling if one exists.

### Focusable

The treeview uses a roaming tab index to maintain focusability in the tree. A node model can specify a `focusable` property of `true` in order for that node to be intialized as the initial target of keyboard focus within the treeview. If multiple node models specify this then only the first will have `focusable` set to true once the treeview is intialized. If no models have it specified, then the first node in the treeview will have it assigned automatically.

### More about ARIA TreeViews

[WAI-ARIA Authoring Best Practices, Tree View](https://www.w3.org/TR/wai-aria-practices-1.1/#TreeView)