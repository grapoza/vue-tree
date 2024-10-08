import { expect, describe, it, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useTreeViewFocus } from './treeViewFocus.js';
import { generateMetaNodes } from '../../../tests/data/node-generator.js';

describe('treeViewFocus.js', () => {

  describe('when handling a focus change', () => {

    let nodes;
    let handleFocusableChange;
    let focusableNodeMetaModel;

    beforeEach(async () => {
      nodes = generateMetaNodes(['ecsf', 'eCs']);
      ({ handleFocusableChange, focusableNodeMetaModel } = useTreeViewFocus());
      focusableNodeMetaModel.value = nodes[0];

      nodes[1].focusable = true;
      handleFocusableChange(nodes[1]);
    });

    it('should remove focusable from the previous focusable node', () => {
      expect(nodes[0].focusable).to.be.false;
    });

    it('should set the new node as the focusableNodeMetaModel', () => {
      expect(nodes[1].id).to.equal(focusableNodeMetaModel.value.id);
    });
  });
});