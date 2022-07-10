<template>
  <tr :id="nodeId"
      :aria-expanded="ariaExpanded"
      role="row"
      class="grtgn-self"
      @click="$_grtgn_onClick"
      @dblclick="$_grtn_onDblclick"
      v-show="show">
    <td v-for="(column, index) in columns" :key="column.id">

      <span v-if="index === expanderColumnIndex">
        <span v-for="count in depth"
              :key="column.id + count"
              class="grtgn-self-spacer"
              :class="customClasses.treeGridNodeSelfSpacer"></span>

        <!-- Expander -->
        <button :id="expanderId"
                type="button"
                v-if="canExpand"
                aria-hidden="true"
                tabindex="-1"
                :title="tns.expanderTitle"
                class="grtgn-self-expander"
                :class="[customClasses.treeGridNodeSelfExpander,
                        tns.state.expanded ? 'grtgn-self-expanded' : '',
                        tns.state.expanded ? customClasses.treeGridNodeSelfExpanded : '']"
                @click="$_grtgn_onExpandedChange">
                <i class="grtgn-self-expanded-indicator"
                  :class="customClasses.treeGridNodeSelfExpandedIndicator"></i></button>
        <span v-else
              class="grtgn-self-spacer"
              :class="customClasses.treeGridNodeSelfSpacer"></span>

        {{ model[column.field] }}
      </span>

      <!-- Inputs and labels -->
      <span v-else-if="index === inputColumnIndex">

        <!-- Checkbox -->
        <slot v-if="tns.input && tns.input.type === 'checkbox'"
              name="checkbox"
              :model="model"
              :customClasses="customClasses"
              :inputId="inputId"
              :checkboxChangeHandler="$_grtgn_onCheckboxChange">

          <label :for="inputId"
                :title="tns.title"
                class="grtgn-self-label"
                :class="customClasses.treeGridNodeSelfLabel">

            <input :id="inputId"
                  tabindex="-1"
                  class="grtgn-self-input grtgn-self-checkbox"
                  :class="[customClasses.treeGridNodeSelfInput, customClasses.treeGridNodeSelfCheckbox]"
                  type="checkbox"
                  :disabled="tns.state.input.disabled"
                  v-model="tns.state.input.value"
                  @change="$_grtgn_onCheckboxChange" />

            {{ model[column.field] }}
          </label>
        </slot>

        <!-- Radiobutton -->
        <slot v-else-if="tns.input && tns.input.type === 'radio'"
              name="radio"
              :model="model"
              :customClasses="customClasses"
              :inputId="inputId"
              :inputModel="radioGroupValues[tns.input.name]"
              :radioChangeHandler="$_grtgn_onRadioChange">

          <label :for="inputId"
                :title="tns.title"
                class="grtgn-self-label"
                :class="customClasses.treeGridNodeSelfLabel">

            <input :id="inputId"
                  tabindex="-1"
                  class="grtgn-self-input grtgn-self-radio"
                  :class="[customClasses.treeGridNodeSelfInput, customClasses.treeGridNodeSelfRadio]"
                  type="radio"
                  :name="tns.input.name"
                  :value="tns.input.value"
                  :disabled="tns.state.input.disabled"
                  v-model="radioGroupValues[tns.input.name]"
                  @change="$_grtgn_onRadioChange" />

            {{ label }}
          </label>
        </slot>

        <span v-else class="grtgn-self-input grtgn-self-omit-input">
          {{ model[column.field] }}
        </span>
      </span>

      <!-- Text (if not an input) -->
      <slot v-else
            name="text"
            :model="model"
            :column="column"
            :customClasses="customClasses">

        <span :title="tns.title"
              class="grtgn-self-text"
              :class="customClasses.treeGridNodeSelfText">
          {{ model[column.field] }}
        </span>
      </slot>

    </td>
  </tr>
  <template v-if="this.hasChildren">
    <tree-grid-node v-for="(nodeModel) in children"
                    :key="nodeModel[tns && tns.idProperty ? tns.idProperty : 'id']"
                    :columns="columns"
                    :depth="depth + 1"
                    :model-defaults="modelDefaults"
                    :initial-model="nodeModel"
                    :show="tns.state.expanded"
                    :tree-id="treeId"
                    :initial-radio-group-values="radioGroupValues"
                    :expander-column-index="expanderColumnIndex"
                    :input-column-index="inputColumnIndex"
                    @treeNodeClick="(t, e)=>$emit(TgEvent.Click, t, e)"
                    @treeNodeDblclick="(t, e)=>$emit(TgEvent.DoubleClick, t, e)"
                    @treeNodeCheckboxChange="(t, e)=>$emit(TgEvent.CheckboxChange, t, e)"
                    @treeNodeRadioChange="(t, e)=>$emit(TgEvent.RadioChange, t, e)"
                    @treeNodeExpandedChange="(t, e)=>$emit(TgEvent.ExpandedChange, t, e)"
                    @treeNodeChildrenLoad="(t, e)=>$emit(TgEvent.ChildrenLoad, t, e)">

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
  </template>
</template>


<script>
  import TreeNode from './TreeNode.vue';
  import TreeEvent from '../enums/event';

  export default {
    extends: TreeNode,
    name: 'TreeGridNode',
    props: {
      columns: {
        type: Array,
        required: true
      },
      expanderColumnIndex: {
        type: Number,
        required: true
      },
      inputColumnIndex: {
        type: Number,
        required: false,
        default: -1
      },
      show: {
        type: Boolean,
        required: true
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
        elementsThatIgnoreClicks: 'input, .grtgn-self-expander, .grtgn-self-expander *, .grtgn-self-action, .grtgn-self-action *',
      };
    },
    computed: {
      TgEvent() {
        return TreeEvent;
      }
    },
    methods: {
      /**
       * Pass the event for checkbox changes up from the node.
       * Emits a treeNodeCheckboxChange event
       * @param {Event} event The event that triggered the change
       */
      $_grtgn_onCheckboxChange(event) {
        this.$emit(TreeEvent.CheckboxChange, this.model, event);
      },
      /**
       * Pass the event for radio button changes up from the node.
       * Emits a treeNodeRadioChange event
       * @param {Event} event The event that triggered the change
       */
      $_grtgn_onRadioChange(event) {
        this.$emit(TreeEvent.RadioChange, this.model, event);
      },
      /**
       * Expand the children of this node, starting an asynchronous load if needed.
       * Emits a treeNodeExpandedChange event. When children are loaded asynchronously,
       * Emits a treeNodeChildrenLoad event.
       * @param {Event} event The event that triggered the expansion toggle
       */
      async $_grtgn_onExpandedChange(event) {
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
       * Handles clicks on the node. It only performs actions if the click happened on an element
       * that does not have node clicks explicitly ingored (e.g., the expander button).
       * Emits a treeNodeClick event.
       * @param {Event} event The click event
       */
      $_grtgn_onClick(event) {
        // Don't fire this if the target is an element which has its own events
        if (!matches(event.target, this.elementsThatIgnoreClicks)) {
          this.$emit(TreeEvent.Click, this.model, event);

          // TODO - Selection modes?
          //this.$_grtgn_toggleSelected(event);
        }

        // TODO - Aria Click handling for focus
        // this.$_grtgnAria_onClick();
      },
    }
  };
</script>

<style>
  /* Everything's in a .grtg-wrapper (embedded CSS is the 'grtg-default-skin' skin) */
  .grtg-wrapper.grtg-default-skin {
    --baseHeight: 1.2rem;
    --itemSpacing: 1.2rem;
  }

  /* Spacing */
  .grtg-wrapper.grtg-default-skin .grtgn-self-expander,
  .grtg-wrapper.grtg-default-skin .grtgn-self-checkbox,
  .grtg-wrapper.grtg-default-skin .grtgn-self-radio,
  .grtg-wrapper.grtg-default-skin .grtgn-self-spacer,
  .grtg-wrapper.grtg-default-skin .grtgn-self-action {
    display: inline-block;
    min-width: 1rem;
  }

  /* The expander button and indicator content */
  .grtg-wrapper.grtg-default-skin .grtgn-self-expander {
    padding: 0;
    background: none;
    border: none;
    height: var(--baseHeight);
  }

  .grtg-wrapper.grtg-default-skin .grtgn-self-expander i.grtgn-self-expanded-indicator {
    font-style: normal;
  }

  .grtg-wrapper.grtg-default-skin .grtgn-self-expander i.grtgn-self-expanded-indicator::before {
    content: '+';
  }

  .grtg-wrapper.grtg-default-skin .grtgn-self-expander.grtgn-self-expanded i.grtgn-self-expanded-indicator::before {
    content: '-';
  }

  .grtg-wrapper.grtg-default-skin .grtgn-self-checkbox,
  .grtg-wrapper.grtg-default-skin .grtgn-self-radio {
    margin: 0 0 0 calc(-1 * var(--itemSpacing));
  }

  .grtg-wrapper.grtg-default-skin .grtgn-self-text,
  .grtg-wrapper.grtg-default-skin .grtgn-self-label,
  .grtg-wrapper.grtg-default-skin .grtgn-self-omit-input {
    margin-left: var(--itemSpacing);
  }
</style>