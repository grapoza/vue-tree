import { beforeEach, expect, describe, it } from 'vitest';
import { useFilter } from './filter.js';
import { generateMetaNodes } from '../../../tests/data/node-generator.js';

describe('filter.js', () => {

  let nodes;

  beforeEach(() => {
    nodes = generateMetaNodes(['e', ['e', ['e'], 'es', ['e'], 'e', ['es']]]);
    //mimic filter matching the sectable nodes
    nodes[0]._.state.matchesFilter = false;
    nodes[0]._.state.subnodeMatchesFilter = true;
    nodes[0].childMetaModels[0]._.state.matchesFilter = false;
    nodes[0].childMetaModels[0]._.state.subnodeMatchesFilter = false;
    nodes[0].childMetaModels[0].childMetaModels[0]._.state.matchesFilter = false;
    nodes[0].childMetaModels[0].childMetaModels[0]._.state.subnodeMatchesFilter = false;
    nodes[0].childMetaModels[1]._.state.matchesFilter = true;
    nodes[0].childMetaModels[1]._.state.subnodeMatchesFilter = false;
    nodes[0].childMetaModels[1].childMetaModels[0]._.state.matchesFilter = false;
    nodes[0].childMetaModels[1].childMetaModels[0]._.state.subnodeMatchesFilter = false;
    nodes[0].childMetaModels[2]._.state.matchesFilter = false;
    nodes[0].childMetaModels[2]._.state.subnodeMatchesFilter = true;
    nodes[0].childMetaModels[2].childMetaModels[0]._.state.matchesFilter = true;
    nodes[0].childMetaModels[2].childMetaModels[0]._.state.subnodeMatchesFilter = false;
  });

  describe('when getting filtered children', () => {

    it('should get the children of the given node that match the filter', () => {
      const { getFilteredChildren } = useFilter();
      const filteredNodes = getFilteredChildren(nodes[0]);
      expect(filteredNodes.length).to.equal(2);
      expect(filteredNodes[0].data.id).to.equal('n0n2');
    });

    it('should get the children of the given node that have children matching the filter', () => {
      const { getFilteredChildren } = useFilter();
      const filteredNodes = getFilteredChildren(nodes[0]);
      expect(filteredNodes.length).to.equal(2);
      expect(filteredNodes[1].data.id).to.equal('n0n4');
    });
  });

  describe('when getting filtered nodes', () => {

    it('should get the nodes that match the filter', () => {
      const { getFilteredNodes } = useFilter();
      const filteredNodes = getFilteredNodes(nodes[0].childMetaModels);
      expect(filteredNodes.length).to.equal(2);
      expect(filteredNodes[0].data.id).to.equal('n0n2');
    });

    it('should get the nodes that have children matching the filter', () => {
      const { getFilteredNodes } = useFilter();
      const filteredNodes = getFilteredNodes(nodes[0].childMetaModels);
      expect(filteredNodes.length).to.equal(2);
      expect(filteredNodes[1].data.id).to.equal('n0n4');
    });
  });
});