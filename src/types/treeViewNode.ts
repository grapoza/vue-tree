import { InputType } from '../types/inputType';
import { EffectAllowed } from './dragDrop';

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
  customizations?: object; // TODO Type this further
  input?: {
    type: InputType;
    name: string | null;
    value?: string;
    isInitialRadioGroupValue?: boolean;
  } | null;
  state?: {
    expanded?: boolean;
    selected?: boolean;
    input?: {
      disabled?: boolean;
      value?: boolean;
    };
  } | null;
  _?: {
    dragging: boolean;
    state?: {
      areChildrenLoading?: boolean;
      areChildrenLoaded?: boolean;
      matchesFilter?: boolean;
    };
  };
};

export type TreeViewNodeMetaModel = Required<TreeViewNodeMetaModelDefaults>;

// TODO Fix this so it requires an object type
export type TreeViewNodeMetaModelDefaultsMethod = (node: any) => TreeViewNodeMetaModelDefaults;