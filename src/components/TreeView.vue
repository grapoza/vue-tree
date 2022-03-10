<template>
  <div ref="treeElement"
       class="grtv-wrapper"
       :class="skinClass">
    <slot v-if="!areNodesLoaded"
          name="loading-root">

      <span class="grtv-loading">
        ...
      </span>
    </slot>
    <ul class="grtv"
        role="tree"
        :aria-multiselectable="ariaMultiselectable"
        v-if="areNodesLoaded">
      <tree-view-node v-for="(nodeModel) in model"
                      :key="nodeModel[nodeModel.treeNodeSpec && nodeModel.treeNodeSpec.idProperty ? nodeModel.treeNodeSpec.idProperty : 'id']"
                      :aria-key-map="ariaKeyMap"
                      :depth="0"
                      :model-defaults="modelDefaults"
                      :initial-model="nodeModel"
                      :selection-mode="selectionMode"
                      :tree-id="uniqueId"
                      :is-mounted="isMounted"
                      :initial-radio-group-values="radioGroupValues"
                      @treeNodeClick="(t, e)=>$emit(TreeEvent.Click, t, e)"
                      @treeNodeDblclick="(t, e)=>$emit(TreeEvent.DoubleClick, t, e)"
                      @treeNodeCheckboxChange="(t, e)=>$emit(TreeEvent.CheckboxChange, t, e)"
                      @treeNodeRadioChange="(t, e)=>$emit(TreeEvent.RadioChange, t, e)"
                      @treeNodeExpandedChange="(t, e)=>$emit(TreeEvent.ExpandedChange, t, e)"
                      @treeNodeChildrenLoad="(t, e)=>$emit(TreeEvent.ChildrenLoad, t, e)"
                      @treeNodeSelectedChange="$_grt_handleNodeSelectedChange"
                      @treeNodeAdd="(t, p, e)=>$emit(TreeEvent.Add, t, p, e)"
                      @treeNodeDelete="$_grtv_handleChildDeletion"
                      @treeNodeAriaFocusableChange="$_grtvAria_handleFocusableChange"
                      @treeNodeAriaRequestFirstFocus="$_grtvAria_focusFirstNode"
                      @treeNodeAriaRequestLastFocus="$_grtvAria_focusLastNode"
                      @treeNodeAriaRequestPreviousFocus="$_grtvAria_handlePreviousFocus"
                      @treeNodeAriaRequestNextFocus="$_grtvAria_handleNextFocus"
                      @treeNodeDragMove="$_grtvDnd_dragMoveNode"
                      @treeNodeDrop="$_grtvDnd_drop">

        <template #checkbox="{ model, customClasses, inputId, checkboxChangeHandler }">
          <slot name="checkbox" :model="model" :customClasses="customClasses" :inputId="inputId" :checkboxChangeHandler="checkboxChangeHandler"></slot>
        </template>
        <template #radio="{ model, customClasses, inputId, radioGroupValues, radioChangeHandler }">
          <slot name="radio" :model="model" :customClasses="customClasses" :inputId="inputId" :radioGroupValues="radioGroupValues" :radioChangeHandler="radioChangeHandler"></slot>
        </template>
        <template #text="{ model, customClasses }">
          <slot name="text" :model="model" :customClasses="customClasses"></slot>
        </template>
        <template #loading="{ model, customClasses }">
          <slot name="loading" :model="model" :customClasses="customClasses"></slot>
        </template>
      </tree-view-node>
    </ul>
  </div>
</template>

<script>
  import Tree from './Tree.vue';
  import TreeViewAria from '../mixins/TreeViewAria';
  import TreeViewDragAndDrop from '../mixins/TreeViewDragAndDrop';
  import TreeViewNode from './TreeViewNode.vue';
  import TreeEvent from '../enums/event';

  export default {
    extends: Tree,
    name: 'TreeView',
    mixins: [
      TreeViewAria,
      TreeViewDragAndDrop
    ],
    components: {
      TreeViewNode
    },
    props: {
      skinClass: {
        type: String,
        required: false,
        default: 'grtv-default-skin',
        validator: function (value) {
          return value === null || !value.match(/\s/);
        }
      }
    },
    emits: [
      TreeEvent.Add,
      TreeEvent.CheckboxChange,
      TreeEvent.ChildrenLoad,
      TreeEvent.Click,
      TreeEvent.Delete,
      TreeEvent.DoubleClick,
      TreeEvent.ExpandedChange,
      TreeEvent.RadioChange,
      TreeEvent.RootNodesLoad,
      TreeEvent.SelectedChange
    ],
    data() {
      return {
        isMounted: false
      };
    },
    methods: {
      /**
       * Removes the given node from the array of children if found.
       * Note that only the node that was deleted fires these, not any subnode, so
       * this comes from a request from the child node for this node to delete it.
       * This emits the treeNodeDelete event.
       * @param node {TreeViewNode} The node to remove
       * @param event {Event} The initial event that triggered the deletion
       */
      $_grtv_handleChildDeletion(node, event) {
        let targetIndex = this.model.indexOf(node);
        if (targetIndex > -1) {
          this.$_grtvAria_handleNodeDeletion(node);
          this.model.splice(targetIndex, 1);
        }

        this.$emit(TreeEvent.Delete, node, event);
      }
    }
  };
</script>

<style>

  /* Embedded SCSS is the 'grtv-default-skin' skin */
  .grtv-wrapper.grtv-default-skin > .grtv {
    margin: 0;
    padding: 0;
    list-style: none;
  }

</style>