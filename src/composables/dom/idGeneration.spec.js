import { beforeEach, afterEach, expect, describe, it } from 'vitest';
import { useIdGeneration } from './idGeneration.js';

describe('idGeneration.js', () => {

  describe('when generating a unique ID', () => {

    it('should create a new 8+ character ID prefixed with grt-', () => {
      const { generateUniqueId } = useIdGeneration();
      const newId = generateUniqueId();
      expect(newId.length).to.equal(8);
      expect(newId.startsWith('grt-')).to.be.true;
    });
  });

  describe('when resolving node ID conflicts', () => {

    let root = null;
    let data = null;

    beforeEach(async () => {
      root = document.createElement('div');
      root.id = 'tree-node1';
      document.body.appendChild(root);

      data = {
        treeNodeSpec: { idProperty: 'id', childrenProperty: 'children' },
        id: 'node2',
        children: [
          {
            treeNodeSpec: { idProperty: 'id', childrenProperty: 'children' },
            id: 'node3',
            children: []
          }
        ]
      };
    });

    afterEach(() => {
      document.body.removeChild(root);
    });

    describe('and no conflicts are found', () => {

      it('should do nothing', () => {
        const { resolveNodeIdConflicts } = useIdGeneration();
        resolveNodeIdConflicts(data, 'tree');
        expect(data.id).to.equal('node2');
        expect(data.children[0].id).to.equal('node3');
      });
    });

    describe('and conflicts are found', () => {

      it('should update the conflicting id to a unique id', () => {
        data.children[0].id = 'node1';
        const { resolveNodeIdConflicts } = useIdGeneration();
        resolveNodeIdConflicts(data, 'tree');
        expect(data.id).to.equal('node2');
        expect(data.children[0].id).to.equal('node1-1');
      });
    });
  });
});