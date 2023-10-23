import { expect, describe, it, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useTreeViewNodeDataNormalizer } from './treeViewNodeDataNormalizer.js';
import { generateNodes } from '../../../tests/data/node-generator.js';

describe('nodeDataNormalizer.js', () => {

  describe('when given minimal model data', () => {

    let model;

    beforeEach(() => {
      model = { id: 'my-node', label: 'My Node' };
      const { normalizeTreeViewNodeData } = useTreeViewNodeDataNormalizer(ref(model), {}, ref({}));
      normalizeTreeViewNodeData();
    });

    it('should normalize model data', () => {
      expect(model.treeNodeSpec.title).to.be.null;
      expect(model.treeNodeSpec.input).to.be.null;
      expect(model.treeNodeSpec.state.input).to.not.exist;
    });
  });

  describe('when given a name in the model data for an input node', () => {

    describe('and it is a non-radio button input', () => {

      describe('and that name is not a string', () => {

        let model;

        beforeEach(() => {
          model = generateNodes(['ces'])[0];
          model.treeNodeSpec.input.name = 42;
          const { normalizeTreeViewNodeData } = useTreeViewNodeDataNormalizer(ref(model), {}, ref({}));
          normalizeTreeViewNodeData();
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
          const { normalizeTreeViewNodeData } = useTreeViewNodeDataNormalizer(ref(model), {}, ref({}));
          normalizeTreeViewNodeData();
        });

        it('should set the name to null', () => {
          expect(model.treeNodeSpec.input.name).to.be.null;
        });
      });
    });

    describe('and it is a radio button input', () => {

      let model;
      let radioGroupValues;

      beforeEach(() => {
        model = generateNodes(['r'])[0];
        radioGroupValues = ref({});
      });

      describe('and that name is not a string', () => {

        beforeEach(() => {
          model.treeNodeSpec.input.name = 42;
          const { normalizeTreeViewNodeData } = useTreeViewNodeDataNormalizer(ref(model), {}, radioGroupValues);
          normalizeTreeViewNodeData();
        });

        it('should set the name to unspecifiedRadioName', () => {
          expect(model.treeNodeSpec.input.name).to.equal('unspecifiedRadioName');
        });
      });

      describe('and that trimmed name is an empty string', () => {

        beforeEach(() => {
          model.treeNodeSpec.input.name = ' ';
          const { normalizeTreeViewNodeData } = useTreeViewNodeDataNormalizer(ref(model), {}, radioGroupValues);
          normalizeTreeViewNodeData();
        });

        it('should set the name to null', () => {
          expect(model.treeNodeSpec.input.name).to.equal('unspecifiedRadioName');
        });
      });

      describe('and the model is marked as the initial radio button', () => {

        beforeEach(() => {
          model.treeNodeSpec.input.isInitialRadioGroupValue = true;
          const { normalizeTreeViewNodeData } = useTreeViewNodeDataNormalizer(ref(model), {}, radioGroupValues);
          normalizeTreeViewNodeData();
        });

        it('should set radio group value to this node value', () => {
          expect(radioGroupValues.value['root-rb']).to.equal('n0-val');
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
          const { normalizeTreeViewNodeData } = useTreeViewNodeDataNormalizer(ref(model), {}, ref({}));
          normalizeTreeViewNodeData();
        });

        it('should set the value to the label value, minus disallowed characters', () => {
          expect(model.treeNodeSpec.input.value).to.equal('ALabelThingStuff');
        });
      });

      describe('and that trimmed value is an empty string', () => {

        beforeEach(() => {
          model.treeNodeSpec.input.value = ' ';
          const { normalizeTreeViewNodeData } = useTreeViewNodeDataNormalizer(ref(model), {}, ref({}));
          normalizeTreeViewNodeData();
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
      const { normalizeTreeViewNodeData } = useTreeViewNodeDataNormalizer(ref(model), {}, ref({}));
      normalizeTreeViewNodeData();
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
      const { normalizeTreeViewNodeData } = useTreeViewNodeDataNormalizer(ref(model), {}, ref({}));
      normalizeTreeViewNodeData();
    });

    it('should set the title properties to null', () => {
      expect(model.treeNodeSpec.expanderTitle).to.be.null;
      expect(model.treeNodeSpec.addChildTitle).to.be.null;
      expect(model.treeNodeSpec.deleteTitle).to.be.null;
    });
  });
});