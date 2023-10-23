import { expect, describe, it, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useTreeNodeDataNormalizer } from './treeNodeDataNormalizer.js';
import { effectAllowed as EffectAllowed } from '../../enums/dragDrop.js';

describe('nodeDataNormalizer.js', () => {

  describe('when given minimal model data', () => {

    let model;

    beforeEach(() => {
      model = { id: 'my-node', label: 'My Node' };
      const { normalizeNodeData } = useTreeNodeDataNormalizer(ref(model), {});
      normalizeNodeData();
    });

    it('should normalize model data', () => {
      expect(model.id).to.equal('my-node');
      expect(model.label).to.equal('My Node');
      expect(model.treeNodeSpec.expandable).to.be.true;
      expect(model.treeNodeSpec.selectable).to.be.false;
      expect(model.treeNodeSpec.deletable).to.be.false;
      expect(model.treeNodeSpec.state).to.exist;
      expect(model.treeNodeSpec.state.expanded).to.be.false;
      expect(model.treeNodeSpec.state.selected).to.be.false;
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
          expanded: true,
          selected: true
        },
        loadChildrenAsync: async () => Promise.resolve(true)
      };
      const { normalizeNodeData } = useTreeNodeDataNormalizer(ref(model), modelDefaults, ref({}));
      normalizeNodeData();
    });

    it('should incorporate the default data into the model for unspecified properties', () => {
      expect(model.treeNodeSpec.selectable).to.be.true;
      expect(model.treeNodeSpec.state.selected).to.be.true;
      expect(typeof model.treeNodeSpec.loadChildrenAsync).to.equal("function");
    });

    it('should use the model\'s data over the default data for specified properties', () => {
      expect(model.treeNodeSpec.expandable).to.be.true;
    });

    it('should set expanded to false if children will load asynchronously', () => {
      expect(model.treeNodeSpec.state.expanded).to.be.false;
    });
  });

  describe('when given and invalid dataTransferEffectAllowed value', () => {

    let model;

    beforeEach(() => {
      model = { id: 'my-node', label: 'My Node', treeNodeSpec: { dataTransferEffectAllowed: 'invalid' } };
      const { normalizeNodeData } = useTreeNodeDataNormalizer(ref(model), {});
      normalizeNodeData();
    });

    it('should default dataTransferEffectAllowed to CopyMove', () => {
      expect(model.treeNodeSpec.dataTransferEffectAllowed).to.equal(EffectAllowed.CopyMove);
    });
  });
});