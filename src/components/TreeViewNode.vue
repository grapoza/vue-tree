<template>
  <!--
      A Component meant to be used internally by the TreeView component. See the documentation
      for a description of the expected data format.
  -->
  <li :id="nodeId"
      ref="nodeElement"
      class="grtvn"
      :class="[customClasses.treeViewNode,
               tns._.dragging ? 'grtvn-dragging' : '']"
      role="treeitem"
      :tabindex="ariaTabIndex"
      :aria-expanded="ariaExpanded"
      :aria-selected="ariaSelected"
      @keydown="$_grtvnAria_onKeyDown">

    <div class="grtvn-self"
         :class="[customClasses.treeViewNodeSelf,
                  isEffectivelySelected ? 'grtvn-self-selected' : '',
                  isEffectivelySelected ? customClasses.treeViewNodeSelfSelected : '',
                  tns._.isDropTarget ? 'grtvn-self-drop-target': '',
                  tns._.isChildDropTarget ? 'grtvn-self-child-drop-target': '']"
         :draggable="tns.draggable"
         :dragging="tns._.dragging"
         @click="$_grtvn_onClick"
         @dblclick="$_grtn_onDblclick"
         @dragend="$_grtvnDnd_onDragend"
         @dragenter="$_grtvnDnd_onDragenter"
         @dragleave="$_grtvnDnd_onDragleave"
         @dragover="$_grtvnDnd_onDragover"
         @dragstart="$_grtvnDnd_onDragstart"
         @drop="$_grtvnDnd_onDrop">

      <!-- Top Drop Target -->
      <div class="grtvn-self-sibling-drop-target grtvn-self-prev-target"
           :class="[tns._.isPrevDropTarget ? 'grtvn-self-sibling-drop-target-hover': '']"></div>

      <!-- Expander -->
      <button :id="expanderId"
              type="button"
              v-if="canExpand"
              aria-hidden="true"
              tabindex="-1"
              :title="tns.expanderTitle"
              class="grtvn-self-expander"
              :class="[customClasses.treeViewNodeSelfExpander,
                       tns.state.expanded ? 'grtvn-self-expanded' : '',
                       tns.state.expanded ? customClasses.treeViewNodeSelfExpanded : '']"
              @click="$_grtvn_onExpandedChange">
              <i class="grtvn-self-expanded-indicator"
                 :class="customClasses.treeViewNodeSelfExpandedIndicator"></i></button>
      <span v-else
            class="grtvn-self-spacer"
            :class="customClasses.treeViewNodeSelfSpacer"></span>

      <!-- Inputs and labels -->
      <!-- Checkbox -->
      <slot v-if="tns.input && tns.input.type === 'checkbox'"
            name="checkbox"
            :model="model"
            :customClasses="customClasses"
            :inputId="inputId"
            :checkboxChangeHandler="$_grtvn_onCheckboxChange">

        <label :for="inputId"
               :title="tns.title"
               class="grtvn-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 tabindex="-1"
                 class="grtvn-self-input grtvn-self-checkbox"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfCheckbox]"
                 type="checkbox"
                 :disabled="tns.state.input.disabled"
                 v-model="tns.state.input.value"
                 @change="$_grtvn_onCheckboxChange" />

          {{ label }}
        </label>
      </slot>

      <!-- Radiobutton -->
      <slot v-else-if="tns.input && tns.input.type === 'radio'"
            name="radio"
            :model="model"
            :customClasses="customClasses"
            :inputId="inputId"
            :inputModel="radioGroupValues[tns.input.name]"
            :radioChangeHandler="$_grtvn_onRadioChange">

        <label :for="inputId"
               :title="tns.title"
               class="grtvn-self-label"
               :class="customClasses.treeViewNodeSelfLabel">

          <input :id="inputId"
                 tabindex="-1"
                 class="grtvn-self-input grtvn-self-radio"
                 :class="[customClasses.treeViewNodeSelfInput, customClasses.treeViewNodeSelfRadio]"
                 type="radio"
                 :name="tns.input.name"
                 :value="tns.input.value"
                 :disabled="tns.state.input.disabled"
                 v-model="radioGroupValues[tns.input.name]"
                 @change="$_grtvn_onRadioChange" />

          {{ label }}
        </label>
      </slot>

      <!-- Text (if not an input) -->
      <slot v-else
            name="text"
            :model="model"
            :customClasses="customClasses">

        <span :title="tns.title"
              class="grtvn-self-text"
              :class="customClasses.treeViewNodeSelfText">
          {{ label }}
        </span>
      </slot>

      <!-- Add Child button -->
      <button :id="addChildId"
              type="button"
              v-if="tns.addChildCallback"
              aria-hidden="true"
              tabindex="-1"
              :title="tns.addChildTitle"
              class="grtvn-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfAddChild]"
              @click="$_grtvn_onAddChild">
        <i class="grtvn-self-add-child-icon"
            :class="customClasses.treeViewNodeSelfAddChildIcon"></i>
      </button>

      <!-- Delete button -->
      <button :id="deleteId"
              type="button"
              v-if="tns.deletable"
              aria-hidden="true"
              tabindex="-1"
              :title="tns.deleteTitle"
              class="grtvn-self-action"
              :class="[customClasses.treeViewNodeSelfAction, customClasses.treeViewNodeSelfDelete]"
              @click="$_grtvn_onDelete">
        <i class="grtvn-self-delete-icon"
            :class="customClasses.treeViewNodeSelfDeleteIcon"></i>
      </button>

      <!-- Bottom Drop Target -->
      <div class="grtvn-self-sibling-drop-target grtvn-self-next-target"
           :class="[tns._.isNextDropTarget ? 'grtvn-self-sibling-drop-target-hover': '']"></div>
    </div>

    <!-- Children and Loading Placholder -->
    <div class="grtvn-children-wrapper"
            :class="customClasses.treeViewNodeChildrenWrapper">
      <slot v-if="tns.state.expanded && !areChildrenLoaded"
            name="loading"
            :model="model"
            :customClasses="customClasses">

        <span class="grtvn-loading"
              :class="customClasses.treeViewNodeLoading">
          ...
        </span>
      </slot>
      <ul v-show="tns.state.expanded"
          v-if="this.hasChildren"
          class="grtvn-children"
          :class="customClasses.treeViewNodeChildren"
          role="group"
          :aria-hidden="!tns.state.expanded">
        <TreeViewNode v-for="nodeModel in children"
                      :key="nodeModel[tns && tns.idProperty ? tns.idProperty : 'id']"
                      :depth="depth + 1"
                      :initial-model="nodeModel"
                      :model-defaults="modelDefaults"
                      :parent-id="id"
                      :selection-mode="selectionMode"
                      :tree-id="treeId"
                      :initial-radio-group-values="radioGroupValues"
                      :aria-key-map="ariaKeyMap"
                      :is-mounted="isMounted"
                      @treeNodeClick="(t, e)=>$emit(TreeEvent.Click, t, e)"
                      @treeNodeDblclick="(t, e)=>$emit(TreeEvent.DoubleClick, t, e)"
                      @treeNodeCheckboxChange="(t, e)=>$emit(TreeEvent.CheckboxChange, t, e)"
                      @treeNodeRadioChange="(t, e)=>$emit(TreeEvent.RadioChange, t, e)"
                      @treeNodeExpandedChange="(t, e)=>$emit(TreeEvent.ExpandedChange, t, e)"
                      @treeNodeChildrenLoad="(t, e)=>$emit(TreeEvent.ChildrenLoad, t, e)"
                      @treeNodeSelectedChange="(t, e)=>$emit(TreeEvent.SelectedChange, t, e)"
                      @treeNodeAdd="(t, p, e)=>$emit(TreeEvent.Add, t, p, e)"
                      @treeNodeDelete="$_grtvn_handleChildDeletion"
                      @treeNodeAriaFocusableChange="(t)=>$emit(TreeEvent.FocusableChange, t)"
                      @treeNodeAriaRequestParentFocus="$_grtvnAria_focus"
                      @treeNodeAriaRequestFirstFocus="()=>$emit(TreeEvent.RequestFirstFocus)"
                      @treeNodeAriaRequestLastFocus="()=>$emit(TreeEvent.RequestLastFocus)"
                      @treeNodeAriaRequestPreviousFocus="$_grtvnAria_handlePreviousFocus"
                      @treeNodeAriaRequestNextFocus="$_grtvnAria_handleNextFocus"
                      @treeNodeDragMove="$_grtvnDnd_dragMoveChild"
                      @treeNodeDrop="$_grtvnDnd_drop">
          <template #checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
            <slot name="checkbox" :model="model" :customClasses="customClasses" :inputId="inputId" :checkboxChangeHandler="checkboxChangeHandler"></slot>
          </template>
          <template #radio="{ model, customClasses, inputId, inputModel, radioChangeHandler }">
            <slot name="radio" :model="model" :customClasses="customClasses" :inputId="inputId" :inputModel="inputModel" :radioChangeHandler="radioChangeHandler"></slot>
          </template>
          <template #text="{ model, customClasses }">
            <slot name="text" :model="model" :customClasses="customClasses"></slot>
          </template>
          <template #loading="{ model, customClasses }">
            <slot name="loading" :model="model" :customClasses="customClasses"></slot>
          </template>
        </TreeViewNode>
      </ul>
    </div>
  </li>
</template>

<script>
  import TreeNode from './TreeNode.vue';
  import TreeViewNodeAria from '../mixins/TreeViewNodeAria';
  import TreeViewNodeDragAndDrop from '../mixins/TreeViewNodeDragAndDrop';
  import SelectionMode from '../enums/selectionMode';
  import TreeEvent from '../enums/event';

  export default {
    extends: TreeNode,
    name: 'TreeViewNode',
    mixins: [
      TreeViewNodeAria,
      TreeViewNodeDragAndDrop
    ],
    props: {
      isMounted: {
        type: Boolean,
        required: true
      },
      selectionMode: {
        type: String,
        required: false,
        default: SelectionMode.None,
        validator: function (value) {
          return Object.values(SelectionMode).includes(value);
        }
      }
    },
    emits: [
      TreeEvent.Add,
      TreeEvent.Click,
      TreeEvent.CheckboxChange,
      TreeEvent.ChildrenLoad,
      TreeEvent.Delete,
      TreeEvent.ExpandedChange,
      TreeEvent.FocusableChange,
      TreeEvent.RadioChange,
      TreeEvent.RequestFirstFocus,
      TreeEvent.RequestLastFocus,
      TreeEvent.SelectedChange
    ],
    data() {
      return {
        elementsThatIgnoreClicks: 'input, .grtvn-self-expander, .grtvn-self-expander *, .grtvn-self-action, .grtvn-self-action *'
      }
    },
    computed: {
      addChildId() {
        return `${this.nodeId}-add-child`;
      },
      ariaSelected() {
        // If selection isn't allowed, don't add an aria-selected attribute.
        // If the tree contains nodes that are not selectable, those nodes do not have the aria-selected state.
        if (this.selectionMode === SelectionMode.None || !this.tns.selectable) {
          return null;
        }

        // https://www.w3.org/TR/wai-aria-practices-1.1/#tree_roles_states_props
        // If the tree does not support multiple selection, aria-selected is set to true
        // for the selected node and it is not present on any other node in the tree.
        if (this.selectionMode !== SelectionMode.Multiple) {
          return this.tns.state.selected ? true : null;
        }

        // If the tree supports multiple selection:
        //   All selected nodes have aria-selected set to true.
        //   All nodes that are selectable but not selected have aria-selected set to false.
        return this.tns.state.selected;
      },
      deleteId() {
        return `${this.nodeId}-delete`;
      },
      isEffectivelySelected() {
        return this.selectionMode !== SelectionMode.None && this.tns.selectable && this.tns.state.selected;
      },
      TreeEvent() {
        return TreeEvent;
      }
    },
    created() {
      // This runs after the parent component's created hook
      if(!this.label || typeof this.label !== 'string') {
        console.error(`initialModel label is required and must be a string. Expected prop ${this.labelPropName} to exist on the model.`);
      }
    },
    watch: {
      'model.treeNodeSpec.state.selected': function(newValue) {
          this.$emit(TreeEvent.SelectedChange, this.model);
      }
    },
    methods: {
      /**
       * Pass the event for checkbox changes up from the node.
       * Emits a treeNodeCheckboxChange event
       * @param {Event} event The event that triggered the change
       */
      $_grtvn_onCheckboxChange(event) {
        this.$emit(TreeEvent.CheckboxChange, this.model, event);
      },
      /**
       * Pass the event for radio button changes up from the node.
       * Emits a treeNodeRadioChange event
       * @param {Event} event The event that triggered the change
       */
      $_grtvn_onRadioChange(event) {
        this.$emit(TreeEvent.RadioChange, this.model, event);
      },
      /**
       * Expand the children of this node, starting an asynchronous load if needed.
       * Emits a treeNodeExpandedChange event. When children are loaded asynchronously,
       * Emits a treeNodeChildrenLoad event.
       * @param {Event} event The event that triggered the expansion toggle
       */
      async $_grtvn_onExpandedChange(event) {
        let spec = this.tns;

        // First expand the node (to show either children or a "loading" indicator)
        spec.state.expanded = !spec.state.expanded;
        this.$emit(TreeEvent.ExpandedChange, this.model, event);

        // If children need to be loaded asynchronously, load them.
        if (spec.state.expanded && !spec._.state.areChildrenLoaded && !spec._.state.areChildrenLoading) {

          spec._.state.areChildrenLoading = true;
          var childrenResult = await spec.loadChildrenAsync(this.model);

          if (childrenResult) {
            spec._.state.areChildrenLoaded = true;
            this.children.splice(0, this.children.length, ...childrenResult);
            this.$emit(TreeEvent.ChildrenLoad, this.model, event);
          }

          spec._.state.areChildrenLoading = false;
        }
      },
      /**
       * Handle toggling the selected state for this node for Single and Multiple selection modes.
       * Note that for SelectionFollowsFocus mode the selection change is already handled by the
       * "model.treeNodeSpec.focusable" watcher method in TreeViewNodeAria.
       * @param {Event} event The event that triggered the selection toggle
       */
      $_grtvn_toggleSelected(event) {
        if (this.tns.selectable && [SelectionMode.Single, SelectionMode.Multiple].includes(this.selectionMode)) {
          this.tns.state.selected = !this.tns.state.selected;
        }
      },
      /**
       * Handles clicks on the node. It only performs actions if the click happened on an element
       * that does not have node clicks explicitly ingored (e.g., the expander button).
       * Emits a treeNodeClick event.
       * @param {Event} event The click event
       */
      $_grtvn_onClick(event) {
        // Don't fire this if the target is an element which has its own events
        if (!event.target.matches(this.elementsThatIgnoreClicks)) {
          this.$emit(TreeEvent.Click, this.model, event);
          this.$_grtvn_toggleSelected(event);
        }

        this.$_grtvnAria_onClick();
      },
      /**
       * Add a child node to the end of the child nodes list. The child node data is
       * supplied by an async callback which is the addChildCallback parameter of this node's model.
       * Emits a treeNodeAdd if a node is added
       * @param {Event} event The event that triggered the add
       */
      async $_grtvn_onAddChild(event) {
        if (this.tns.addChildCallback) {
          var childModel = await this.tns.addChildCallback(this.model);

          if (childModel) {
            this.children.push(childModel);
            this.$emit(TreeEvent.Add, childModel, this.model, event);
          }
        }
      },
      $_grtvn_onDelete(event) {
        if (this.tns.deletable) {
          this.$emit(TreeEvent.Delete, this.model, event);
        }
      },
      /**
       * Removes the given node from the array of children if found.
       * Note that only the node that was deleted fires these, not any subnode, so
       * this comes from a request from the child node for this node to delete it.
       * This emits the treeNodeDelete event.
       * @param node {TreeViewNode} The node to remove
       * @param event {Event} The initial event that triggered the deletion
       */
      $_grtvn_handleChildDeletion(node, event) {
        // Remove the node from the array of children if this is an immediate child.
        // Note that only the node that was deleted fires these, not any subnode.
        let targetIndex = this.children.indexOf(node);
        if (targetIndex > -1) {
          this.$_grtvnAria_handleChildDeletion(node);
          this.children.splice(targetIndex, 1);
        }

        this.$emit(TreeEvent.Delete, node, event);
      }
    },
  };

</script>

<style lang="scss">
  $baseHeight: 1.2rem;
  $itemSpacing: 1.2rem;

  // Everything's in a .grtv-wrapper (embedded SCSS is the 'grtv-default-skin' skin)
  .grtv-wrapper.grtv-default-skin {

    // The node, including its content and children list
    .grtvn {
      padding-left: 0;

      &:first-child {
        margin-top: 0;
      }

      // ARIA styles
      &[role="treeitem"]:focus {
        outline: 0;

        >.grtvn-self {
          outline: black dotted 1px;
        }
      }
    }

    // The node's content, excluding the list of child nodes
    .grtvn-self {
      display: flex;
      align-items: flex-start;
      line-height: $baseHeight;
    }

    // Drag and Drop styles
    .grtvn-dragging .grtvn-self {
      opacity: 0.5;
    }

    .grtvn-self-drop-target {
      flex-wrap: wrap;

      &.grtvn-self-child-drop-target {
        opacity: .5;
      }

      .grtvn-self-sibling-drop-target {
        width: 100%;
        height: 7px;
        background-color: #dddddd;

        &.grtvn-self-sibling-drop-target-hover {
          background-color: #bbbbbb;
        }
      }
    }

    // The expander button and indicator content
    .grtvn-self-expander {
      padding: 0;
      background: none;
      border: none;
      height: $baseHeight;

      i.grtvn-self-expanded-indicator {
        font-style: normal;

        &::before {
          content: '+';
        }
      }

      &.grtvn-self-expanded {

        i.grtvn-self-expanded-indicator {

          &::before {
            content: '-';
          }
        }
      }
    }

    // The styling for when the node is selected
    .grtvn-self-selected {
      background-color: #f0f0f8;
    }

    // Spacing
    .grtvn-self-expander,
    .grtvn-self-checkbox,
    .grtvn-self-radio,
    .grtvn-self-spacer,
    .grtvn-self-action {
      min-width: 1rem;
    }

    .grtvn-self-expander,
    .grtvn-self-spacer {
      margin: 0;
    }

    .grtvn-self-checkbox,
    .grtvn-self-radio {
      margin: 0 0 0 (-$itemSpacing);
    }

    .grtvn-self-text,
    .grtvn-self-label {
      margin-left: $itemSpacing;
    }

    // Action buttons section
    .grtvn-self-action {
      padding: 0;
      background: none;
      border: none;
      height: $baseHeight;
    }

    // Action buttons (add, delete, etc)
    i.grtvn-self-add-child-icon {
      font-style: normal;

      &::before {
        content: '+';
      }
    }

    i.grtvn-self-delete-icon {
      font-style: normal;

      &::before {
        content: 'x';
      }
    }

    .grtvn-children-wrapper {
      margin: 0 0 0 (1rem + $itemSpacing);
    }

    // The node's child list
    .grtvn-children {
      padding: 0;
      list-style: none;
    }
  }
</style>
