import { expect, describe, it, beforeEach } from "vitest";
import { ref } from "vue";
import { useTreeViewNodeDataUpdates } from "./treeViewNodeDataUpdates";
import { generateNodesAndMetaNodes, TestTreeViewNode } from "../../tests/data/node-generator";
import { TreeViewNodeMetaModel } from "types/treeView";

describe("treeViewDataUpdates", () => {
  describe("when spliceChildNodeList() is called", () => {
    let spliceChildNodeList: ReturnType<typeof useTreeViewNodeDataUpdates>["spliceChildNodeList"];
    let nodeModel: TestTreeViewNode;
    let metaModel: TreeViewNodeMetaModel;

    beforeEach(() => {
      const { nodes, metaNodes } = generateNodesAndMetaNodes(["es", ["ES", 'e']]);
      ({ spliceChildNodeList } = useTreeViewNodeDataUpdates(metaNodes[0]));
      nodeModel = nodes[0];
      metaModel = metaNodes[0];
    });

    it("should splice the nodes and metaNodes", () => {
      let nodes = spliceChildNodeList(0, 1, { id: "new", label: "new node", children: [] });
      expect(nodes.length).to.equal(1);
      expect(nodeModel.children.length).to.equal(2);
      expect(nodeModel.children[0].id).to.equal("new");
      expect(metaModel.childMetaModels.length).to.equal(2);
      expect(metaModel.childMetaModels[0]!.data!.id).to.equal("new");
    });
  });

  describe("when pushChildNode() is called", () => {
    let pushChildNode: ReturnType<typeof useTreeViewNodeDataUpdates>["pushChildNode"];
    let nodeModel: TestTreeViewNode;
    let metaModel: TreeViewNodeMetaModel;

    beforeEach(() => {
      const { nodes, metaNodes } = generateNodesAndMetaNodes(["es", ["ES", 'e']]);
      ({ pushChildNode } = useTreeViewNodeDataUpdates(metaNodes[0]));
      nodeModel = nodes[0];
      metaModel = metaNodes[0];
    });

    it("should push the node and metaNode", () => {
      let nodesLength = pushChildNode({ id: "new", label: "new node", children: [] });
      expect(nodesLength).to.equal(3);
      expect(nodeModel.children.length).to.equal(3);
      expect(nodeModel.children[2].id).to.equal("new");
      expect(metaModel.childMetaModels.length).to.equal(3);
      expect(metaModel.childMetaModels[2]!.data!.id).to.equal("new");
    });
  });
});
