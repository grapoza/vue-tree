import { useTreeViewFocus } from './treeViewFocus';
import { generateMetaNodes } from '../../../tests/data/node-generator';
import { TreeViewNodeMetaModel } from 'types/treeView';

describe('treeViewFocus', () => {

  describe('when handling a focus change', () => {

    let nodes: TreeViewNodeMetaModel[];
    let handleFocusableChange: ReturnType<typeof useTreeViewFocus>['handleFocusableChange'];
    let focusableNodeMetaModel: ReturnType<typeof useTreeViewFocus>['focusableNodeMetaModel'];

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
      expect(nodes[1].id).to.equal(focusableNodeMetaModel.value!.id);
    });
  });
});