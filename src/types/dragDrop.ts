import { TreeViewNodeMetaModel } from "./treeView";

// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
export enum DropEffect {
  None = "none",
  Copy = "copy",
  Move = "move",
  Link = "link",
};

// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed
export enum EffectAllowed {
  None = "none",
  All = "all",
  Copy = "copy",
  Move = "move",
  Link = "link",
  CopyMove = "copyMove",
  CopyLink = "copyLink",
  LinkMove = "linkMove",
};

// indicates where a dragged node should drop relative to the target node
export enum TargetZone {
  Before = 0,
  After = 1,
  Child = 2,
};

export interface DragPayload {
  treeId: string;
  data: TreeViewNodeMetaModel;
};

export interface DropEventData {
  isSameTree: boolean;
  droppedModel: TreeViewNodeMetaModel;
  targetModel: TreeViewNodeMetaModel;
  siblingNodeSets: {
    nodes: { [key: string]: any }[];
    metaNodes: TreeViewNodeMetaModel[];
  } | null;
  dropEffect: DropEffect;
  targetZone: TargetZone;
};