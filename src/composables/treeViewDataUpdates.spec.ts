import { expect, describe, it, beforeEach } from "vitest";
import { ref } from "vue";
import { useTreeViewDataUpdates } from "./treeViewDataUpdates";
import { generateNodesAndMetaNodes, TestTreeViewNode } from "../../tests/data/node-generator";
import { TreeViewNodeMetaModel, TreeViewNodeMetaModelDefaults } from "types/treeView";

describe("treeViewDataUpdates", () => {
  describe("when spliceNodeList() is called", () => {
    let spliceNodeList: ReturnType<typeof useTreeViewDataUpdates>["spliceNodeList"];
    let nodeModels: TestTreeViewNode[];
    let metaModels: TreeViewNodeMetaModel[];

    beforeEach(() => {
      const { nodes, metaNodes } = generateNodesAndMetaNodes(["es", "ES"]);
      ({ spliceNodeList } = useTreeViewDataUpdates(ref(nodes), ref(metaNodes as TreeViewNodeMetaModelDefaults[])));
      nodeModels = nodes;
      metaModels = metaNodes;
    });

    it("should splice the nodes and metaNodes", () => {
      let nodes = spliceNodeList(0, 1, { id: "new", label: "new node" });
      expect(nodes.length).to.equal(1);
      expect(nodeModels.length).to.equal(2);
      expect(nodeModels[0].id).to.equal("new");
      expect(metaModels.length).to.equal(2);
      expect(metaModels[0]!.data!.id).to.equal("new");
    });
  });
});
