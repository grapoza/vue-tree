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
