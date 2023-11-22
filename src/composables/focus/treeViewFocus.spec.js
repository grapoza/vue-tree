import { expect, describe, it, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useTreeViewFocus } from './treeViewFocus.js';
import { useNodeGenerator } from '../../../tests/data/node-generator.js';

const { generateNodes } = useNodeGenerator();

describe('treeViewFocus.js', () => {

  describe('when handling a focus change', () => {

    let nodes;
    let handleFocusableChange;
    let focusableNodeModel;

    beforeEach(async () => {
      nodes = generateNodes(['ecsf', 'eCs']);
      ({ handleFocusableChange, focusableNodeModel } = useTreeViewFocus());
      focusableNodeModel.value = nodes[0];

      nodes[1].treeNodeSpec.focusable = true;
      handleFocusableChange(nodes[1]);
    });

    it('should remove focusable from the previous focusable node', () => {
      expect(nodes[0].treeNodeSpec.focusable).to.be.false;
    });

    it('should set the new node as the focusableNodeModel', () => {
      expect(nodes[1].id).to.equal(focusableNodeModel.value.id);
    });
  });
});