import { expect, describe, it, beforeEach } from "vitest";
import { ref } from "vue";
import { useTreeViewDataUpdates } from "./treeViewDataUpdates.js";
import { generateNodesAndMetaNodes } from "../../tests/data/node-generator.js";

describe("treeViewDataUpdates.js", () => {
  describe("when spliceNodeList() is called", () => {
    let spliceNodeList;
    let nodeModels;
    let metaModels;

    beforeEach(() => {
      const { nodes, metaNodes } = generateNodesAndMetaNodes(["es", "ES"]);
      ({ spliceNodeList } = useTreeViewDataUpdates(ref(nodes), ref(metaNodes)));
      nodeModels = nodes;
      metaModels = metaNodes;
    });

    it("should splice the nodes and metaNodes", () => {
      let nodes = spliceNodeList(0, 1, { id: "new", label: "new node" });
      expect(nodes.length).to.equal(1);
      expect(nodeModels.length).to.equal(2);
      expect(nodeModels[0].id).to.equal("new");
      expect(metaModels.length).to.equal(2);
      expect(metaModels[0].data.id).to.equal("new");
    });
  });
});
