<template>
  <div ref="treeElement"
       class="grtg-wrapper"
       :class="skinClass">
    <slot v-if="!areNodesLoaded"
          name="loading-root">

      <span class="grtg-loading">
        ...
      </span>
    </slot>
    <table class="grtg"
           role="treegrid"
           :aria-multiselectable="ariaMultiselectable"
           v-if="areNodesLoaded">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.id">{{ column.header }}</th>
        </tr>
      </thead>
      <tbody>
        <tree-grid-node v-for="(nodeModel) in model"
                        :key="nodeModel[nodeModel.treeNodeSpec && nodeModel.treeNodeSpec.idProperty ? nodeModel.treeNodeSpec.idProperty : 'id']"
                        :columns="columns"
                        :depth="0"
                        :model-defaults="modelDefaults"
                        :initial-model="nodeModel"
                        :show="true"
                        :tree-id="uniqueId"
                        :initial-radio-group-values="radioGroupValues"
                        :expander-column-index="expanderColumnIndex"
                        :input-column-index="inputColumnIndex"
                        @treeNodeClick="(t, e)=>$emit(TreeEvent.Click, t, e)"
                        @treeNodeDblclick="(t, e)=>$emit(TreeEvent.DoubleClick, t, e)"
                        @treeNodeCheckboxChange="(t, e)=>$emit(TreeEvent.CheckboxChange, t, e)"
                        @treeNodeRadioChange="(t, e)=>$emit(TreeEvent.RadioChange, t, e)"
                        @treeNodeExpandedChange="(t, e)=>$emit(TreeEvent.ExpandedChange, t, e)"
                        @treeNodeChildrenLoad="(t, e)=>$emit(TreeEvent.ChildrenLoad, t, e)"
                        @treeNodeSelectedChange="$_grt_handleNodeSelectedChange">

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
        </tree-grid-node>
      </tbody>
    </table>
  </div>
</template>

<script>
  import Tree from './Tree.vue';
  import TreeGridNode from './TreeGridNode.vue';
  import TreeEvent from '../enums/event';

  export default {
    extends: Tree,
    name: 'TreeGrid',
    components: {
      TreeGridNode
    },
    props: {
      columns: {
        type: Array,
        required: true
      },
      inputColumnIndex: {
        type: Number,
        required: false,
        default: 0,
        validator: function(value) {
          return value >= 0;
        }
      },
      skinClass: {
        type: String,
        required: false,
        default: 'grtg-default-skin',
        validator: function (value) {
          return value === null || !value.match(/\s/);
        }
      },
      expanderColumnIndex: {
        type: Number,
        required: false,
        default: 0,
        validator: function(value) {
          return value >= 0;
        }
      }
    },
    emits: [
      TreeEvent.Click,
      TreeEvent.DoubleClick,
      TreeEvent.CheckboxChange,
      TreeEvent.RadioChange,
      TreeEvent.ExpandedChange,
      TreeEvent.ChildrenLoad
    ],
    data() {
      return {
      };
    }
  };
</script>

<style lang="scss">

  // Embedded SCSS is the 'grtg-default-skin' skin
  .grtg-wrapper.grtg-default-skin {

    > .grtg {
      margin: 0;
      padding: 0;
    }
  }

</style>