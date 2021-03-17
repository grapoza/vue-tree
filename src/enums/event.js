const events = Object.freeze({
    // Root tree state
    RootNodesLoad: 'treeViewRootNodesLoad',

    // Node state
    Click: 'treeViewNodeClick',
    DoubleClick: 'treeViewNodeDblclick',
    CheckboxChange: 'treeViewNodeCheckboxChange',
    RadioChange: 'treeViewNodeRadioChange',
    ExpandedChange: 'treeViewNodeExpandedChange',
    ChildrenLoad: 'treeViewNodeChildrenLoad',
    SelectedChange: 'treeViewNodeSelectedChange',

    // Focus
    FocusableChange: 'treeViewNodeAriaFocusableChange',
    RequestFirstFocus: 'treeViewNodeAriaRequestFirstFocus',
    RequestLastFocus: 'treeViewNodeAriaRequestLastFocus',
    RequestParentFocus: 'treeViewNodeAriaRequestParentFocus',
    RequestPreviousFocus: 'treeViewNodeAriaRequestPreviousFocus',
    RequestNextFocus: 'treeViewNodeAriaRequestNextFocus',

    // Hierarchy
    Add: 'treeViewNodeAdd',
    Delete: 'treeViewNodeDelete',

    // Drag and Drop
    DragMove: 'treeViewNodeDragMove',
    Drop: 'treeViewNodeDrop'
});

export default events;