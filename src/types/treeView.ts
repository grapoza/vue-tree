import { InputType } from './inputType';
import { EffectAllowed } from './dragDrop';

export type TreeViewNodeMetaModelCustomizations = {
  classes: {
    treeViewNode?: string;
    treeViewNodeSelf?: string;
    treeViewNodeSelfSelected?: string;
    treeViewNodeSelfExpander?: string;
    treeViewNodeSelfExpanded?: string;
    treeViewNodeSelfExpandedIndicator?: string;
    treeViewNodeSelfSpacer?: string;
    treeViewNodeSelfLabel?: string;
    treeViewNodeSelfInput?: string;
    treeViewNodeSelfCheckbox?: string;
    treeViewNodeSelfRadio?: string;
    treeViewNodeSelfText?: string;
    treeViewNodeSelfAction?: string;
    treeViewNodeSelfAddChild?: string;
    treeViewNodeSelfAddChildIcon?: string;
    treeViewNodeSelfDelete?: string;
    treeViewNodeSelfDeleteIcon?: string;
    treeViewNodeChildrenWrapper?: string;
    treeViewNodeChildren?: string;
    treeViewNodeLoading?: string;
  };
};
type TreeViewNodeMetaModelCustomizationsDefaults = Partial<TreeViewNodeMetaModelCustomizations>;

type TreeViewMetaModelInput = {
  type: InputType;
  name: string | null;
  value: string;
  isInitialRadioGroupValue: boolean;
};
type TreeViewMetaModelInputDefaults = Partial<TreeViewMetaModelInput>;

type TreeViewMetaModelState = {
  expanded: boolean;
  selected: boolean;
  input: {
    disabled?: boolean;
    value?: boolean;
  };
};
type TreeViewMetaModelStateDefaults = Partial<TreeViewMetaModelState>;

type TreeViewMetaModelInternal = {
  dragging: boolean;
  dragMoved: boolean;
  isDropTarget: boolean;
  isPrevDropTarget: boolean;
  isNextDropTarget: boolean;
  isChildDropTarget: boolean;
  keepCurrentDomFocus: boolean;
  state: {
    areChildrenLoading?: boolean;
    areChildrenLoaded?: boolean;
    matchesFilter?: boolean;
    subnodeMatchesFilter?: boolean;
  };
};
type TreeViewMetaModelInternalDefaults = Partial<TreeViewMetaModelInternal>;

/**
 * A base type shared by both TreeViewNodeMetaModel and TreeViewNodeMetaModelDefaults,
 * which contains the properties that are shared between the two types and vary only
 * by whether they are required or optional.
 */
type BaseTreeViewNodeMetaModel = {
  [key: string]: any;
  data: { [key: string]: any };
  idProperty: string;
  labelProperty: string;
  childrenProperty: string;
  title: string | null;
  expanderTitle: string | null;
  addChildTitle: string | null;
  deleteTitle: string | null;
  loadChildrenAsync: TreeViewLoadChildNodesAsyncMethod | null;
  addChildCallback: TreeViewAddChildCallbackMethod | null;
  deleteNodeCallback: TreeViewDeleteNodeCallbackMethod | null;
  expandable: boolean;
  selectable: boolean;
  deletable: boolean;
  focusable: boolean;
  draggable: boolean;
  allowDrop: boolean;
  dataTransferEffectAllowed: EffectAllowed;
};

type TreeViewNodeMetaModelUniqueProperties = {
  childMetaModels: TreeViewNodeMetaModel[];
  customizations: TreeViewNodeMetaModelCustomizations | null;
  input: TreeViewMetaModelInput | null;
  state: TreeViewMetaModelState;
  _: TreeViewMetaModelInternal;
};

type TreeViewMetaModelDefaultsUniqueProperties = {
  childMetaModels: TreeViewNodeMetaModelDefaults[];
  customizations: TreeViewNodeMetaModelCustomizationsDefaults;
  input: TreeViewMetaModelInputDefaults | null;
  state: TreeViewMetaModelStateDefaults;
  _: TreeViewMetaModelInternalDefaults;
};

/**
 * The final, complete version of a TreeViewNodeMetaModel, which will be used to
 * represent a node in the tree view. This is the format that the TreeViewNodeMetaModel
 * will be in when it is used in the tree view.
 */
export type TreeViewNodeMetaModel = BaseTreeViewNodeMetaModel & TreeViewNodeMetaModelUniqueProperties;

/**
 * The default values for a TreeViewNodeMetaModel, which may end up getting merged with
 * other TreeviewNodeMetaModels and/or filled in with data on the fly. This is the
 * format that the TreeViewNodeMetaModel will be in when it is created, usually by casting
 * a completed TreeViewNodeMetaModelDefaults to a TreeViewNodeMetaModel.
 */
export type TreeViewNodeMetaModelDefaults = Partial<BaseTreeViewNodeMetaModel & TreeViewMetaModelDefaultsUniqueProperties>;

export type TreeViewNodeMetaModelDefaultsMethod = (node: any) => TreeViewNodeMetaModelDefaults;

export type TreeViewFilterMethod = (node: TreeViewNodeMetaModel) => boolean;

export type TreeViewLoadNodesAsyncMethod = () => Promise<object[]>;

export type TreeViewLoadChildNodesAsyncMethod = (parentNode: TreeViewNodeMetaModel) => Promise<object[]>;

export type TreeViewAddChildCallbackMethod = (parentNode: TreeViewNodeMetaModel) => Promise<object | null>;

export type TreeViewDeleteNodeCallbackMethod = (node: TreeViewNodeMetaModel) => Promise<boolean>;