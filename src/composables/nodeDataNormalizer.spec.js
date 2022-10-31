import { expect, describe, it, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useNodeDataNormalizer } from './nodeDataNormalizer.js';
import { generateNodes } from '../../tests/data/node-generator.js';

describe('nodeDataNormalizer.js', () => {

  describe('when given minimal model data', () => {

    let model;

    beforeEach(() => {
      model = { id: 'my-node', label: 'My Node' };
      const { normalizeNodeData } = useNodeDataNormalizer(ref(model), {}, ref({}));
      normalizeNodeData();
    });

    it('should normalize model data', () => {
      expect(model.id).to.equal('my-node');
      expect(model.label).to.equal('My Node');
      expect(model.treeNodeSpec.title).to.be.null;
      expect(model.treeNodeSpec.expandable).to.be.true;
      expect(model.treeNodeSpec.selectable).to.be.false;
      expect(model.treeNodeSpec.deletable).to.be.false;
      expect(model.treeNodeSpec.state).to.exist;
      expect(model.treeNodeSpec.state.expanded).to.be.false;
      expect(model.treeNodeSpec.state.selected).to.be.false;
      expect(model.treeNodeSpec.input).to.be.null;
      expect(model.treeNodeSpec.state.input).to.not.exist;
    });
  });

  describe('when given default model data', () => {

    let model;

    beforeEach(() => {
      model = { id: 'my-node', label: 'My Node', treeNodeSpec: { expandable: true } };
      const modelDefaults = {
        expandable: false,
        selectable: true,
        state: {
          selected: true
        }
      };
      const { normalizeNodeData } = useNodeDataNormalizer(ref(model), modelDefaults, ref({}));
      normalizeNodeData();
    });

    it('should incorporate the default data into the model for unspecified properties', () => {
      expect(model.treeNodeSpec.selectable).to.be.true;
      expect(model.treeNodeSpec.state.selected).to.be.true;
    });

    it('should use the model\'s data over the default data for specified properties', () => {
      expect(model.treeNodeSpec.expandable).to.be.true;
    });
  });

  describe('when given a name in the model data for an input node', () => {

    describe('and it is a non-radio button input', () => {

      describe('and that name is not a string', () => {

        let model;

        beforeEach(() => {
          model = generateNodes(['ces'])[0];
          model.treeNodeSpec.input.name = 42;
          const { normalizeNodeData } = useNodeDataNormalizer(ref(model), {}, ref({}));
          normalizeNodeData();
        });

        it('should set the name to null', () => {
          expect(model.treeNodeSpec.input.name).to.be.null;
        });
      });

      describe('and that trimmed name is an empty string', () => {

        let model;

        beforeEach(() => {
          model = generateNodes(['ces'])[0];
          model.treeNodeSpec.input.name = ' ';
          const { normalizeNodeData } = useNodeDataNormalizer(ref(model), {}, ref({}));
          normalizeNodeData();
        });

        it('should set the name to null', () => {
          expect(model.treeNodeSpec.input.name).to.be.null;
        });
      });
    });

    describe('and it is a radio button input', () => {

      let model;

      beforeEach(() => {
        model = generateNodes(['r'])[0];
      });

      describe('and that name is not a string', () => {

        beforeEach(() => {
          model.treeNodeSpec.input.name = 42;
          const { normalizeNodeData } = useNodeDataNormalizer(ref(model), {}, ref({}));
          normalizeNodeData();
        });

        it('should set the name to unspecifiedRadioName', () => {
          expect(model.treeNodeSpec.input.name).to.equal('unspecifiedRadioName');
        });
      });

      describe('and that trimmed name is an empty string', () => {

        beforeEach(() => {
          model.treeNodeSpec.input.name = ' ';
          const { normalizeNodeData } = useNodeDataNormalizer(ref(model), {}, ref({}));
          normalizeNodeData();
        });

        it('should set the name to null', () => {
          expect(model.treeNodeSpec.input.name).to.equal('unspecifiedRadioName');
        });
      });
    });
  });

  describe('when given a value in the model data for an input node', () => {

    describe('and it is a radio button input', () => {

      let model;

      beforeEach(() => {
        model = generateNodes(['r'])[0];
        model.label = 'A \'Label\' & <Thing>/ "Stuff"';
      });

      describe('and that value is not a string', () => {

        beforeEach(() => {
          model.treeNodeSpec.input.value = 42;
          const { normalizeNodeData } = useNodeDataNormalizer(ref(model), {}, ref({}));
          normalizeNodeData();
        });

        it('should set the value to the label value, minus disallowed characters', () => {
          expect(model.treeNodeSpec.input.value).to.equal('ALabelThingStuff');
        });
      });

      describe('and that trimmed value is an empty string', () => {

        beforeEach(() => {
          model.treeNodeSpec.input.value = ' ';
          const { normalizeNodeData } = useNodeDataNormalizer(ref(model), {}, ref({}));
          normalizeNodeData();
        });

        it('should set the value to the label value, minus disallowed characters', () => {
          expect(model.treeNodeSpec.input.value).to.equal('ALabelThingStuff');
        });
      });
    });
  });

  describe('when given an input model with no input state specified', () => {

    let model;

    beforeEach(() => {
      model = generateNodes(['c'])[0];
      model.treeNodeSpec.state.input = null;
      const { normalizeNodeData } = useNodeDataNormalizer(ref(model), {}, ref({}));
      normalizeNodeData();
    });

    it('should default the disabled state to false', () => {
      expect(model.treeNodeSpec.state.input.disabled).to.be.false;
    });

    describe('and the input is a checkbox', () => {

      it('should set the value of the input to false', () => {
        expect(model.treeNodeSpec.state.input.value).to.be.false;
      });
    });
  });

  describe('when given empty action titles', () => {

    let model;

    beforeEach(() => {
      model = generateNodes(['c'])[0];
      model.treeNodeSpec.expanderTitle = '';
      model.treeNodeSpec.addChildTitle = '';
      model.treeNodeSpec.deleteTitle = '';
      const { normalizeNodeData } = useNodeDataNormalizer(ref(model), {}, ref({}));
      normalizeNodeData();
    });

    it('should set the title properties to null', () => {
      expect(model.treeNodeSpec.expanderTitle).to.be.null;
      expect(model.treeNodeSpec.addChildTitle).to.be.null;
      expect(model.treeNodeSpec.deleteTitle).to.be.null;
    });
  });
});