import { InputType } from '../types/inputType';
import { EffectAllowed } from './dragDrop';

export type TreeViewMetaModelCustomizationsDefaults = {
  classes?: {
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
export type TreeViewMetaModelCustomizations = Required<TreeViewMetaModelCustomizationsDefaults>;

export type TreeViewMetaModelInputDefaults = {
  type: InputType;
  name: string | null;
  value?: string;
  isInitialRadioGroupValue?: boolean;
};
export type TreeViewMetaModelInput = Required<TreeViewMetaModelInputDefaults>;

export type TreeViewMetaModelStateDefaults = {
  expanded?: boolean;
  selected?: boolean;
  input?: {
    disabled?: boolean;
    value?: boolean;
  };
};
export type TreeViewMetaModelState = Required<TreeViewMetaModelStateDefaults>;

export type TreeViewMetaModelInternalDefaults = {
  dragging?: boolean;
  dragMoved?: boolean;
  isDropTarget?: boolean;
  isPrevDropTarget?: boolean;
  isNextDropTarget?: boolean;
  isChildDropTarget?: boolean;
  keepCurrentDomFocus?: boolean;
  state?: {
    areChildrenLoading?: boolean;
    areChildrenLoaded?: boolean;
    matchesFilter?: boolean;
    subnodeMatchesFilter?: boolean;
  };
};
export type TreeViewMetaModelInternal = Required<TreeViewMetaModelInternalDefaults>;

/**
 * The default values for a TreeViewNodeMetaModel, which may end up getting merged with
 * other TreeviewNodeMetaModels and/or filled in with data on the fly. This is the
 * format that the TreeViewNodeMetaModel will be in when it is created, usually by casting
 * a completed TreeViewNodeMetaModelDefaults to a TreeViewNodeMetaModel.
 */
export type TreeViewNodeMetaModelDefaults = {
  [key: string]: any;
  data?: { [key: string]: any };
  childMetaModels?: TreeViewNodeMetaModelDefaults[];
  idProperty?: string;
  labelProperty?: string;
  childrenProperty?: string;
  title?: string | null;
  expanderTitle?: string | null;
  addChildTitle?: string | null;
  deleteTitle?: string | null;
  loadChildrenAsync?: Function | null;
  addChildCallback?: Function | null;
  deleteNodeCallback?: Function | null;
  expandable?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  focusable?: boolean;
  draggable?: boolean;
  allowDrop?: boolean;
  dataTransferEffectAllowed?: EffectAllowed;
  customizations?: TreeViewMetaModelCustomizationsDefaults | null;
  input?: TreeViewMetaModelInputDefaults | null;
  state?: TreeViewMetaModelStateDefaults | null;
  _?: TreeViewMetaModelInternalDefaults;
};

/**
 * The final, complete version of a TreeViewNodeMetaModel, which will be used to
 * represent a node in the tree view. This is the format that the TreeViewNodeMetaModel
 * will be in when it is used in the tree view.
 */
// So why isn't this union getting picked up?
type TvnmmRequiredOmit = Required<Omit<TreeViewNodeMetaModelDefaults, "childMetaModels" | "customizations" | "input" | "state" | "_">>;
type TvnmmReplaced = {
  childMetaModels: TreeViewNodeMetaModel[];
  customizations: TreeViewMetaModelCustomizations;
  input: TreeViewMetaModelInput | null;
  state: TreeViewMetaModelState;
  _: TreeViewMetaModelInternal;
};
export type TreeViewNodeMetaModel = TvnmmRequiredOmit & TvnmmReplaced;

// export type TreeViewNodeMetaModel = Required<Omit<TreeViewNodeMetaModelDefaults, "childMetaModels" | "customizations" | "input" | "state" | "_">> & {
//   childMetaModels: TreeViewNodeMetaModel[];
//   customizations: TreeViewMetaModelCustomizations;
//   input: TreeViewMetaModelInput | null;
//   state: TreeViewMetaModelState;
//   _: TreeViewMetaModelInternal;
// };

// TODO Fix this so it requires an object type
export type TreeViewNodeMetaModelDefaultsMethod = (node: any) => TreeViewNodeMetaModelDefaults;