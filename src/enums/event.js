const events = Object.freeze({
    // Node state
    Click: 'treeViewNodeClick',
    DoubleClick: 'treeViewNodeDblclick',
    CheckboxChange: 'treeViewNodeCheckboxChange',
    RadioChange: 'treeViewNodeRadioChange',
    ExpandedChange: 'treeViewNodeExpandedChange',
    ChildrenLoad: 'treeViewNodeChildrenLoaded',
    SelectedChange: 'treeViewNodeSelectedChange',

    // Focus
    FocusableChange: 'treeViewNodeAriaFocusable',
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