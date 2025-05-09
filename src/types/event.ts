export enum TreeEvent {
  // Root tree state
  RootNodesLoad = "treeRootNodesLoad",

  // Node state
  Click = "treeNodeClick",
  DoubleClick = "treeNodeDblclick",
  CheckboxChange = "treeNodeCheckboxChange",
  ChildCheckboxChange = "treeNodeChildCheckboxChange",
  RadioChange = "treeNodeRadioChange",
  ExpandedChange = "treeNodeExpandedChange",
  ChildrenLoad = "treeNodeChildrenLoad",
  SelectedChange = "treeNodeSelectedChange",
  Activate = "treeNodeActivate",

  // Focus
  FocusableChange = "treeNodeAriaFocusableChange",
  RequestFirstFocus = "treeNodeAriaRequestFirstFocus",
  RequestLastFocus = "treeNodeAriaRequestLastFocus",
  RequestParentFocus = "treeNodeAriaRequestParentFocus",
  RequestPreviousFocus = "treeNodeAriaRequestPreviousFocus",
  RequestNextFocus = "treeNodeAriaRequestNextFocus",

  // Hierarchy
  Add = "treeNodeAdd",
  Delete = "treeNodeDelete",

  // Drag and Drop
  DragMove = "treeNodeDragMove",
  Drop = "treeNodeDrop",
};
