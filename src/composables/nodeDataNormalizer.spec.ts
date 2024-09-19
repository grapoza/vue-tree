import { ref } from 'vue';
import { useNodeDataNormalizer } from './nodeDataNormalizer';
import { generateNodes } from '../../tests/data/node-generator';
import { InputType } from "../types/inputType";
import { TreeViewNodeMetaModelDefaults } from 'types/treeView';

describe('nodeDataNormalizer', () => {

  describe('when given minimal model data', () => {

    let model: TreeViewNodeMetaModelDefaults;

    beforeEach(() => {
      const { nodes, modelDefaults } = generateNodes(['e']);
      model = { data: nodes[0] };
      const { normalizeNodeData } = useNodeDataNormalizer(ref(model), modelDefaults, ref({}));
      normalizeNodeData();
    });

    it('should normalize model data', () => {
      expect(model.data!.id).to.equal('n0');
      expect(model.data!.label).to.equal('Node 0');
      expect(model.title).to.be.null;
      expect(model.expandable).to.be.true;
      expect(model.selectable).to.be.false;
      expect(model.deletable).to.be.false;
      expect(model.state).to.exist;
      expect(model.state!.expanded).to.be.false;
      expect(model.state!.selected).to.be.false;
      expect(model.input).to.be.null;
      expect(model.state!.input).to.not.exist;
      expect(model.childMetaModels).to.be.empty;
    });
  });

  describe('when given default model data', () => {

    let model: TreeViewNodeMetaModelDefaults;

    beforeEach(() => {
      const { nodes, modelDefaultMap, modelDefaults } = generateNodes(["e"]);

      model = { data: nodes[0], expandable: true };
      Object.assign(modelDefaultMap.get("n0")!, {
        expandable: false,
        selectable: true,
        state: {
          selected: true,
        }
      });

      const { normalizeNodeData } = useNodeDataNormalizer(ref(model), modelDefaults, ref({}));
      normalizeNodeData();
    });

    it('should incorporate the default data into the model for unspecified properties', () => {
      expect(model.selectable).to.be.true;
      expect(model.state!.selected).to.be.true;
    });

    it('should use the model\'s data over the default data for specified properties', () => {
      expect(model.expandable).to.be.true;
    });
  });

  describe('when given a name in the model data for an input node', () => {

    describe('and it is a non-radio button input', () => {

      describe('and that name is not a string', () => {

        let model: TreeViewNodeMetaModelDefaults;

        beforeEach(() => {
          const { nodes } = generateNodes(["ces"]);
          model = { data: nodes[0], input: { name: 42 as any, type: InputType.Checkbox } };
          const { normalizeNodeData } = useNodeDataNormalizer(ref(model), () => ({}), ref({}));
          normalizeNodeData();
        });

        it('should set the name to null', () => {
          expect(model.input!.name).to.be.null;
        });
      });

      describe('and that trimmed name is an empty string', () => {

        let model: TreeViewNodeMetaModelDefaults;

        beforeEach(() => {
          const { nodes } = generateNodes(["ces"]);
          model = { data: nodes[0], input: { name: ' ', type: InputType.Checkbox } };
          const { normalizeNodeData } = useNodeDataNormalizer(ref(model), () => ({}), ref({}));
          normalizeNodeData();
        });

        it('should set the name to null', () => {
          expect(model.input!.name).to.be.null;
        });
      });
    });

    describe('and it is a radio button input', () => {

      let model: TreeViewNodeMetaModelDefaults;

      beforeEach(() => {
        model = { data: generateNodes(['r']).nodes[0], input: { name: 'Radio Name', type: InputType.RadioButton } };
      });

      describe('and that name is not a string', () => {

        beforeEach(() => {
          model.input!.name = 42 as any;
          const { normalizeNodeData } = useNodeDataNormalizer(ref(model), () => ({}), ref({}));
          normalizeNodeData();
        });

        it('should set the name to unspecifiedRadioName', () => {
          expect(model.input!.name).to.equal('unspecifiedRadioName');
        });
      });

      describe('and that trimmed name is an empty string', () => {

        beforeEach(() => {
          model.input!.name = ' ';
          const { normalizeNodeData } = useNodeDataNormalizer(ref(model), () => ({}), ref({}));
          normalizeNodeData();
        });

        it("should set the name to unspecifiedRadioName", () => {
          expect(model.input!.name).to.equal("unspecifiedRadioName");
        });
      });
    });
  });

  describe('when given a value in the model data for an input node', () => {

    describe('and it is a radio button input', () => {

      let model: TreeViewNodeMetaModelDefaults;

      beforeEach(() => {
        model = { data: generateNodes(['r']).nodes[0], input: { name: 'Radio Name', type: InputType.RadioButton } };
        model.data!.label = 'A \'Label\' & <Thing>/ "Stuff"';
      });

      describe('and that value is not a string', () => {

        beforeEach(() => {
          model.input!.value = 42 as any;
          const { normalizeNodeData } = useNodeDataNormalizer(ref(model), () => ({}), ref({}));
          normalizeNodeData();
        });

        it('should set the value to the label value, minus disallowed characters', () => {
          expect(model.input!.value).to.equal('ALabelThingStuff');
        });
      });

      describe('and that trimmed value is an empty string', () => {

        beforeEach(() => {
          model.input!.value = ' ';
          const { normalizeNodeData } = useNodeDataNormalizer(ref(model), () => ({}), ref({}));
          normalizeNodeData();
        });

        it('should set the value to the label value, minus disallowed characters', () => {
          expect(model.input!.value).to.equal('ALabelThingStuff');
        });
      });
    });
  });

  describe('when given an input model with no input state specified', () => {

    let model: TreeViewNodeMetaModelDefaults;

    beforeEach(() => {
      model = {
        data: generateNodes(['c']).nodes[0],
        input: { name: 'Name', type: InputType.Checkbox },
        state: { input: null as any }
      };
      const { normalizeNodeData } = useNodeDataNormalizer(ref(model), () => ({}), ref({}));
      normalizeNodeData();
    });

    it('should default the disabled state to false', () => {
      expect(model.state!.input!.disabled).to.be.false;
    });

    describe('and the input is a checkbox', () => {

      it('should set the value of the input to false', () => {
        expect(model.state!.input!.value).to.be.false;
      });
    });
  });

  describe('when given empty action titles', () => {

    let model: TreeViewNodeMetaModelDefaults;

    beforeEach(() => {
      model = { data: generateNodes(["c"]).nodes[0] };
      model.expanderTitle = '';
      model.addChildTitle = '';
      model.deleteTitle = '';
      const { normalizeNodeData } = useNodeDataNormalizer(ref(model), () => ({}), ref({}));
      normalizeNodeData();
    });

    it('should set the title properties to null', () => {
      expect(model.expanderTitle).to.be.null;
      expect(model.addChildTitle).to.be.null;
      expect(model.deleteTitle).to.be.null;
    });
  });
});