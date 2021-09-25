<script>
  import NodeDataNormalizer from '../mixins/NodeDataNormalizer';
  import TreeEvent from '../enums/event';

  export default {
    name: 'TreeNode',
    mixins: [
        NodeDataNormalizer
    ],
    props: {
      depth: {
        type: Number,
        required: true
      },
      initialModel: {
        type: Object,
        required: true
      },
      initialRadioGroupValues: {
        type: Object,
        required: true
      },
      modelDefaults: {
        type: Object,
        required: true
      },
      treeId: {
        type: String,
        required: true
      }
    },
    emits: [
      TreeEvent.DoubleClick
    ],
    data() {
      return {
        model: this.initialModel,
        radioGroupValues: this.initialRadioGroupValues
      }
    },
    computed: {
      areChildrenLoaded() {
        const tns = this.tns;
        return typeof tns.loadChildrenAsync !== 'function' || tns._.state.areChildrenLoaded;
      },
      ariaExpanded() {
        return this.canExpand ? this.tns.state.expanded : null;
      },
      canExpand() {
        // A node can be expanded if it is expandable and either has children or has not
        // yet had the asynchronous loader for children called.
        return this.mayHaveChildren && this.tns.expandable;
      },
      children() {
        return this.model[this.childrenPropName];
      },
      childrenPropName() {
        return this.tns.childrenProperty || 'children';
      },
      customClasses() {
        return (this.tns.customizations || {}).classes || {};
      },
      expanderId() {
        return `${this.nodeId}-exp`;
      },
      hasChildren() {
        return this.children && this.children.length > 0;
      },
      id() {
        return this.model[this.idPropName];
      },
      idPropName() {
        return this.tns.idProperty || 'id';
      },
      inputId() {
        return `${this.nodeId}-input`;
      },
      label() {
        return this.model[this.labelPropName];
      },
      labelPropName() {
        return this.tns.labelProperty || 'label';
      },
      mayHaveChildren() {
        return this.hasChildren || !this.areChildrenLoaded;
      },
      nodeId() {
        return `${this.treeId}-${this.id}`;
      },
      tns() {
        return this.model.treeNodeSpec;
      }
    },
    created() {

      this.$_grndn_normalizeNodeData();

      // id and label are required; notify the user. Validation is done here instead
      // of at the prop level due to dependency on multiple props at once and defaulting
      // that takes place in the normalization process
      if (!this.id || (typeof this.id !== 'number' && typeof this.id !== 'string')) {
        console.error(`initialModel id is required and must be a number or string. Expected prop ${this.idPropName} to exist on the model.`);
      }
    },
    methods: {
      /**
       * Handles double clicks on the node. It only performs actions if the double click happened on an
       * element that does not have node clicks explicitly ingored (e.g., the expander button).
       * Emits a treeNodeDblclick event.
       * @param {Event} event The dblclick event
       */
      $_grtn_onDblclick(event) {
        // Don't fire this if the target is an element which has its own events
        if (!event.target.matches(this.elementsThatIgnoreClicks)) {
          this.$emit(TreeEvent.DoubleClick, this.model, event);
        }
      },
    }
  };
</script>