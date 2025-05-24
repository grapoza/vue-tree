import{j as o,M as qt,C as E}from"./DocsRenderer-CFRXHY34-CcmJFkBN.js";import{useMDXComponents as kt}from"./index-DcLjd9o3.js";import"./index-M4eRVXft.js";import{u as r,b as ee,w as ae,d as S,e as zt,f as nt,g as Nt,m as Ce,j as Gt,k as Tt,l as Vt,t as ke,o as z,n as K,p as O,q as $,s as P,v as Ze,x as Wt,y as ht,z as _e,A as Bt,B as ie,C as Kt,F as wt,D as Dt,E as St,G as H,H as Ht,I as Ut,J as Jt,K as Yt,L as Xt}from"./vue.esm-bundler-bc48N4j-.js";var I=(e=>(e.None="none",e.Single="single",e.Multiple="multiple",e.SelectionFollowsFocus="selectionFollowsFocus",e))(I||{});function X(){function e(n){return r(n).data[r(n).childrenProperty]??[]}function t(n){return r(n).childMetaModels}return{getChildren:e,getMetaChildren:t}}const{getChildren:Qt,getMetaChildren:Zt}=X();function jt(){function e(){const n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let d="grt-";do d+=n.charAt(Math.floor(Math.random()*n.length));while(d.length<8||document.getElementById(d));return d}function t(n,d){const l=n.idProperty,h=n.data[l],C=Zt(n),u=Qt(n);if(document.getElementById(`${d}-${h}`)){let x=1;for(;document.getElementById(`${d}-${h}-${x}`);)x++;n.data[l]=`${h}-${x}`}C.forEach((x,a)=>{t(x,d),u[a][l]!==x.data[l]&&(u[a][l]=x.data[l],C[a].data[l]=x.data[l])})}return{generateUniqueId:e,resolveNodeIdConflicts:t}}function Ne(){const{getMetaChildren:e}=X();function t(d){return n(e(d))}function n(d){return r(d).filter(l=>{var h,C,u,x;return((C=(h=l._)==null?void 0:h.state)==null?void 0:C.matchesFilter)||((x=(u=l._)==null?void 0:u.state)==null?void 0:x.subnodeMatchesFilter)})}return{getFilteredChildren:t,getFilteredNodes:n}}function ot(e){const{getFilteredChildren:t,getFilteredNodes:n}=Ne();function d(C){h(C,!1)}function l(C){h(C,!0)}function h(C,u){const x=n(e);if(x.length===0)return;let a=x.slice(),i=!0;for(;a.length>0&&i!==!1;){const v=a.shift(),b=t(v);a=u?b.concat(a):a.concat(b),i=C(v)??!0}}return{breadthFirstTraverse:d,depthFirstTraverse:l}}function Mt(){function e(n){return r(n).expandable===!0}function t(n){return r(n).state.expanded===!0}return{isExpandable:e,isExpanded:t}}function Q(){const{isExpanded:e}=Mt(),{getFilteredChildren:t,getFilteredNodes:n}=Ne();function d(i,v=!1){r(i)._.keepCurrentDomFocus=v,r(i).focusable=!0}function l(i){r(i).focusable=!1}function h(i){return r(i).focusable===!0}function C(i,v=!1){const b=n(i);b.length>0&&d(b[0],v)}function u(i,v=!1){const b=n(i);let m=b[b.length-1],N=t(m);for(;N.length>0&&e(m);)m=N[N.length-1],N=t(m);d(m,v)}function x(i,v,b=!1,m=!1){const N=n(i);let s=N.findIndex(y=>y.data[y.idProperty]===v.data[v.idProperty]),g=t(v);if(!b&&g.length>0&&e(v))d(g[0],m);else if(s<N.length-1)d(N[s+1],m);else return!1;return!0}function a(i,v,b=!1){const m=n(i);let N=m.findIndex(s=>s.data[s.idProperty]===v.data[v.idProperty]);if(N!==0){let s=m[N-1],g=t(s);for(;g.length>0&&e(s);)s=g[g.length-1],g=t(s);return d(s,b),!0}return!1}return{focus:d,focusFirst:C,focusLast:u,focusNext:x,focusPrevious:a,isFocused:h,unfocus:l}}function _t(){const{unfocus:e}=Q(),t=ee(null);function n(d){t.value!==d&&(t.value&&e(t),t.value=d)}return{focusableNodeMetaModel:t,handleFocusableChange:n}}function Te(){function e(h){r(h).state.selected=!0}function t(h){r(h).state.selected=!1}function n(h,C){r(h).state.selected=C}function d(h){return r(h).selectable===!0}function l(h){return r(h).state.selected===!0}return{deselect:t,isSelectable:d,isSelected:l,setSelected:n,select:e}}function ea(e){const{getFilteredNodes:t}=Ne(),{focusFirst:n}=Q();let d=!1;return ae(()=>t(e),()=>{t(e).length>0?(d&&n(e,!0),d=!1):d=!0}),{}}var c=(e=>(e.RootNodesLoad="treeRootNodesLoad",e.Click="treeNodeClick",e.DoubleClick="treeNodeDblclick",e.CheckboxChange="treeNodeCheckboxChange",e.ChildCheckboxChange="treeNodeChildCheckboxChange",e.RadioChange="treeNodeRadioChange",e.ExpandedChange="treeNodeExpandedChange",e.ChildrenLoad="treeNodeChildrenLoad",e.SelectedChange="treeNodeSelectedChange",e.Activate="treeNodeActivate",e.FocusableChange="treeNodeAriaFocusableChange",e.RequestFirstFocus="treeNodeAriaRequestFirstFocus",e.RequestLastFocus="treeNodeAriaRequestLastFocus",e.RequestParentFocus="treeNodeAriaRequestParentFocus",e.RequestPreviousFocus="treeNodeAriaRequestPreviousFocus",e.RequestNextFocus="treeNodeAriaRequestNextFocus",e.Add="treeNodeAdd",e.Delete="treeNodeDelete",e.DragMove="treeNodeDragMove",e.Drop="treeNodeDrop",e))(c||{});function ta(e,t,n,d){const{depthFirstTraverse:l}=ot(e),{deselect:h,isSelectable:C,isSelected:u,select:x}=Te();ae(t,i),ae(n,s=>{r(t)===I.SelectionFollowsFocus&&N(s)});const a=S(()=>t.value===I.None?void 0:t.value===I.Multiple);function i(){r(t)===I.Single?v():r(t)===I.SelectionFollowsFocus&&b()}function v(){let s=!1;l(g=>{g.state&&u(g)&&(s?h(g):s=!0)})}function b(){l(s=>{let g=s.idProperty,y=n.value.idProperty;s.data[g]===n.value.data[y]?C(s)&&x(s):u(s)&&h(s)})}function m(s){r(t)===I.Single&&u(s)&&N(s),d(c.SelectedChange,s)}function N(s){const g=s.data[s.idProperty];l(y=>u(y)&&y.data[y.idProperty]!==g?(h(y),!1):!0)}return{ariaMultiselectable:a,enforceSelectionMode:i,handleNodeSelectedChange:m}}var lt=(e=>(e.None="none",e.Copy="copy",e.Move="move",e.Link="link",e))(lt||{}),re=(e=>(e.None="none",e.All="all",e.Copy="copy",e.Move="move",e.Link="link",e.CopyMove="copyMove",e.CopyLink="copyLink",e.LinkMove="linkMove",e))(re||{}),te=(e=>(e[e.Before=0]="Before",e[e.After=1]="After",e[e.Child=2]="Child",e))(te||{});function Ft(){function e(n){return n!==null&&typeof n=="object"&&!Array.isArray(n)}function t(n){let d=JSON.parse(JSON.stringify(n));if(e(d))for(const l of Object.keys(n)){let h=n[l];typeof h=="function"?d[l]=h:e(h)&&(d[l]=t(h))}return d}return{isProbablyObject:e,cheapCopyObject:t}}var ue=(e=>(e.Checkbox="checkbox",e.RadioButton="radio",e))(ue||{});const{isProbablyObject:ft}=Ft(),aa=[re.Copy,re.Move,re.CopyMove,re.None];function Ve(e,t,n){const d=a=>({data:a,childMetaModels:[],_:{}});function l(){const a=r(e);a.data=a.data??{},h(r(t)(a.data),a),typeof a.idProperty!="string"&&(a.idProperty="id"),typeof a.labelProperty!="string"&&(a.labelProperty="label"),typeof a.expandable!="boolean"&&(a.expandable=!0),typeof a.selectable!="boolean"&&(a.selectable=!1),typeof a.deletable!="boolean"&&(a.deletable=!1),typeof a.draggable!="boolean"&&(a.draggable=!1),typeof a.allowDrop!="boolean"&&(a.allowDrop=!1),(typeof a.dataTransferEffectAllowed!="string"||!aa.includes(a.dataTransferEffectAllowed))&&(a.dataTransferEffectAllowed=re.CopyMove),typeof a.focusable!="boolean"&&(a.focusable=!1),typeof a.addChildCallback!="function"&&(a.addChildCallback=null),typeof a.deleteNodeCallback!="function"&&(a.deleteNodeCallback=null),(typeof a.title!="string"||a.title.trim().length===0)&&(a.title=null),(typeof a.expanderTitle!="string"||a.expanderTitle.trim().length===0)&&(a.expanderTitle=null),(typeof a.addChildTitle!="string"||a.addChildTitle.trim().length===0)&&(a.addChildTitle=null),(typeof a.deleteTitle!="string"||a.deleteTitle.trim().length===0)&&(a.deleteTitle=null),(a.customizations==null||typeof a.customizations!="object")&&(a.customizations={}),typeof a.loadChildrenAsync!="function"&&(a.loadChildrenAsync=null),a._={dragging:!1},C(a),u(a),x(a),a.addChildCallback&&!Array.isArray(a.data[a.childrenProperty])&&console.warn(`This node with an addChildCallback does not have a ${a.childrenProperty} array to which children can be added.`,a.data),e.value=a}function h(a,i){if(ft(a)){const v=JSON.parse(JSON.stringify(a));Object.assign(v,i);for(const b of Object.keys(a)){const m=typeof a[b]=="function"?a[b]:v[b];ft(m)?(i[b]=i[b]||{},h(m,i[b])):(typeof m=="function"&&i[b],i[b]=m)}}}function C(a){let i=a.input;i===null||typeof i!="object"||!Object.values(ue).includes(i.type)?a.input=null:((typeof i.name!="string"||i.name.trim().length===0)&&(i.name=null),i.type===ue.RadioButton&&((typeof i.name!="string"||i.name.trim().length===0)&&(i.name="unspecifiedRadioName"),(typeof i.value!="string"||i.value.trim().length===0)&&(i.value=a.data[a.labelProperty].replace(/[\s&<>"'\/]/g,"")),n.value.hasOwnProperty(i.name)||(n.value[i.name]=""),i.isInitialRadioGroupValue===!0&&(n.value[i.name]=i.value)))}function u(a){(a.state===null||typeof a.state!="object")&&(a.state={}),(a._.state===null||typeof a._.state!="object")&&(a._.state={});let i=a.state,v=a._.state;v.areChildrenLoaded=typeof a.loadChildrenAsync!="function",v.areChildrenLoading=!1,(typeof i.expanded!="boolean"||!v.areChildrenLoaded)&&(i.expanded=!1),typeof i.selected!="boolean"&&(i.selected=!1),a.input&&((i.input===null||typeof i.input!="object")&&(i.input={}),(i.input.disabled===null||typeof i.input.disabled!="boolean")&&(i.input.disabled=!1),a.input.type===ue.Checkbox&&typeof i.input.value!="boolean"&&(i.input.value=!1))}function x(a){var i;typeof a.childrenProperty!="string"&&(a.childrenProperty="children"),Array.isArray(a.childMetaModels)||(a.childMetaModels=[]),(i=a.data[a.childrenProperty])==null||i.forEach(v=>{a.childMetaModels.some(b=>b.data===v)||a.childMetaModels.push(d(v))})}return{createMetaModel:d,normalizeNodeData:l}}function dt(e,t){const{createMetaModel:n}=Ve();function d(l,h,...C){return r(e).splice(l,h,...C),r(t).splice(l,h,...C.map(n))}return{spliceNodeList:d}}const{resolveNodeIdConflicts:bt}=jt(),{cheapCopyObject:na}=Ft(),{unfocus:oa}=Q();function la(e,t,n,d,l){const{spliceNodeList:h}=dt(e,t);function C(x){const a=t.value.indexOf(x);a>-1&&h(a,1)}function u(x){var i,v;let a=x.droppedModel;if(x.isSameTree)if(x.dropEffect===lt.Move)a=l(a.data[a.idProperty]),a._.dragMoved=!0;else{let b=d(a.data[a.idProperty]);a=na(b),bt(a,n.value),oa(a)}else bt(a,n.value);if(a){let b=((i=x.siblingNodeSets)==null?void 0:i.nodes)||e.value,m=((v=x.siblingNodeSets)==null?void 0:v.metaNodes)||t.value,N=m.indexOf(x.targetModel);switch(x.targetZone){case te.Before:b.splice(N,0,a.data),m.splice(N,0,a);break;case te.After:b.splice(N+1,0,a.data),m.splice(N+1,0,a);break;default:b.push(a.data),m.push(a);break}a._.dragging=!1}}return{dragMoveNode:C,drop:u}}const{getChildren:mt,getMetaChildren:gt}=X();function st(e){const{createMetaModel:t}=Ve();function n(l,h,...C){return mt(e).splice(l,h,...C),gt(e).splice(l,h,...C.map(t))}function d(l){return mt(e).push(l),gt(e).push(t(l))}return{pushChildNode:d,spliceChildNodeList:n}}function da(e,t,n,d){const{depthFirstTraverse:l}=ot(t),{isSelectable:h,isSelected:C}=Te(),{spliceNodeList:u}=dt(e,t),{getMetaChildren:x}=X();function a(s,g=0){let y=[];return typeof s=="function"&&l(j=>s(j)?(y.push(j),g<1||y.length<g):!0),y}function i(){return a(s=>!!s.input&&s.input.type===ue.Checkbox&&!!s.state.input.value)}function v(){return a(s=>!!s.input&&s.input.type===ue.RadioButton&&n.value[s.input.name]===s.input.value)}function b(s){let g=null;return typeof s=="string"&&(g=t.value.find(y=>y.data[y.idProperty]===s)??null,g||l(y=>{if(g=x(y).find(R=>R.data[R.idProperty]===s)??null,g)return!1})),g}function m(){return d.value===I.None?[]:a(s=>h(s)&&C(s))}function N(s){let g=null;if(typeof s=="string"){let y=t.value.findIndex(j=>j.data[j.idProperty]===s);y>-1?g=u(y,1)[0]:l(j=>{if(y=x(j).findIndex(F=>F.data[F.idProperty]===s),y>-1){const{spliceChildNodeList:F}=st(j);return g=F(y,1)[0],!1}})}return g}return{findById:b,getCheckedCheckboxes:i,getCheckedRadioButtons:v,getMatching:a,getSelected:m,removeById:N}}function it(e,t){const{getMetaChildren:n}=X(),{spliceChildNodeList:d,pushChildNode:l}=st(e),h=S(()=>typeof e.value.loadChildrenAsync!="function"||e.value._.state.areChildrenLoaded),C=S(()=>e.value._.state.areChildrenLoading),u=S(()=>n(e)),x=S(()=>u.value&&u.value.length>0),a=S(()=>x.value||!h.value);async function i(){const m=e.value;if(!m._.state.areChildrenLoaded&&!m._.state.areChildrenLoading){m._.state.areChildrenLoading=!0;const N=await m.loadChildrenAsync(e.value);N&&(m._.state.areChildrenLoaded=!0,d(0,u.value.length,...N),t(c.ChildrenLoad,e.value)),m._.state.areChildrenLoading=!1}}async function v(){if(e.value.addChildCallback){const m=await e.value.addChildCallback(e.value);m&&(l(m),t(c.Add,u.value[u.value.length-1],e.value))}}function b(m){let N=u.value.indexOf(m);N>-1&&(d(N,1),t(c.Delete,m))}return{addChild:v,areChildrenLoaded:h,areChildrenLoading:C,children:u,deleteChild:b,hasChildren:x,loadChildren:i,mayHaveChildren:a}}var se=(e=>(e.Json="application/json",e.PlainText="text/plain",e.TreeViewNode="application/x-grapoza-treeviewnode",e))(se||{});function sa(){function e(t,n){const d="closest"in t?t:t.parentElement;return d==null?void 0:d.closest(n)}return{closest:e}}const{closest:ia}=sa(),{getChildren:vt,getMetaChildren:et}=X();function ra(e,t,n){const{unfocus:d}=Q(),{spliceChildNodeList:l}=st(e);function h(s){const g=et(e).indexOf(s);g>-1&&l(g,1)}function C(s,g){s.siblingNodeSets=s.siblingNodeSets||{nodes:vt(e),metaNodes:et(e)},n(c.Drop,s,g)}function u(s){s.stopPropagation();let g=JSON.parse(JSON.stringify(e.value));d(g);const y={treeId:t.value,data:g},j=JSON.stringify(g);e.value._.dragging=!0,s.dataTransfer.effectAllowed=e.value.dataTransferEffectAllowed,s.dataTransfer.setData(se.TreeViewNode,JSON.stringify(y)),s.dataTransfer.setData(se.Json,j),s.dataTransfer.setData(se.PlainText,j)}function x(s){m(s)&&(N(s,!0),s.preventDefault())}function a(s){m(s)&&(N(s,!0),s.preventDefault())}function i(s){m(s)&&N(s,!1)}function v(s){var R,F,G,U;const g=JSON.parse(s.dataTransfer.getData(se.TreeViewNode)),y=(F=(R=s.target)==null?void 0:R.classList)!=null&&F.contains("grtvn-self-prev-target")?te.Before:(U=(G=s.target)==null?void 0:G.classList)!=null&&U.contains("grtvn-self-next-target")?te.After:te.Child,j={isSameTree:g.treeId===t.value,droppedModel:g.data,targetModel:e.value,siblingNodeSets:y===te.Child?{nodes:vt(e),metaNodes:et(e)}:null,dropEffect:s.dataTransfer.dropEffect,targetZone:y};n(c.Drop,j,s),N(s,!1),s.preventDefault()}function b(s){s.dataTransfer.dropEffect===lt.Move?e.value._.dragMoved?e.value._.dragMoved=!1:n(c.DragMove,e.value,s):(N(s,!1),e.value._.dragging=!1)}function m(s){return e.value.allowDrop&&s.dataTransfer.types.includes(se.TreeViewNode)&&!ia(s.target,".grtvn-dragging")}function N(s,g){const y=s.target.classList,j=!!(y!=null&&y.contains("grtvn-self-prev-target")),R=!!(y!=null&&y.contains("grtvn-self-next-target"));e.value._.isDropTarget=g,j?(e.value._.isPrevDropTarget=g,e.value._.isChildDropTarget=!1):R?(e.value._.isNextDropTarget=g,e.value._.isChildDropTarget=!1):e.value._.isChildDropTarget=g}return{dragMoveChild:h,drop:C,onDragstart:u,onDragenter:x,onDragover:a,onDragleave:i,onDrop:v,onDragend:b}}function ua(e,t,n,d){const{focus:l,focusFirst:h,focusLast:C,focusNext:u,focusPrevious:x,isFocused:a,unfocus:i}=Q(),{getMetaChildren:v}=X(),b=S(()=>v(e));ae(()=>e.value.focusable,function(F){F&&(d.value&&!e.value._.keepCurrentDomFocus&&t.value.focus(),e.value._.keepCurrentDomFocus=!1,n(c.FocusableChange,e.value))});function m(F=!1){l(e,F)}function N(){i(e)}function s(){return a(e)}function g(F=!1){h(b.value,F)}function y(F=!1){C(b.value,F)}function j(F,G,U=!1){u(b.value,F,G,U)||n(c.RequestNextFocus,r(e),!0)}function R(F,G=!1){x(b.value,F,G)||m(G)}return{focusNode:m,unfocusNode:N,isFocusedNode:s,focusFirstChild:g,focusLastChild:y,focusNextNode:j,focusPreviousNode:R}}function ca(e,t,n){const{deselect:d,isSelectable:l,isSelected:h,setSelected:C,select:u}=Te();ae(()=>e.value.state.selected,()=>{n(c.SelectedChange,e.value)}),ae(()=>e.value.focusable,function(s){b()&&t.value===I.SelectionFollowsFocus&&i(s)});function x(){u(e)}function a(){d(e)}function i(s){C(e,s)}function v(){l(e)&&[I.Single,I.Multiple].includes(t.value)&&C(e,!m())}function b(){return l(e)}function m(){return h(e)}return{ariaSelected:S(()=>{if(!(t.value===I.None||!b()))return t.value!==I.Multiple?m()?!0:void 0:m()}),deselectNode:a,isNodeSelectable:b,isNodeSelected:m,setNodeSelected:i,selectNode:x,toggleNodeSelected:v}}function It(e,t){const n=zt("filterMethod"),{isFocused:d,unfocus:l}=Q(),{areChildrenLoaded:h}=it(e,t),{getFilteredChildren:C}=Ne(),u=S(()=>C(e)),x=S(()=>typeof r(n)=="function"),a=S(()=>e.value._.state.matchesFilter||e.value._.state.subnodeMatchesFilter||!1),i=S(()=>u.value&&u.value.length>0),v=S(()=>i.value||!h.value);return nt(()=>{e.value._.state.matchesFilter=!x.value||r(n)(e.value),e.value._.state.subnodeMatchesFilter=u.value.length>0,!a.value&&d(e)&&(l(e),t(c.RequestFirstFocus,!0))}),{filteredChildren:u,filterIncludesNode:a,isFilteringEnabled:x,mayHaveFilteredChildren:v}}function pa(e,t){const{isExpandable:n,isExpanded:d}=Mt(),{loadChildren:l}=it(e,t),{mayHaveFilteredChildren:h}=It(e,t),C=S(()=>u.value?a():void 0),u=S(()=>x()&&h.value);ae(()=>e.value.state.expanded,async function(){t(c.ExpandedChange,e.value),a()&&await l()});function x(){return n(e)}function a(){return d(e)}function i(){return u.value&&a()?(e.value.state.expanded=!1,!0):!1}function v(){return u.value&&!a()?(e.value.state.expanded=!0,!0):!1}function b(){return a()?i():v()}return{ariaExpanded:C,canExpand:u,collapseNode:i,expandNode:v,isNodeExpandable:x,isNodeExpanded:a,toggleNodeExpanded:b}}const ha=["id","tabindex","aria-expanded","aria-selected"],fa=["draggable","dragging"],ba=["id","title"],ma=["for","title"],ga=["id","disabled"],va=["for","title"],xa=["id","name","value","disabled"],ya=["title"],Ca=["id","title"],ka=["id","title"],Na=["aria-hidden"],xt="input, .grtvn-self-expander, .grtvn-self-expander *, .grtvn-self-action, .grtvn-self-action *",At=Nt({__name:"TreeViewNode",props:Ce({ariaKeyMap:{type:Object,required:!0},depth:{type:Number,required:!0},initialRadioGroupValues:{type:Object,required:!0},isMounted:{type:Boolean,required:!0},modelDefaults:{type:Function,required:!0},selectionMode:{type:String,required:!1,default:I.None,validator:function(e){return Object.values(I).includes(e)}},treeId:{type:String,required:!0}},{modelValue:{required:!0,type:Object},modelModifiers:{}}),emits:Ce({[c.Activate]:e=>!0,[c.Add]:(e,t)=>!0,[c.CheckboxChange]:(e,t)=>!0,[c.ChildCheckboxChange]:(e,t,n)=>!0,[c.ChildrenLoad]:e=>!0,[c.Click]:(e,t)=>!0,[c.Delete]:e=>!0,[c.DoubleClick]:(e,t)=>!0,[c.DragMove]:(e,t)=>!0,[c.Drop]:(e,t)=>!0,[c.ExpandedChange]:e=>!0,[c.FocusableChange]:e=>!0,[c.RadioChange]:(e,t)=>!0,[c.RequestFirstFocus]:e=>!0,[c.RequestLastFocus]:()=>!0,[c.RequestNextFocus]:(e,t)=>!0,[c.RequestParentFocus]:()=>!0,[c.RequestPreviousFocus]:e=>!0,[c.SelectedChange]:e=>!0},["update:modelValue"]),setup(e,{emit:t}){const n=e,d=t;Gt();const l=Tt(e,"modelValue"),h=ee(n.initialRadioGroupValues),C=Vt("nodeElementRef"),u=S(()=>`${j.value}-add-child`),x=S(()=>Ke()?0:-1),a=S(()=>{var p;return((p=l.value.customizations)==null?void 0:p.classes)??{}}),i=S(()=>`${j.value}-delete`),v=S(()=>`${j.value}-exp`),b=S(()=>l.value.data[m.value]),m=S(()=>l.value.idProperty??"id"),N=S(()=>`${j.value}-input`),s=S(()=>n.selectionMode!==I.None&&Ue()&&xe()),g=S(()=>l.value.data[y.value]),y=S(()=>l.value.labelProperty??"label"),j=S(()=>`${n.treeId}-${b.value}`),R=S(()=>n.treeId),{createMetaModel:F,normalizeNodeData:G}=Ve(l,n.modelDefaults,h);G();const{getChildren:U}=X(),{addChild:ne,areChildrenLoaded:he,areChildrenLoading:qe,children:fe,deleteChild:be,hasChildren:ze}=it(l,d),{filteredChildren:oe,filterIncludesNode:Ge,mayHaveFilteredChildren:We}=It(l,d),{focus:ce,isFocused:Be}=Q(),{focusNode:me,focusNextNode:ge,focusPreviousNode:ve,isFocusedNode:Ke}=ua(l,C,d,ke(n,"isMounted")),{ariaSelected:He,isNodeSelectable:Ue,isNodeSelected:xe,toggleNodeSelected:le}=ca(l,ke(n,"selectionMode"),d),{ariaExpanded:Je,canExpand:ye,collapseNode:Ye,expandNode:Xe,isNodeExpanded:V,toggleNodeExpanded:k}=pa(l,d),{dragMoveChild:q,drop:J,onDragstart:T,onDragenter:M,onDragover:W,onDragleave:Y,onDrop:de,onDragend:rt}=ra(l,R,d);nt(()=>{const p=fe.value,f=U(l),Z=p.findIndex(D=>D.focusable);f.forEach((D,B)=>{const w=p.findIndex(A=>A.data[m.value]===D[m.value]);B!==w&&(w===-1?p.splice(B,0,F(D)):p.splice(B,0,p.splice(w,1)[0]))}),p.length>f.length&&p.splice(f.length),Z>-1&&(p.length>0?p.findIndex(B=>B.focusable)===-1&&ce(p[Math.min(Z,p.length-1)]):ce(l.value))});function ut(p){d(c.CheckboxChange,l.value,p)}function ct(p){d(c.RadioChange,l.value,p)}function Rt(p){p.target.matches(xt)||(d(c.Click,l.value,p),le()),me()}function Pt(p){p.target.matches(xt)||d(c.DoubleClick,l.value,p)}async function pt(){var p,f;l.value.deletable&&(await((f=(p=l.value).deleteNodeCallback)==null?void 0:f.call(p,l.value))??!0)&&d(c.Delete,l.value)}function Lt(p){let f=!0;if(!(p.altKey||p.ctrlKey||p.metaKey||p.shiftKey)){if(n.ariaKeyMap.activateItem.includes(p.keyCode)){if(l.value.input&&!l.value.state.input.disabled){let Z=C.value.querySelector(".grtvn-self"),D=Z.querySelector(".grtvn-self-input")??Z.querySelector("input");if(D){let B=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0});D.dispatchEvent(B)}}d(c.Activate,l.value)}else n.ariaKeyMap.selectItem.includes(p.keyCode)?le():n.ariaKeyMap.expandFocusedItem.includes(p.keyCode)?We.value&&!qe.value&&!Xe()&&V()&&ce(oe.value[0]):n.ariaKeyMap.collapseFocusedItem.includes(p.keyCode)?Ye()||d(c.RequestParentFocus):n.ariaKeyMap.focusFirstItem.includes(p.keyCode)?d(c.RequestFirstFocus):n.ariaKeyMap.focusLastItem.includes(p.keyCode)?d(c.RequestLastFocus):n.ariaKeyMap.focusPreviousItem.includes(p.keyCode)?d(c.RequestPreviousFocus,l.value):n.ariaKeyMap.focusNextItem.includes(p.keyCode)?d(c.RequestNextFocus,l.value,!1):n.ariaKeyMap.insertItem.includes(p.keyCode)?ne():n.ariaKeyMap.deleteItem.includes(p.keyCode)?pt():f=!1;f&&(p.stopPropagation(),p.preventDefault())}}function Et(p){oe.value.indexOf(p)>-1&&(Be(p)&&(oe.value.length>1&&oe.value.indexOf(p)===0?ge(p):ve(p)),be(p))}function Ot(p,f){d(c.CheckboxChange,p,f),fe.value.includes(p)&&d(c.ChildCheckboxChange,l.value,p,f)}return(!b.value||typeof b.value!="number"&&typeof b.value!="string")&&console.error(`modelValue id is required and must be a number or string. Expected prop ${m.value} to exist on the model.`),(!g.value||typeof g.value!="string")&&console.error(`modelValue label is required and must be a string. Expected prop ${y.value} to exist on the model.`),(p,f)=>{const Z=Ht("TreeViewNode",!0);return z(),K("li",{id:j.value,ref:"nodeElementRef",class:$(["grtvn",[a.value.treeViewNode,l.value._.dragging?"grtvn-dragging":"",r(Ge)?"":"grtvn-hidden"]]),role:"treeitem",tabindex:x.value,"aria-expanded":r(Je),"aria-selected":r(He),onKeydown:Lt},[O("div",{class:$(["grtvn-self",[a.value.treeViewNodeSelf,s.value?"grtvn-self-selected":"",s.value?a.value.treeViewNodeSelfSelected:"",l.value._.isDropTarget?"grtvn-self-drop-target":"",l.value._.isChildDropTarget?"grtvn-self-child-drop-target":""]]),draggable:l.value.draggable,dragging:l.value._.dragging,onClick:Rt,onDblclick:Pt,onDragend:f[4]||(f[4]=(...D)=>r(rt)&&r(rt)(...D)),onDragenter:f[5]||(f[5]=(...D)=>r(M)&&r(M)(...D)),onDragleave:f[6]||(f[6]=(...D)=>r(Y)&&r(Y)(...D)),onDragover:f[7]||(f[7]=(...D)=>r(W)&&r(W)(...D)),onDragstart:f[8]||(f[8]=(...D)=>r(T)&&r(T)(...D)),onDrop:f[9]||(f[9]=(...D)=>r(de)&&r(de)(...D))},[O("div",{class:$(["grtvn-self-sibling-drop-target grtvn-self-prev-target",[l.value._.isPrevDropTarget?"grtvn-self-sibling-drop-target-hover":""]])},null,2),P(p.$slots,"expander",{metaModel:l.value,customClasses:a.value,expanderId:v.value,canExpand:r(ye),toggleNodeExpanded:r(k)},()=>[r(ye)?(z(),K("button",{key:0,id:v.value,type:"button","aria-hidden":"true",tabindex:"-1",title:l.value.expanderTitle??void 0,class:$(["grtvn-self-expander",[a.value.treeViewNodeSelfExpander,l.value.state.expanded?"grtvn-self-expanded":"",l.value.state.expanded?a.value.treeViewNodeSelfExpanded:""]]),onClick:f[0]||(f[0]=(...D)=>r(k)&&r(k)(...D))},[O("i",{class:$(["grtvn-self-expanded-indicator",a.value.treeViewNodeSelfExpandedIndicator])},null,2)],10,ba)):(z(),K("span",{key:1,class:$(["grtvn-self-spacer",a.value.treeViewNodeSelfSpacer])},null,2))]),l.value.input&&l.value.input.type==="checkbox"?P(p.$slots,"checkbox",{key:0,metaModel:l.value,customClasses:a.value,inputId:N.value,checkboxChangeHandler:ut},()=>[O("label",{for:N.value,title:l.value.title??void 0,class:$(["grtvn-self-label",a.value.treeViewNodeSelfLabel])},[Ze(O("input",{id:N.value,tabindex:"-1",class:$(["grtvn-self-input grtvn-self-checkbox",[a.value.treeViewNodeSelfInput,a.value.treeViewNodeSelfCheckbox]]),type:"checkbox",disabled:l.value.state.input.disabled,"onUpdate:modelValue":f[1]||(f[1]=D=>l.value.state.input.value=D),onChange:ut},null,42,ga),[[Wt,l.value.state.input.value]]),ht(" "+_e(g.value),1)],10,ma)]):l.value.input&&l.value.input.type==="radio"?P(p.$slots,"radio",{key:1,metaModel:l.value,customClasses:a.value,inputId:N.value,radioGroupValues:h.value,radioChangeHandler:ct},()=>[O("label",{for:N.value,title:l.value.title??void 0,class:$(["grtvn-self-label",a.value.treeViewNodeSelfLabel])},[Ze(O("input",{id:N.value,tabindex:"-1",class:$(["grtvn-self-input grtvn-self-radio",[a.value.treeViewNodeSelfInput,a.value.treeViewNodeSelfRadio]]),type:"radio",name:l.value.input.name,value:l.value.input.value,disabled:l.value.state.input.disabled,"onUpdate:modelValue":f[2]||(f[2]=D=>h.value[l.value.input.name]=D),onChange:ct},null,42,xa),[[Bt,h.value[l.value.input.name]]]),ht(" "+_e(g.value),1)],10,va)]):P(p.$slots,"text",{key:2,metaModel:l.value,customClasses:a.value},()=>[O("span",{title:l.value.title??void 0,class:$(["grtvn-self-text",a.value.treeViewNodeSelfText])},_e(g.value),11,ya)]),l.value.addChildCallback?(z(),K("button",{key:3,id:u.value,type:"button","aria-hidden":"true",tabindex:"-1",title:l.value.addChildTitle??void 0,class:$(["grtvn-self-action",[a.value.treeViewNodeSelfAction,a.value.treeViewNodeSelfAddChild]]),onClick:f[3]||(f[3]=(...D)=>r(ne)&&r(ne)(...D))},[O("i",{class:$(["grtvn-self-add-child-icon",a.value.treeViewNodeSelfAddChildIcon])},null,2)],10,Ca)):ie("",!0),l.value.deletable?(z(),K("button",{key:4,id:i.value,type:"button","aria-hidden":"true",tabindex:"-1",title:l.value.deleteTitle??void 0,class:$(["grtvn-self-action",[a.value.treeViewNodeSelfAction,a.value.treeViewNodeSelfDelete]]),onClick:pt},[O("i",{class:$(["grtvn-self-delete-icon",a.value.treeViewNodeSelfDeleteIcon])},null,2)],10,ka)):ie("",!0),O("div",{class:$(["grtvn-self-sibling-drop-target grtvn-self-next-target",[l.value._.isNextDropTarget?"grtvn-self-sibling-drop-target-hover":""]])},null,2)],42,fa),O("div",{class:$(["grtvn-children-wrapper",a.value.treeViewNodeChildrenWrapper])},[l.value.state.expanded&&!r(he)?P(p.$slots,"loading",{key:0,metaModel:l.value,customClasses:a.value},()=>[O("span",{class:$(["grtvn-loading",a.value.treeViewNodeLoading])}," ... ",2)]):ie("",!0),r(ze)?Ze((z(),K("ul",{key:1,class:$(["grtvn-children",a.value.treeViewNodeChildren]),role:"group","aria-hidden":!l.value.state.expanded},[(z(!0),K(wt,null,Dt(l.value.childMetaModels,(D,B)=>(z(),St(Z,{key:D.data[D.idProperty??"id"],depth:e.depth+1,modelValue:l.value.childMetaModels[B],"onUpdate:modelValue":w=>l.value.childMetaModels[B]=w,"model-defaults":e.modelDefaults,"parent-id":b.value,"selection-mode":e.selectionMode,"tree-id":R.value,"initial-radio-group-values":h.value,ariaKeyMap:e.ariaKeyMap,"is-mounted":e.isMounted,onTreeNodeClick:f[10]||(f[10]=(w,A)=>p.$emit(r(c).Click,w,A)),onTreeNodeDblclick:f[11]||(f[11]=(w,A)=>p.$emit(r(c).DoubleClick,w,A)),onTreeNodeCheckboxChange:Ot,onTreeNodeChildCheckboxChange:f[12]||(f[12]=(w,A,_)=>p.$emit(r(c).ChildCheckboxChange,w,A,_)),onTreeNodeRadioChange:f[13]||(f[13]=(w,A)=>p.$emit(r(c).RadioChange,w,A)),onTreeNodeExpandedChange:f[14]||(f[14]=w=>p.$emit(r(c).ExpandedChange,w)),onTreeNodeChildrenLoad:f[15]||(f[15]=w=>p.$emit(r(c).ChildrenLoad,w)),onTreeNodeSelectedChange:f[16]||(f[16]=w=>p.$emit(r(c).SelectedChange,w)),onTreeNodeActivate:f[17]||(f[17]=w=>p.$emit(r(c).Activate,w)),onTreeNodeAdd:f[18]||(f[18]=(w,A)=>p.$emit(r(c).Add,w,A)),onTreeNodeDelete:Et,onTreeNodeAriaFocusableChange:f[19]||(f[19]=w=>p.$emit(r(c).FocusableChange,w)),onTreeNodeAriaRequestParentFocus:f[20]||(f[20]=()=>r(me)()),onTreeNodeAriaRequestFirstFocus:f[21]||(f[21]=w=>p.$emit(r(c).RequestFirstFocus,w)),onTreeNodeAriaRequestLastFocus:f[22]||(f[22]=()=>p.$emit(r(c).RequestLastFocus)),onTreeNodeAriaRequestPreviousFocus:r(ve),onTreeNodeAriaRequestNextFocus:r(ge),onTreeNodeDragMove:r(q),onTreeNodeDrop:r(J)},{expander:H(({metaModel:w,customClasses:A,expanderId:_,canExpand:pe,toggleNodeExpanded:Qe})=>[P(p.$slots,"expander",{metaModel:w,customClasses:A,expanderId:_,canExpand:pe,toggleNodeExpanded:Qe})]),checkbox:H(({metaModel:w,customClasses:A,inputId:_,checkboxChangeHandler:pe})=>[P(p.$slots,"checkbox",{metaModel:w,customClasses:A,inputId:_,checkboxChangeHandler:pe})]),radio:H(({metaModel:w,customClasses:A,inputId:_,radioGroupValues:pe,radioChangeHandler:Qe})=>[P(p.$slots,"radio",{metaModel:w,customClasses:A,inputId:_,radioGroupValues:pe,radioChangeHandler:Qe})]),text:H(({metaModel:w,customClasses:A})=>[P(p.$slots,"text",{metaModel:w,customClasses:A})]),loading:H(({metaModel:w,customClasses:A})=>[P(p.$slots,"loading",{metaModel:w,customClasses:A})]),_:2},1032,["depth","modelValue","onUpdate:modelValue","model-defaults","parent-id","selection-mode","tree-id","initial-radio-group-values","ariaKeyMap","is-mounted","onTreeNodeAriaRequestPreviousFocus","onTreeNodeAriaRequestNextFocus","onTreeNodeDragMove","onTreeNodeDrop"]))),128))],10,Na)),[[Kt,l.value.state.expanded]]):ie("",!0)],2)],42,ha)}}});At.__docgenInfo={exportName:"default",displayName:"TreeViewNode",description:"",tags:{},props:[{name:"ariaKeyMap",type:{name:"object"},required:!0},{name:"depth",type:{name:"number"},required:!0},{name:"initialRadioGroupValues",type:{name:"Record<string, string>"},required:!0},{name:"isMounted",type:{name:"boolean"},required:!0},{name:"modelDefaults",type:{name:"TreeViewNodeMetaModelDefaultsMethod"},required:!0},{name:"selectionMode",type:{name:"SelectionMode"},required:!1,defaultValue:{func:!1,value:"SelectionMode.None"}},{name:"treeId",type:{name:"string"},required:!0}],events:[{name:"<undefined>"}],slots:[{name:"expander",scoped:!0,bindings:[{name:"metaModel",title:"binding",description:""},{name:"customClasses",title:"binding",description:""},{name:"expanderId",title:"binding",description:""},{name:"canExpand",title:"binding",description:""},{name:"toggleNodeExpanded",title:"binding",description:""}]},{name:"checkbox",scoped:!0,bindings:[{name:"metaModel",title:"binding",description:""},{name:"customClasses",title:"binding",description:""},{name:"inputId",title:"binding",description:""},{name:"checkboxChangeHandler",title:"binding",description:""}]},{name:"radio",scoped:!0,bindings:[{name:"metaModel",title:"binding",description:""},{name:"customClasses",title:"binding",description:""},{name:"inputId",title:"binding",description:""},{name:"radioGroupValues",title:"binding",description:""},{name:"radioChangeHandler",title:"binding",description:""}]},{name:"text",scoped:!0,bindings:[{name:"metaModel",title:"binding",description:""},{name:"customClasses",title:"binding",description:""}]},{name:"loading",scoped:!0,bindings:[{name:"metaModel",title:"binding",description:""},{name:"customClasses",title:"binding",description:""}]}],sourceFiles:["/home/appveyor/projects/vue-tree/src/components/TreeViewNode.vue"]};const Ta=["aria-multiselectable"],L=Nt({__name:"TreeView",props:Ce({customAriaKeyMap:{type:Object,required:!1,default:function(){return{}},validator:function(e){for(const t in e)if(!Array.isArray(e[t])||e[t].some(n=>!Number.isInteger(n)))return console.error(`customAriaKeyMap properties must be Arrays of numbers (corresponding to keyCodes); property '${t}' fails check.`),!1;return!0}},filterMethod:{type:Function,required:!1,default:null},loadNodesAsync:{type:Function,required:!1,default:null},modelDefaults:{type:Function,required:!1,default(){return{}}},selectionMode:{type:String,required:!1,default:I.None,validator:function(e){return Object.values(I).includes(e)}},skinClass:{type:String,required:!1,default:"grtv-default-skin",validator:function(e){return e===null||!e.match(/\s/)}}},{modelValue:{type:Array,required:!0},modelModifiers:{}}),emits:Ce({[c.Activate]:e=>!0,[c.Add]:(e,t)=>!0,[c.CheckboxChange]:(e,t)=>!0,[c.ChildrenLoad]:e=>!0,[c.ChildCheckboxChange]:(e,t,n)=>!0,[c.Click]:(e,t)=>!0,[c.Delete]:e=>!0,[c.DoubleClick]:(e,t)=>!0,[c.ExpandedChange]:e=>!0,[c.RadioChange]:(e,t)=>!0,[c.RootNodesLoad]:e=>!0,[c.SelectedChange]:e=>!0},["update:modelValue"]),setup(e,{expose:t,emit:n}){const d=e,l=Tt(e,"modelValue"),h=n,C=Ut({activateItem:[32],selectItem:[13],focusLastItem:[35],focusFirstItem:[36],collapseFocusedItem:[37],expandFocusedItem:[39],focusPreviousItem:[38],focusNextItem:[40],insertItem:[45],deleteItem:[46]}),u=ee([]),x=ee(!1),a=ee(!1),i=ee({}),v=ee(""),b=Vt("treeElementRef"),{createMetaModel:m}=Ve();l.value.forEach(V=>{u.value.push(m(V))});const N=ke(d,"selectionMode"),{generateUniqueId:s}=jt(),{depthFirstTraverse:g}=ot(u),{focusableNodeMetaModel:y,handleFocusableChange:j}=_t(),{focus:R,focusFirst:F,focusLast:G,focusNext:U,focusPrevious:ne,isFocused:he,unfocus:qe}=Q(),{ariaMultiselectable:fe,enforceSelectionMode:be,handleNodeSelectedChange:ze}=ta(u,N,y,h),{isSelectable:oe,isSelected:Ge,select:We}=Te(),{findById:ce,getCheckedCheckboxes:Be,getCheckedRadioButtons:me,getMatching:ge,getSelected:ve,removeById:Ke}=da(l,u,i,N),{dragMoveNode:He,drop:Ue}=la(l,u,v,ce,Ke),{spliceNodeList:xe}=dt(l,u);ea(u),nt(()=>{const V=u.value.length===0?0:u.value.findIndex(k=>k.focusable);l.value.forEach((k,q)=>{const J=u.value.findIndex(T=>T.data[T.idProperty]===k[T.idProperty]);q!==J&&(J===-1?u.value.splice(q,0,m(k)):u.value.splice(q,0,u.value.splice(J,1)[0]))}),u.value.length>l.value.length&&u.value.splice(l.value.length),V>-1&&(u.value.length>0?u.value.findIndex(q=>q.focusable)===-1&&R(u.value[Math.min(V,u.value.length-1)]):y.value=null)});const le=S(()=>typeof d.loadNodesAsync!="function"||x.value),Je=S(()=>Object.assign({},C,d.customAriaKeyMap));Jt(async()=>{if(await ye(),!!b.value){if(b.value.id&&(v.value=b.value.id),u.value.length>0){let V=null;g(k=>{he(k)&&(y.value?qe(k):y.value=k),d.selectionMode!==I.None&&V===null&&Ge(k)&&(V=k)}),y.value||(y.value=V||u.value[0],R(y)),V===null&&oe(y)&&d.selectionMode===I.SelectionFollowsFocus&&We(y),be()}Yt(()=>{d.selectionMode===I.Single&&be(),a.value=!0})}});async function ye(){if(!le.value){const V=await d.loadNodesAsync();V&&(x.value=!0,xe(0,l.value.length,...V),h(c.RootNodesLoad,l.value))}}function Ye(V){let k=u.value.indexOf(V);k>-1&&(Xe(V),xe(k,1)),h(c.Delete,V)}function Xe(V){he(V)&&(u.value.indexOf(V)===0?u.value.length>0&&U(u.value,V):ne(u.value,V))}return Xt("filterMethod",ke(d,"filterMethod")),v.value=s(),t({getCheckedCheckboxes:Be,getCheckedRadioButtons:me,getMatching:ge,getSelected:ve,metaModel:u}),(V,k)=>(z(),K("div",{ref:"treeElementRef",class:$(["grtv-wrapper",e.skinClass])},[le.value?ie("",!0):P(V.$slots,"loading-root",{key:0},()=>[k[13]||(k[13]=O("span",{class:"grtv-loading"}," ... ",-1))]),le.value?(z(),K("ul",{key:1,class:"grtv",role:"tree","aria-multiselectable":r(fe)},[(z(!0),K(wt,null,Dt(u.value,(q,J)=>(z(),St(At,{key:q.data[(q==null?void 0:q.idProperty)??"id"],ariaKeyMap:Je.value,depth:0,"model-defaults":e.modelDefaults,modelValue:u.value[J],"onUpdate:modelValue":T=>u.value[J]=T,"selection-mode":e.selectionMode,"tree-id":v.value,"is-mounted":a.value,"initial-radio-group-values":i.value,onTreeNodeClick:k[0]||(k[0]=(T,M)=>V.$emit(r(c).Click,T,M)),onTreeNodeDblclick:k[1]||(k[1]=(T,M)=>V.$emit(r(c).DoubleClick,T,M)),onTreeNodeCheckboxChange:k[2]||(k[2]=(T,M)=>V.$emit(r(c).CheckboxChange,T,M)),onTreeNodeChildCheckboxChange:k[3]||(k[3]=(T,M,W)=>V.$emit(r(c).ChildCheckboxChange,T,M,W)),onTreeNodeRadioChange:k[4]||(k[4]=(T,M)=>V.$emit(r(c).RadioChange,T,M)),onTreeNodeExpandedChange:k[5]||(k[5]=T=>V.$emit(r(c).ExpandedChange,T)),onTreeNodeChildrenLoad:k[6]||(k[6]=T=>V.$emit(r(c).ChildrenLoad,T)),onTreeNodeSelectedChange:r(ze),onTreeNodeActivate:k[7]||(k[7]=T=>V.$emit(r(c).Activate,T)),onTreeNodeAdd:k[8]||(k[8]=(T,M)=>V.$emit(r(c).Add,T,M)),onTreeNodeDelete:Ye,onTreeNodeAriaFocusableChange:r(j),onTreeNodeAriaRequestFirstFocus:k[9]||(k[9]=T=>r(F)(u.value,T)),onTreeNodeAriaRequestLastFocus:k[10]||(k[10]=T=>r(G)(u.value)),onTreeNodeAriaRequestPreviousFocus:k[11]||(k[11]=T=>r(ne)(u.value,T)),onTreeNodeAriaRequestNextFocus:k[12]||(k[12]=(T,M)=>r(U)(u.value,T,M)),onTreeNodeDragMove:r(He),onTreeNodeDrop:r(Ue)},{expander:H(({metaModel:T,customClasses:M,expanderId:W,canExpand:Y,toggleNodeExpanded:de})=>[P(V.$slots,"expander",{metaModel:T,customClasses:M,expanderId:W,canExpand:Y,toggleNodeExpanded:de})]),checkbox:H(({metaModel:T,customClasses:M,inputId:W,checkboxChangeHandler:Y})=>[P(V.$slots,"checkbox",{metaModel:T,customClasses:M,inputId:W,checkboxChangeHandler:Y})]),radio:H(({metaModel:T,customClasses:M,inputId:W,radioGroupValues:Y,radioChangeHandler:de})=>[P(V.$slots,"radio",{metaModel:T,customClasses:M,inputId:W,radioGroupValues:Y,radioChangeHandler:de})]),text:H(({metaModel:T,customClasses:M})=>[P(V.$slots,"text",{metaModel:T,customClasses:M})]),loading:H(({metaModel:T,customClasses:M})=>[P(V.$slots,"loading",{metaModel:T,customClasses:M})]),_:2},1032,["ariaKeyMap","model-defaults","modelValue","onUpdate:modelValue","selection-mode","tree-id","is-mounted","initial-radio-group-values","onTreeNodeSelectedChange","onTreeNodeAriaFocusableChange","onTreeNodeDragMove","onTreeNodeDrop"]))),128))],8,Ta)):ie("",!0)],2))}});L.__docgenInfo={exportName:"default",displayName:"TreeView",description:"",tags:{},expose:[{name:"getCheckedCheckboxes"},{name:"getCheckedRadioButtons"},{name:"getMatching"},{name:"getSelected"},{name:"metaModel"}],props:[{name:"customAriaKeyMap",type:{name:"object"},required:!1,defaultValue:{func:!1,value:"{}"}},{name:"filterMethod",type:{name:"TreeViewFilterMethod"},required:!1,defaultValue:{func:!1,value:"null"}},{name:"loadNodesAsync",type:{name:"TreeViewLoadNodesAsyncMethod"},required:!1,defaultValue:{func:!1,value:"null"}},{name:"modelDefaults",type:{name:"TreeViewNodeMetaModelDefaultsMethod"},required:!1,defaultValue:{func:!0,value:"function() { return {}; }"}},{name:"selectionMode",type:{name:"SelectionMode"},required:!1,defaultValue:{func:!1,value:"SelectionMode.None"}},{name:"skinClass",type:{name:"string"},required:!1,defaultValue:{func:!1,value:"'grtv-default-skin'"}}],events:[{name:"<undefined>"}],slots:[{name:"loading-root"},{name:"expander",scoped:!0,bindings:[{name:"metaModel",title:"binding"},{name:"customClasses",title:"binding"},{name:"expanderId",title:"binding"},{name:"canExpand",title:"binding"},{name:"toggleNodeExpanded",title:"binding"}]},{name:"checkbox",scoped:!0,bindings:[{name:"metaModel",title:"binding"},{name:"customClasses",title:"binding"},{name:"inputId",title:"binding"},{name:"checkboxChangeHandler",title:"binding"}]},{name:"radio",scoped:!0,bindings:[{name:"metaModel",title:"binding"},{name:"customClasses",title:"binding"},{name:"inputId",title:"binding"},{name:"radioGroupValues",title:"binding"},{name:"radioChangeHandler",title:"binding"}]},{name:"text",scoped:!0,bindings:[{name:"metaModel",title:"binding"},{name:"customClasses",title:"binding"}]},{name:"loading",scoped:!0,bindings:[{name:"metaModel",title:"binding"},{name:"customClasses",title:"binding"}]}],sourceFiles:["/home/appveyor/projects/vue-tree/src/components/TreeView.vue"]};const Va=[{id:"basic-node1",label:"My First Node",children:[]},{id:"basic-node2",label:"My Second Node",children:[{id:"basic-subnode1",label:"This is a subnode",children:[]},{id:"basic-subnode2",label:"Another Subnode",children:[]},{id:"basic-subnode3",label:"This is a disabled, checked subnode",children:[{id:"basic-subsubnode1",label:"An even deeper node",children:[]}]}]}];function wa(e){switch(e.id){case"basic-node1":return{};case"basic-node2":return{title:"My node, and its fantastic title",input:{type:"checkbox",name:"checkbox1"},state:{expanded:!0}};case"basic-subnode1":return{input:{type:"radio",name:"radio1",isInitialRadioGroupValue:!0}};case"basic-subnode2":return{input:{type:"radio",name:"radio1"}};case"basic-subnode3":return{input:{type:"checkbox",name:"checkbox2"},state:{input:{value:!0,disabled:!0}}};case"basic-subsubnode1":return{}}}const Da=e=>({components:{TreeView:L},setup(){return{args:e}},data(){let{modelValue:t,...n}=e;return{argsWithoutValue:n,modelValue:t,checkedTvNodes:[]}},template:`<span>
<TreeView v-bind="argsWithoutValue" v-model="modelValue" ref="treeViewRef" />
<section class="checked-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked (checkboxes and radiobuttons)?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.data.id }}</li>
  </ul>
</section>
</span>`,methods:{refreshCheckedTvList(){this.checkedTvNodes=[...this.$refs.treeViewRef.getCheckedCheckboxes(),...this.$refs.treeViewRef.getCheckedRadioButtons()]}}}),we=Da.bind({});we.args={modelValue:Va,modelDefaults:wa};const Sa=`
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: 'basic-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'basic-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'basic-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'basic-subnode2',
        label: 'Another Subnode',
        children: [],
      },
      {
        id: 'basic-subnode3',
        label: 'This is a disabled, checked subnode',
        children: [
          {
            id: 'basic-subsubnode1',
            label: 'An even deeper node',
            children: []
          }
        ]
      }
    ]
  }
];

function modelDefaults(node) {
  switch (node.id) {
    case 'basic-node1':
      return {};
    case 'basic-node2':
      return {
        title: "My node, and its fantastic title",
        input: {
          type: "checkbox",
          name: "checkbox1",
        },
        state: {
          expanded: true,
        },
      };
    case 'basic-subnode1':
      return {
        input: {
          type: "radio",
          name: "radio1",
          isInitialRadioGroupValue: true,
        },
      };
    case 'basic-subnode2':
      return {
        input: {
          type: "radio",
          name: "radio1",
        },
      };
    case 'basic-subnode3':
      return {
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          input: {
            value: true,
            disabled: true,
          },
        },
      };
    case 'basic-subsubnode1':
      return {};
  }
};
<\/script>`;we.parameters={docs:{source:{code:Sa,language:"html",type:"auto"}}};const ja=[{id:"static-node1",label:"My First Node",children:[]},{id:"static-node2",label:"My Second Node",children:[{id:"static-subnode1",label:"This is a subnode",children:[]},{id:"static-subnode2",label:"This is another subnode",children:[{id:"static-subsubnode1",label:"An even deeper node",children:[]}]}]}];function Ma(){return{expandable:!1,state:{expanded:!0}}}const Fa=e=>({components:{TreeView:L},setup(){return{args:e}},data(){let{modelValue:t,...n}=e;return{argsWithoutValue:n,modelValue:t}},template:'<TreeView v-bind="argsWithoutValue" v-model="modelValue" />'}),De=Fa.bind({});De.args={modelValue:ja,modelDefaults:Ma};const Ia=`
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: 'static-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'static-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'static-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'static-subnode2',
        label: 'This is another subnode',
        children: [
          {
            id: 'static-subsubnode1',
            label: 'An even deeper node',
            children: [],
          }
        ],
      }
    ],
  }
];

function modelDefaults() {
  return {
    expandable: false,
    state: {
      expanded: true,
    },
  };
}
<\/script>`;De.parameters={docs:{source:{code:Ia,language:"html",type:"auto"}}};const Aa=e=>({components:{TreeView:L},setup(){return{args:e}},data(){let{modelValue:t,...n}=e;return{argsWithoutValue:n,modelValue:t}},template:'<TreeView v-bind="argsWithoutValue" v-model="modelValue" />'}),Se=Aa.bind({});Se.args={modelValue:[{identifier:"node1",description:"Node with no children"},{identifier:"node2",description:"Node with a child",children:[{identifier:"childNode1",description:"A child node"}]}],modelDefaults:()=>({idProperty:"identifier",labelProperty:"description",state:{expanded:!0}})};const $a=`
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const modelDefaults = () => ({
  idProperty: 'identifier',
  labelProperty: 'description',
  state: {
    expanded: true
  }
});

const treeData = [
  {
    identifier: "node1",
    description: "Node with no children"
  },
  {
    identifier: "node2",
    description: "Node with a child",
    children: [
      {
        identifier: "childNode1",
        description: "A child node"
      }
    ]
  }
];
<\/script>`;Se.parameters={docs:{source:{code:$a,language:"html",type:"auto"}}};const Ra=[{id:"checkboxes-node1",label:"My First Node",children:[]},{id:"checkboxes-node2",label:"My Second Node",children:[{id:"checkboxes-subnode1",label:"This is a subnode",children:[]},{id:"checkboxes-subnode2",label:"This is a disabled, checked subnode",children:[{id:"checkboxes-subsubnode1",label:"An even deeper node",children:[]}]}]}];function Pa(e){const t={addChildTitle:"Add a new child node",deleteTitle:"Delete this node",expanderTitle:"Expand this node"};switch(e.id){case"checkboxes-node1":return Object.assign(t,{expandable:!0,selectable:!0,deletable:!0,input:{type:"checkbox",name:"checkbox1"},state:{expanded:!1,selected:!1,input:{value:!1,disabled:!1}}});case"checkboxes-node2":return Object.assign(t,{title:"My second node, and its fantastic title",expandable:!0,selectable:!0,input:{type:"checkbox",name:"checkbox2"},state:{expanded:!0,selected:!1,input:{value:!1,disabled:!1}}});case"checkboxes-subnode1":return Object.assign(t,{title:"Even non-input nodes should get a title.",expandable:!0,selectable:!0,deletable:!0,state:{expanded:!1,selected:!1}});case"checkboxes-subnode2":return Object.assign(t,{expandable:!0,selectable:!0,input:{type:"checkbox",name:"checkbox3"},state:{expanded:!1,selected:!1,input:{value:!0,disabled:!0}}});case"checkboxes-subsubnode1":return Object.assign(t,{expandable:!0,selectable:!0,state:{expanded:!1,selected:!1},addChildCallback:function(){const n=prompt("Give it a string.","");return Promise.resolve(n?{id:n,label:n,deletable:!0,selectable:!0}:null)}});default:return t}}const La=e=>({components:{TreeView:L},setup(){return{args:e}},data(){let{modelValue:t,...n}=e;return{argsWithoutValue:n,modelValue:t,checkedTvNodes:[]}},template:`<span>
<TreeView v-bind="argsWithoutValue" v-model="modelValue" ref="treeViewRef" />
<section class="checked-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.data.id }}</li>
  </ul>
</section>
</span>`,methods:{refreshCheckedTvList(){this.checkedTvNodes=this.$refs.treeViewRef.getCheckedCheckboxes()}}}),je=La.bind({});je.args={modelValue:Ra,modelDefaults:Pa};const Ea=`
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: 'checkboxes-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'checkboxes-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'checkboxes-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'checkboxes-subnode2',
        label: 'This is a disabled, checked subnode',
        children: [
          {
            id: 'checkboxes-subsubnode1',
            label: 'An even deeper node',
            children: [],
          }
        ],
      }
    ],
  }
];

function modelDefaults(node) {

  const baseDefaults = {
    addChildTitle: 'Add a new child node',
    deleteTitle: 'Delete this node',
    expanderTitle: 'Expand this node',
  };

  switch (node.id) {
    case 'checkboxes-node1':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        deletable: true,
        input: {
          type: 'checkbox',
          name: 'checkbox1'
        },
        state: {
          expanded: false,
          selected: false,
          input: {
            value: false,
            disabled: false
          }
        }
      });
    case 'checkboxes-node2':
      return Object.assign(baseDefaults, {
        title: "My second node, and its fantastic title",
        expandable: true,
        selectable: true,
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          expanded: true,
          selected: false,
          input: {
            value: false,
            disabled: false,
          },
        },
      });
    case 'checkboxes-subnode1':
      return Object.assign(baseDefaults, {
        title: "Even non-input nodes should get a title.",
        expandable: true,
        selectable: true,
        deletable: true,
        state: {
          expanded: false,
          selected: false,
        },
      });
    case 'checkboxes-subnode2':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "checkbox",
          name: "checkbox3",
        },
        state: {
          expanded: false,
          selected: false,
          input: {
            value: true,
            disabled: true,
          },
        },
      });
    case 'checkboxes-subsubnode1':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        state: {
          expanded: false,
          selected: false,
        },
        addChildCallback: function () {
          const entry = prompt("Give it a string.", "");
          return Promise.resolve(
            entry ? { id: entry, label: entry, deletable: true, selectable: true } : null
          );
        },
      });
    default:
      return baseDefaults;
  }
}
<\/script>`;je.parameters={docs:{source:{code:Ea,language:"html",type:"auto"}}};const Oa=[{id:"radiobuttons-node1",label:"My First Node",children:[]},{id:"radiobuttons-node2",label:"My Second Node",children:[{id:"radiobuttons-subnode1",label:"This is a subnode",children:[]},{id:"radiobuttons-subnode2",label:"This is a checkable, checked subnode",children:[]}]}];function qa(e){const t={addChildTitle:"Add a new child node",deleteTitle:"Delete this node",expanderTitle:"Expand this node"};switch(e.id){case"radiobuttons-node1":return Object.assign(t,{expandable:!0,selectable:!0,input:{type:"radio",name:"radio1",value:"aValueToSubmit",isInitialRadioGroupValue:!0},state:{expanded:!1,selected:!1}});case"radiobuttons-node2":return Object.assign(t,{expandable:!0,selectable:!0,input:{type:"radio",name:"radio1"},state:{expanded:!0,selected:!1}});case"radiobuttons-subnode1":return Object.assign(t,{expandable:!0,selectable:!0,input:{type:"radio",name:"radio2",isInitialRadioGroupValue:!0},state:{expanded:!1,selected:!1}});case"radiobuttons-subnode2":return Object.assign(t,{expandable:!0,selectable:!0,input:{type:"radio",name:"radio2"},state:{expanded:!1,selected:!1}});default:return t}}const za=e=>({components:{TreeView:L},setup(){return{args:e}},data(){let{modelValue:t,...n}=e;return{argsWithoutValue:n,modelValue:t,checkedTvNodes:[]}},template:`<span>
<TreeView v-bind="argsWithoutValue" v-model="modelValue" ref="treeViewRef" />
<section class="checked-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.data.id }}</li>
  </ul>
</section>
</span>`,methods:{refreshCheckedTvList(){this.checkedTvNodes=this.$refs.treeViewRef.getCheckedRadioButtons()}}}),Me=za.bind({});Me.args={modelValue:Oa,modelDefaults:qa};const Ga=`
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: 'radiobuttons-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'radiobuttons-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'radiobuttons-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'radiobuttons-subnode2',
        label: 'This is a checkable, checked subnode',
        children: [],
      }
    ],
  }
];

function modelDefaults(node) {

  const baseDefaults = {
    addChildTitle: "Add a new child node",
    deleteTitle: "Delete this node",
    expanderTitle: "Expand this node",
  };

  switch (node.id) {
    case 'radiobuttons-node1':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "radio",
          name: "radio1",
          value: "aValueToSubmit",
          isInitialRadioGroupValue: true,
        },
        state: {
          expanded: false,
          selected: false,
        },
      });
    case 'radiobuttons-node2':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "radio",
          name: "radio1",
        },
        state: {
          expanded: true,
          selected: false,
        },
      });
    case 'radiobuttons-subnode1':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "radio",
          name: "radio2",
          isInitialRadioGroupValue: true,
        },
        state: {
          expanded: false,
          selected: false,
        },
      });
    case 'radiobuttons-subnode2':
      return Object.assign(baseDefaults, {
        expandable: true,
        selectable: true,
        input: {
          type: "radio",
          name: "radio2",
        },
        state: {
          expanded: false,
          selected: false,
        },
      });
    default:
      return baseDefaults;
  }
}
<\/script>`;Me.parameters={docs:{source:{code:Ga,language:"html",type:"auto"}}};const Wa=[{id:"slots-node1",label:"Checkbox Node",children:[]},{id:"slots-node2",label:"Radiobutton Node"},{id:"slots-node3",label:"Text Node",children:[{id:"slots-subnode1",label:"Checkbox Subnode",children:[]}]},{id:"slots-node4",label:"Text Node with Async Children",children:[]}];function Ba(e){switch(e.id){case"slots-node1":return{input:{type:"checkbox",name:"checkbox1"},state:{input:{value:!1,disabled:!1}}};case"slots-node2":return{input:{type:"radio",name:"radiobutton1"},state:{input:{value:!1,disabled:!1}}};case"slots-node3":return{};case"slots-subnode1":return{input:{type:"checkbox",name:"checkbox2"},state:{input:{value:!1,disabled:!1}}};case"slots-node4":return{expandable:!0,loadChildrenAsync:t=>new Promise(()=>{})};default:return{}}}const Ka=e=>({components:{TreeView:L},setup(){return{args:e}},data(){let{modelValue:t,...n}=e;return{argsWithoutValue:n,modelValue:t}},template:`<span>
<TreeView v-bind="argsWithoutValue" v-model="modelValue">
  <template #loading-root>Root loading custom slot (Not used in this demo)</template>
  <template #expander="{ metaModel, customClasses, expanderId, canExpand, toggleNodeExpanded }">
    <button :id="expanderId"
            type="button"
            v-if="canExpand"
            aria-hidden="true"
            tabindex="-1"
            :title="metaModel.expanderTitle"
            class="grtvn-self-expander"
            :class="[customClasses.treeViewNodeSelfExpander,
            metaModel.state.expanded ? 'grtvn-self-expanded' : '',
            metaModel.state.expanded ? customClasses.treeViewNodeSelfExpanded : '']"
            @click="toggleNodeExpanded">
      {{ metaModel.state.expanded ? 'v' : '>' }}
    </button>
    <span v-else
          class="grtvn-self-spacer"
          :class="customClasses.treeViewNodeSelfSpacer"></span>
  </template>
  <template #checkbox="{ metaModel, customClasses, inputId, checkboxChangeHandler }">
    <label :for="inputId" :title="metaModel.title">
      <input :id="inputId"
            type="checkbox"
            :disabled="metaModel.state.input.disabled"
            v-model="metaModel.state.input.value"
            @change="checkboxChangeHandler" />
      <em style="max-width: 6rem">{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</em>
    </label>
  </template>
  <template #radio="{ metaModel, customClasses, inputId, radioGroupValues, radioChangeHandler }">
    <label :for="inputId" :title="metaModel.title">
      <input v-if="radioGroupValues"
            :id="inputId"
            type="radio"
            :name="metaModel.input.name"
            :value="metaModel.input.value"
            :disabled="metaModel.state.input.disabled"
            v-model="radioGroupValues[metaModel.input.name]"
            @change="radioChangeHandler" />
      <span style="font-weight: bolder">{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</span>
    </label>
  </template>
  <template #text="{ metaModel, customClasses }"><span>{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</span></template>
  <template #loading="{ metaModel, customClasses }">
    <span class="grtvn-loading">
      LOADING PLACHOLDER FOR CHILDREN OF {{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.
    </span>
  </template>
</TreeView>
</span>`}),Fe=Ka.bind({});Fe.args={modelValue:Wa,modelDefaults:Ba};const Ha=`
<template>
  <TreeView v-bind="argsWithoutValue" v-model="modelValue">
    <template #loading-root>Root loading custom slot (Not used in this demo)</template>
    <template #expander="{ metaModel, customClasses, expanderId, canExpand, toggleNodeExpanded }">
      <button :id="expanderId"
              type="button"
              v-if="canExpand"
              aria-hidden="true"
              tabindex="-1"
              :title="metaModel.expanderTitle"
              class="grtvn-self-expander"
              :class="[customClasses.treeViewNodeSelfExpander,
              metaModel.state.expanded ? 'grtvn-self-expanded' : '',
              metaModel.state.expanded ? customClasses.treeViewNodeSelfExpanded : '']"
              @click="toggleNodeExpanded">
        {{ metaModel.state.expanded ? 'v' : '>' }}
      </button>
      <span v-else
            class="grtvn-self-spacer"
            :class="customClasses.treeViewNodeSelfSpacer"></span>
    </template>
    <template #checkbox="{ metaModel, customClasses, inputId, checkboxChangeHandler }">
      <label :for="inputId" :title="metaModel.title">
        <input :id="inputId"
              type="checkbox"
              :disabled="metaModel.state.input.disabled"
              v-model="metaModel.state.input.value"
              @change="checkboxChangeHandler" />
        <em style="max-width: 6rem">{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</em>
      </label>
    </template>
    <template #radio="{ metaModel, customClasses, inputId, radioGroupValues, radioChangeHandler }">
      <label :for="inputId" :title="metaModel.title">
        <input v-if="radioGroupValues"
              :id="inputId"
              type="radio"
              :name="metaModel.input.name"
              :value="metaModel.input.value"
              :disabled="metaModel.state.input.disabled"
              v-model="radioGroupValues[metaModel.input.name]"
              @change="radioChangeHandler" />
        <span style="font-weight: bolder">{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</span>
      </label>
    </template>
    <template #text="{ metaModel, customClasses }"><span>{{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.</span></template>
    <template #loading="{ metaModel, customClasses }">
      <span class="grtvn-loading">
        LOADING PLACHOLDER FOR CHILDREN OF {{ metaModel.data[metaModel.labelProperty] }}. This is custom slot content.
      </span>
    </template>
  </TreeView>
</template>
<script setup>
import { ref } from "vue";
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: 'slots-node1',
    label: 'Checkbox Node',
    children: [],
  },
  {
    id: 'slots-node2',
    label: 'Radiobutton Node',
  },
  {
    id: 'slots-node3',
    label: 'Text Node',
    children: [
      {
        id: 'slots-subnode1',
        label: 'Checkbox Subnode',
        children: []
      }
    ]
  },
  {
    id: 'slots-node4',
    label: 'Text Node with Async Children',
    children: [],
  }
];

function modelDefaults(node) {
  switch (node.id) {
    case 'slots-node1':
      return {
        input: {
          type: "checkbox",
          name: "checkbox1",
        },
        state: {
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'slots-node2':
      return {
        input: {
          type: "radio",
          name: "radiobutton1",
        },
        state: {
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'slots-node3':
      return {};
    case 'slots-subnode1':
      return {
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'slots-node4':
      return {
        expandable: true,
        loadChildrenAsync: (m) => new Promise(() => {}), // Never resolve so the demo node stays up.
      };
    default:
      return {};
  }
}
<\/script>`;Fe.parameters={docs:{source:{code:Ha,language:"html",type:"auto"}}};const Ua=[{id:"addremove-rootNode",label:"Root Node",children:[]}];function Ja(e){const t={addChildCallback:Ya,deleteNodeCallback:Xa,state:{expanded:!0}};switch(e.id){case"addremove-rootNode":return t;default:return Object.assign(t,{deletable:!0})}}let tt=0;function Ya(e){return tt++,Promise.resolve({id:`child-node${tt}`,label:`Added Child ${tt} from parent ${e.data.id}`,children:[]})}function Xa(e){return Promise.resolve(window.confirm(`Delete node ${e.data.id}?`))}const Qa=e=>({components:{TreeView:L},setup(){return{args:e}},data(){let{modelValue:t,...n}=e;return{argsWithoutValue:n,modelValue:t}},template:'<TreeView v-bind="argsWithoutValue" v-model="modelValue" />'}),Ie=Qa.bind({});Ie.args={modelValue:Ua,modelDefaults:Ja};const Za=`
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: 'addremove-rootNode',
    label: 'Root Node',
    children: [],
  }
];

function modelDefaults(node) {
  const baseNodeSpec = {
    addChildCallback,
    deleteNodeCallback,
    state: {
      expanded: true,
    },
  };

  switch (node.id) {
    case 'addremove-rootNode':
      return baseNodeSpec;
    default:
      return Object.assign(baseNodeSpec, { deletable: true });
  }
};

let addRemoveChildCounter = 0;
function addChildCallback(parentModel) {
  addRemoveChildCounter++;
  return Promise.resolve({
    id: \`child-node\${addRemoveChildCounter}\`,
    label: \`Added Child \${addRemoveChildCounter} from parent \${parentModel.data.id}\`,
    children: [],
  });
}
function deleteNodeCallback(model) {
  return Promise.resolve(window.confirm(\`Delete node \${model.data.id}?\`));
}
<\/script>`;Ie.parameters={docs:{source:{code:Za,language:"html",type:"auto"}}};const _a=[{id:"selection-node1",label:"My First Node",children:[]},{id:"selection-node2",label:"My Second Node",children:[{id:"selection-subnode1",label:"This is a subnode",children:[]},{id:"selection-subnode2",label:"This is a checkable, checked subnode",children:[{id:"subsubnode1",label:"An even deeper node",children:[]}]}]},{id:"selection-node3",label:"My Third Node",children:[{id:"subnode31",label:"This is an expanded subnode",children:[]}]}];function en(e){switch(e.id){case"selection-node1":return{expandable:!0,selectable:!0,deletable:!0,input:{type:"checkbox",name:"checkbox1"},state:{expanded:!1,selected:!1,input:{value:!1,disabled:!1}},addChildCallback:function(){const t=prompt("Give it a string.","");return Promise.resolve(t?{id:t,label:t,deletable:!0,selectable:!0}:null)}};case"selection-node2":return{title:"My second node, and its fantastic title",expandable:!0,selectable:!0,input:{type:"checkbox",name:"checkbox2"},state:{expanded:!0,selected:!1,input:{value:!1,disabled:!1}}};case"selection-subnode1":return{title:"Even non-input nodes should get a title.",expandable:!0,selectable:!0,deletable:!0,state:{expanded:!1,selected:!1}};case"selection-subnode2":return{expandable:!0,selectable:!0,input:{type:"checkbox",name:"checkbox3"},state:{expanded:!1,selected:!1,input:{value:!0,disabled:!0}}};case"subsubnode1":return{expandable:!0,selectable:!0,state:{expanded:!1,selected:!1},addChildCallback:function(){const t=prompt("Give it a string.","");return Promise.resolve(t?{id:t,label:t,deletable:!0,selectable:!0}:null)}};case"selection-node3":return{expandable:!1,selectable:!0,deletable:!0,state:{expanded:!0,selected:!1,input:{value:!1,disabled:!1}}};case"subnode31":return{expandable:!1,selectable:!0,deletable:!0,state:{expanded:!1,selected:!1}}}}const tn=`<span>
<label for="modeSelect">Selection Mode</label>
<select v-model="selectionMode" id="modeSelect" style="margin: 0 0 2rem 1rem;">
  <option value="single">Single</option>
  <option value="selectionFollowsFocus">Selection Follows Focus</option>
  <option value="multiple">Multiple</option>
  <option value="none">No Selection</option>
</select>
<TreeView v-bind="argsWithoutValue" v-model="modelValue" :selection-mode="selectionMode" ref="treeViewRef" />
<section class="selected-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshSelectedList">What's selected?</button>
  <ul id="selectedList">
    <li v-for="selectedNode in selectedNodes">{{ selectedNode.data.id }}</li>
  </ul>
</section>
</span>`,an=e=>({components:{TreeView:L},setup(){return{args:e}},template:tn,data(){let{modelValue:t,...n}=e;return{argsWithoutValue:n,modelValue:t,selectionMode:I.Single,selectedNodes:[]}},methods:{refreshSelectedList(){this.selectedNodes=this.$refs.treeViewRef.getSelected()}}}),Ae=an.bind({});Ae.args={modelValue:_a,modelDefaults:en,selectionMode:I.Single};const nn=`
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" selection-mode="single" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: 'selection-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'selection-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'selection-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'selection-subnode2',
        label: 'This is a checkable, checked subnode',
        children: [
          {
            id: 'subsubnode1',
            label: 'An even deeper node',
            children: [],
          }
        ],
      }
    ],
  },
  {
    id: 'selection-node3',
    label: 'My Third Node',
    children: [
      {
        id: 'subnode31',
        label: 'This is an expanded subnode',
        children: [],
      }
    ],
  }
];

function modelDefaults(node) {
  switch (node.id) {
    case 'selection-node1':
      return {
        expandable: true,
        selectable: true,
        deletable: true,
        input: {
          type: "checkbox",
          name: "checkbox1",
        },
        state: {
          expanded: false,
          selected: false,
          input: {
            value: false,
            disabled: false,
          },
        },
        addChildCallback: function () {
          const entry = prompt("Give it a string.", "");
          return Promise.resolve(
            entry ? { id: entry, label: entry, deletable: true, selectable: true } : null
          );
        },
      };
    case 'selection-node2':
      return {
        title: "My second node, and its fantastic title",
        expandable: true,
        selectable: true,
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          expanded: true,
          selected: false,
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'selection-subnode1':
      return {
        title: "Even non-input nodes should get a title.",
        expandable: true,
        selectable: true,
        deletable: true,
        state: {
          expanded: false,
          selected: false,
        },
      };
    case 'selection-subnode2':
      return {
        expandable: true,
        selectable: true,
        input: {
          type: "checkbox",
          name: "checkbox3",
        },
        state: {
          expanded: false,
          selected: false,
          input: {
            value: true,
            disabled: true,
          },
        },
      };
    case 'subsubnode1':
      return {
        expandable: true,
        selectable: true,
        state: {
          expanded: false,
          selected: false,
        },
        addChildCallback: function () {
          const entry = prompt("Give it a string.", "");
          return Promise.resolve(
            entry ? { id: entry, label: entry, deletable: true, selectable: true } : null
          );
        },
      };
    case 'selection-node3':
      return {
        expandable: false,
        selectable: true,
        deletable: true,
        state: {
          expanded: true,
          selected: false,
          input: {
            value: false,
            disabled: false,
          },
        },
      };
    case 'subnode31':
      return {
        expandable: false,
        selectable: true,
        deletable: true,
        state: {
          expanded: false,
          selected: false,
        },
      };
  }
};
<\/script>`;Ae.parameters={docs:{source:{code:nn,language:"html",type:"auto"}}};const on=e=>({components:{TreeView:L},setup(){return{args:e}},data(){return{modelValue:[]}},template:'<TreeView v-bind="args" v-model="modelValue" />'}),$e=on.bind({});$e.args={loadNodesAsync:ln,modelDefaults:()=>({loadChildrenAsync:dn})};let yt=0;async function ln(){return new Promise(e=>setTimeout(e.bind(null,[{id:"async-rootNode",label:"Root Node",children:[]}]),1e3))}async function dn(e){yt++;let t=yt;return new Promise(n=>setTimeout(n.bind(null,[{id:`async-child-node${t}`,label:`Child ${t} from parent ${e.data.id}`,children:[]}]),1e3))}const sn=`
<template>
  <TreeView v-model="modelValue" :load-nodes-async=""loadNodesCallback" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const modelValue = [];
const modelDefaults = () => ({ loadChildrenAsync: loadChildrenCallback });

let asyncChildCounter = 0;
async function loadNodesCallback() {
  return new Promise(resolve => setTimeout(resolve.bind(null, [{ id: 'async-rootNode', label: 'Root Node', children: [] }]), 1000));
}
async function loadChildrenCallback(parentModel) {
  asyncChildCounter++;
  let currentCounter = asyncChildCounter;
  return new Promise(resolve => setTimeout(resolve.bind(null, [{ id: \`async-child-node\${currentCounter}\`, label: \`Child \${currentCounter} from parent \${parentModel.data.id}\`, children: [] }]), 1000));
}
<\/script>`;$e.parameters={docs:{source:{code:sn,language:"html",type:"auto"}}};const rn=[{id:"dragdrop1-node1",label:"Node One",children:[]},{id:"dragdrop1-node2",label:"Node Two",children:[{id:"dragdrop1-subnode1",label:"Subnode One",children:[]},{id:"dragdrop1-subnode2",label:"Subnode Two",children:[{id:"dragdrop1-subsubnode1",label:"Sub-Subnode 1",children:[]},{id:"dragdrop1-subsubnode2",label:"Sub-Subnode 2",children:[]}]}]}],un=[{id:"dragdrop2-node1",label:"Node One",children:[]},{id:"dragdrop2-node2",label:"Node Two",children:[{id:"dragdrop2-subnode1",label:"Subnode One",children:[]},{id:"dragdrop2-subnode2",label:"Subnode Two",children:[{id:"dragdrop2-subsubnode1",label:"Sub-Subnode 1",children:[]},{id:"dragdrop2-subsubnode2",label:"Sub-Subnode 2",children:[]}]}]}];function cn(e){const t={expanderTitle:"Expand this node",draggable:!0,allowDrop:!0,state:{expanded:!0}};return(e.id==="dragdrop1-node1"||e.id==="dragdrop2-node1")&&(t.addChildCallback=function(){return Promise.resolve({id:""+Math.random(),label:"Added"})}),t}const pn=`<span>
<h2>Tree 1</h2>
<TreeView v-model="modelValue1" :model-defaults="args.modelDefaults" />
<h2>Tree 2</h2>
<TreeView v-model="modelValue2" :model-defaults="args.modelDefaults" />
<h2>Text Drop Target</h2>
<textarea style="width: 90%" rows="10"></textarea>
</span>`,hn=e=>({components:{TreeView:L},setup(){return{args:e}},template:pn,data(){return{modelValue1:e.modelValue1,modelValue2:e.modelValue2}}}),Re=hn.bind({});Re.args={modelValue1:rn,modelValue2:un,modelDefaults:cn};const fn=`
<template>
  <h2>Tree 1</h2>
  <TreeView v-model="tree1Data" :model-defaults="modelDefaults" />
  <h2>Tree 2</h2>
  <TreeView v-model="tree2Data" :model-defaults="modelDefaults" />
  <h2>Text Drop Target</h2>
  <textarea style="width: 90%" rows="10"></textarea>
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const tree1Data = [
  {
    id: 'dragdrop1-node1',
    label: 'Node One',
    children: [],
  },
  {
    id: 'dragdrop1-node2',
    label: 'Node Two',
    children: [
      {
        id: 'dragdrop1-subnode1',
        label: 'Subnode One',
        children: []
      },
      {
        id: 'dragdrop1-subnode2',
        label: 'Subnode Two',
        children: [
          {
            id: 'dragdrop1-subsubnode1',
            label: 'Sub-Subnode 1',
            children: []
          },
          {
            id: 'dragdrop1-subsubnode2',
            label: 'Sub-Subnode 2',
            children: []
          }
        ]
      }
    ]
  }
];

const tree2Data = [
  {
    id: 'dragdrop2-node1',
    label: 'Node One',
    children: [],
  },
  {
    id: 'dragdrop2-node2',
    label: 'Node Two',
    children: [
      {
        id: 'dragdrop2-subnode1',
        label: 'Subnode One',
        children: []
      },
      {
        id: 'dragdrop2-subnode2',
        label: 'Subnode Two',
        children: [
          {
            id: 'dragdrop2-subsubnode1',
            label: 'Sub-Subnode 1',
            children: []
          },
          {
            id: 'dragdrop2-subsubnode2',
            label: 'Sub-Subnode 2',
            children: []
          }
        ]
      }
    ]
  }
];

function modelDefaults(node) {

  const baseDefaults = {
    expanderTitle: "Expand this node",
    draggable: true,
    allowDrop: true,
    state: {
      expanded: true,
    },
  };

  if (node.id === 'dragdrop1-node1' || node.id === 'dragdrop2-node1') {
    baseDefaults.addChildCallback = function () { return Promise.resolve({ id: '' + Math.random(), label: 'Added' }); }
  }

  return baseDefaults;
};
<\/script>`;Re.parameters={docs:{source:{code:fn,language:"html",type:"auto"}}};const bn=[{id:"basic-node1",label:"My First Node",children:[]},{id:"basic-node2",label:"My Second Node",children:[{id:"basic-subnode1",label:"This is a subnode",children:[]},{id:"basic-subnode2",label:"Another Subnode",children:[]},{id:"basic-subnode3",label:"This is a disabled, checked subnode",children:[{id:"basic-subsubnode1",label:"An even deeper node",children:[]}]}]}];function mn(e){switch(e.id){case"basic-node1":return{};case"basic-node2":return{title:"My node, and its fantastic title",input:{type:"checkbox",name:"checkbox1"},state:{expanded:!0}};case"basic-subnode1":return{input:{type:"radio",name:"radio1",isInitialRadioGroupValue:!0}};case"basic-subnode2":return{input:{type:"radio",name:"radio1"}};case"basic-subnode3":return{input:{type:"checkbox",name:"checkbox2"},state:{input:{value:!0,disabled:!0}}};default:return{}}}const gn=e=>({components:{TreeView:L},setup(){return{args:e}},data(){let{modelValue:t,...n}=e;return{argsWithoutValue:n,modelValue:t,checkedTvNodes:[],filterText:"",filterMethod:null}},template:`<span>
<TreeView v-bind="argsWithoutValue" v-model="modelValue" :filter-method="filterMethod" ref="treeViewRef" />
<section style="margin: 10px 0">
  <input v-model="filterText" type='text' id="filter" placeholder="Filter by label text" style="margin-right: 4px" /><button @click="applyFilter">Apply Filter</button>
</section>
<section class="checked-nodes">
  <button type="button" style="margin-top: 1rem" @click="refreshCheckedTvList">What's been checked (checkboxes and radiobuttons)?</button>
  <ul id="checkedList">
    <li v-for="checkedNode in checkedTvNodes">{{ checkedNode.data.id }}</li>
  </ul>
</section>
</span>`,methods:{applyFilter(){if(this.filterText==="")this.filterMethod=null;else{const t=this.filterText.toLowerCase();this.filterMethod=n=>n.data.label.toLowerCase().includes(t)}},refreshCheckedTvList(){this.checkedTvNodes=[...this.$refs.treeViewRef.getCheckedCheckboxes(),...this.$refs.treeViewRef.getCheckedRadioButtons()]}}}),Pe=gn.bind({});Pe.args={modelValue:bn,modelDefaults:mn};const vn=`
<template>
  <span>
    <TreeView v-model="treeData" :model-defaults="modelDefaults" :filter-method="filterMethod" />
    <section style="margin: 10px 0">
      <input v-model="filterText" type='text' id="filter" placeholder="Filter by label text" style="margin-right: 4px" /><button @click="applyFilter">Apply Filter</button>
    </section>
  </span>
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const filterText = ref("");
const filterMethod = ref(null);

const applyFilter = () => {
  if (filterText.value === "") {
    filterMethod.value = null;
  }
  else {
    const lowercaseFilter = filterText.value.toLowerCase();
    filterMethod.value = (n) => n.data.label.toLowerCase().includes(lowercaseFilter);
  }
}

export const treeData = [
  {
    id: 'basic-node1',
    label: 'My First Node',
    children: [],
  },
  {
    id: 'basic-node2',
    label: 'My Second Node',
    children: [
      {
        id: 'basic-subnode1',
        label: 'This is a subnode',
        children: [],
      },
      {
        id: 'basic-subnode2',
        label: 'Another Subnode',
        children: [],
      },
      {
        id: 'basic-subnode3',
        label: 'This is a disabled, checked subnode',
        children: [
          {
            id: 'basic-subsubnode1',
            label: 'An even deeper node',
            children: []
          }
        ]
      }
    ]
  }
];

export function modelDefaults(node) {
  switch (node.id) {
    case 'basic-node1':
      return {};
    case 'basic-node2':
      return {
        title: "My node, and its fantastic title",
        input: {
          type: "checkbox",
          name: "checkbox1",
        },
        state: {
          expanded: true,
        },
      };
    case 'basic-subnode1':
      return {
        input: {
          type: "radio",
          name: "radio1",
          isInitialRadioGroupValue: true,
        },
      };
    case 'basic-subnode2':
      return {
        input: {
          type: "radio",
          name: "radio1",
        },
      };
    case 'basic-subnode3':
      return {
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          input: {
            value: true,
            disabled: true,
          },
        },
      };
    default:
      return {};
  }
}
<\/script>`;Pe.parameters={docs:{source:{code:vn,language:"html",type:"auto"}}};const xn=[{id:"external-changes-node1",label:"My First Node",children:[]},{id:"external-changes-node2",label:"My Second Node",children:[{id:"external-changes-subnode1",label:"This is a subnode",children:[]},{id:"external-changes-subnode2",label:"Another Subnode",children:[]},{id:"external-changes-subnode3",label:"This is a disabled, checked subnode",children:[{id:"external-changes-subsubnode1",label:"An even deeper node",children:[]}]}]}];function yn(e){switch(e.id){case"external-changes-node1":return{};case"external-changes-node2":return{title:"My node, and its fantastic title",input:{type:"checkbox",name:"checkbox1"},state:{expanded:!0}};case"external-changes-subnode1":return{input:{type:"radio",name:"radio1",isInitialRadioGroupValue:!0}};case"external-changes-subnode2":return{input:{type:"radio",name:"radio1"}};case"external-changes-subnode3":return{input:{type:"checkbox",name:"checkbox2"},state:{input:{value:!0,disabled:!0}}};case"external-changes-subsubnode1":return{};default:return{input:{type:"checkbox",name:"checkbox"+crypto.randomUUID()},state:{input:{value:!1}}}}}const Cn=e=>({components:{TreeView:L},setup(){return{args:e}},data(){let{modelValue:t,...n}=e;return{argsWithoutValue:n,modelValue:t,checkedTvNodes:[]}},template:`<span>
<TreeView v-bind="argsWithoutValue" v-model="modelValue" ref="treeViewRef" />
<section style="display: flex; flex-direction: column; gap: 4px; width: fit-content; margin-top: 16px;">
  <button type="button" @click="addNode">Add a node to the end of the model</button>
  <button type="button" @click="addChildNode" :disabled="modelValue.length === 0">Add a child node to the end of the first node's model</button>
  <button type="button" @click="removeNode" :disabled="modelValue.length === 0">Remove the first node from the model</button>
  <button type="button" @click="removeFocusableNode">Remove the focused node from the model</button>
  <button type="button" @click="swapNodes" :disabled="modelValue.length < 2">Swap the first two nodes in the model</button>
  <button type="button" @click="toggleCheckNode">Toggle the first checkbox in the meta model</button>
</section>
</span>`,methods:{addNode(){const t=crypto.randomUUID();this.modelValue.push({id:"external-changes-node-"+t,label:"A random node - "+t,children:[]})},addChildNode(){const t=crypto.randomUUID();this.modelValue[0].children.push({id:"external-changes-subnode-"+t,label:"A random subnode - "+t,children:[]})},removeFocusableNode(){const t=this.$refs.treeViewRef.getMatching(n=>n.focusable)[0];t&&(this.modelValue.some(n=>t.data.id===n.id)?this.modelValue.splice(this.modelValue.findIndex(n=>t.data.id===n.id),1):this.traverseTree(n=>{if(n.children.some(d=>t.data.id===d.id))return n.children.splice(n.children.findIndex(d=>t.data.id===d.id),1),!1}))},removeNode(){this.modelValue.shift()},swapNodes(){[this.modelValue[0],this.modelValue[1]]=[this.modelValue[1],this.modelValue[0]]},toggleCheckNode(){const t=this.$refs.treeViewRef.metaModel.find(n=>{var d;return((d=n.input)==null?void 0:d.type)==="checkbox"});t&&(t.state.input.value=!t.state.input.value)},traverseTree(t){let n=this.modelValue.slice(),d=!0;for(;n.length>0&&d!==!1;){const l=n.shift();n=(l.children??[]).concat(n),d=t(l)??!0}}}}),Le=Cn.bind({});Le.args={modelValue:xn,modelDefaults:yn};const kn=`
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: "external-changes-node1",
    label: "My First Node",
    children: [],
  },
  {
    id: "external-changes-node2",
    label: "My Second Node",
    children: [
      {
        id: "external-changes-subnode1",
        label: "This is a subnode",
        children: [],
      },
      {
        id: "external-changes-subnode2",
        label: "Another Subnode",
        children: [],
      },
      {
        id: "external-changes-subnode3",
        label: "This is a disabled, checked subnode",
        children: [
          {
            id: "external-changes-subsubnode1",
            label: "An even deeper node",
            children: [],
          },
        ],
      },
    ],
  },
];

function modelDefaults(node) {
  switch (node.id) {
    case "external-changes-node1":
      return {};
    case "external-changes-node2":
      return {
        title: "My node, and its fantastic title",
        input: {
          type: "checkbox",
          name: "checkbox1",
        },
        state: {
          expanded: true,
        },
      };
    case "external-changes-subnode1":
      return {
        input: {
          type: "radio",
          name: "radio1",
          isInitialRadioGroupValue: true,
        },
      };
    case "external-changes-subnode2":
      return {
        input: {
          type: "radio",
          name: "radio1",
        },
      };
    case "external-changes-subnode3":
      return {
        input: {
          type: "checkbox",
          name: "checkbox2",
        },
        state: {
          input: {
            value: true,
            disabled: true,
          },
        },
      };
    case "external-changes-subsubnode1":
      return {};
    default:
      return {
        input: {
          type: "checkbox",
          name: "checkbox" + crypto.randomUUID(),
        },
        state: {
          input: {
            value: false,
          },
        },
      };
  }
}
<\/script>`;Le.parameters={docs:{source:{code:kn,language:"html",type:"auto"}}};const Nn=[{id:"customization-class-rootNode",label:"Root Node",children:[{id:"customization-class-subNode",label:"Subnode",children:[]}]}];function Tn(e){const t={addChildCallback:Vn,customizations:{classes:{treeViewNodeSelf:"large-line",treeViewNodeSelfText:"big-text"}}};return e.id!=="customization-class-rootNode"&&(t.deletable=!0),t}let at=0;async function Vn(e){return at++,Promise.resolve({id:`customization-class-child-node${at}`,label:`Added Child ${at} of ${e.data.id}`,children:[]})}const wn=e=>({components:{TreeView:L},setup(){return{args:e}},data(){let{modelValue:t,...n}=e;return{argsWithoutValue:n,modelValue:t}},template:'<TreeView v-bind="argsWithoutValue" v-model="modelValue" />'}),Ee=wn.bind({});Ee.args={modelValue:Nn,modelDefaults:Tn};const Dn=`
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" />
</template>
<script setup>
import { TreeView } from "@grapoza/vue-tree";

const treeData = [
  {
    id: "customization-class-rootNode",
    label: "Root Node",
    children: [
      {
        id: "customization-class-subNode",
        label: "Subnode",
        children: [],
      },
    ],
  },
];

function modelDefaults(node) {
  const defaults = {
    addChildCallback,
    customizations: {
      classes: {
        treeViewNodeSelf: "large-line",
        treeViewNodeSelfText: "big-text",
      },
    },
  };

  if (node.id !== "customization-class-rootNode") {
    defaults.deletable = true;
  }

  return defaults;
}

let classChildCounter = 0;
async function addChildCallback(parentModel) {
  classChildCounter++;
  return Promise.resolve({
    id: \`customization-class-child-node\${classChildCounter}\`,
    label: \`Added Child \${classChildCounter} of \${parentModel.data.id}\`,
    children: [],
  });
}
<\/script>`;Ee.parameters={docs:{source:{code:Dn,language:"html",type:"auto"}}};const Sn=[{id:"customization-skin-rootNode",label:"Root Node",children:[{id:"customization-skin-subNode",label:"Subnode",children:[]}]}];function jn(e){const t={addChildCallback:Mn,customizations:{classes:{treeViewNodeSelfExpander:"action-button",treeViewNodeSelfExpandedIndicator:"fas fa-chevron-right",treeViewNodeSelfAction:"action-button",treeViewNodeSelfAddChildIcon:"fas fa-plus-circle",treeViewNodeSelfDeleteIcon:"fas fa-minus-circle"}}};return e.id!=="customization-skin-rootNode"&&(t.deletable=!0),t}async function Mn(e){return Promise.resolve({id:`customization-skin-child-node${this.childCounter}`,label:`Added Child ${this.childCounter} of ${e.data.id}`,children:[]})}const Fn=e=>({components:{TreeView:L},setup(){return{args:e}},data(){let{modelValue:t,...n}=e;return{argsWithoutValue:n,modelValue:t}},template:'<TreeView v-bind="argsWithoutValue" v-model="modelValue" />'}),Oe=Fn.bind({});Oe.args={modelValue:Sn,skinClass:"grayscale",modelDefaults:jn};const In=`
<template>
  <TreeView v-model="treeData" :model-defaults="modelDefaults" :skin-class="skinClass" />
</template>
<script setup>
import TreeView from "../../src/components/TreeView.vue";

const skinClass = "grayscale";

const treeData = [
  {
    id: "customization-skin-rootNode",
    label: "Root Node",
    children: [
      {
        id: "customization-skin-subNode",
        label: "Subnode",
        children: [],
      },
    ],
  },
];

function modelDefaults(node) {
  const defaults = {
    addChildCallback,
    customizations: {
      classes: {
        treeViewNodeSelfExpander: "action-button",
        treeViewNodeSelfExpandedIndicator: "fas fa-chevron-right",
        treeViewNodeSelfAction: "action-button",
        treeViewNodeSelfAddChildIcon: "fas fa-plus-circle",
        treeViewNodeSelfDeleteIcon: "fas fa-minus-circle",
      },
    },
  };

  if (node.id !== "customization-skin-rootNode") {
    defaults.deletable = true;
  }

  return defaults;
}

let skinChildCounter = 0;
async function addChildCallback(parentModel) {
  skinChildCounter++;
  return Promise.resolve({
    id: \`customization-skin-child-node\${this.childCounter}\`,
    label: \`Added Child \${this.childCounter} of \${parentModel.data.id}\`,
    children: [],
  });
}
<\/script>`;Oe.parameters={docs:{source:{code:In,language:"html",type:"auto"}}};const An={title:"@grapoza vue-tree/Examples",component:L,argTypes:{modelValue:{description:"The actual tree data (used via v-model)"},skinClass:{description:"A class added to the top-most element; used in CSS selectors for all of the component's styles"}},parameters:{controls:{sort:"requiredFirst"},docs:{page:$t}}},$n=["Basic","Static","SettingDefaults","Checkboxes","Radiobuttons","Slots","AddRemove","Selection","Async","DragDrop","Filtering","ExternalDataChanges","CustomizationViaClasses","CustomizationViaSkin"],Rn=Object.freeze(Object.defineProperty({__proto__:null,AddRemove:Ie,Async:$e,Basic:we,Checkboxes:je,CustomizationViaClasses:Ee,CustomizationViaSkin:Oe,DragDrop:Re,ExternalDataChanges:Le,Filtering:Pe,Radiobuttons:Me,Selection:Ae,SettingDefaults:Se,Slots:Fe,Static:De,__namedExportsOrder:$n,default:An},Symbol.toStringTag,{value:"Module"}));function Ct(e){const t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",p:"p",...kt(),...e.components};return o.jsxs(o.Fragment,{children:[o.jsx(qt,{title:"@grapoza vue-tree/Examples",of:Rn}),`
`,o.jsx("style",{children:`
/* Work around https://github.com/storybookjs/storybook/issues/16188 */
.docs-story > div > div[scale='1'][height] {
    height: auto;
    min-height: 20px;
}
`}),`
`,o.jsx(t.h1,{id:"examples",children:"Examples"}),`
`,o.jsx(t.h2,{id:"a-basic-tree-view",children:"A Basic Tree View"}),`
`,o.jsx(t.p,{children:"The most basic use of the tree view consists of giving it some data and letting the tree use the default tree node properties."}),`
`,o.jsxs(t.p,{children:["If you want more control over the model, you can specify a function for the ",o.jsx(t.code,{children:"modelDefaults"})," property which takes a node from your model and returns configuration to use for that node."]}),`
`,o.jsx("a",{target:"_blank",href:"assets_data/basicTreeViewData.js",children:"See the Model Data"}),`
`,o.jsx(E,{of:we}),`
`,o.jsx(t.h2,{id:"a-static-tree-view",children:"A Static Tree View"}),`
`,o.jsxs(t.p,{children:["If all you need is a static tree (no expanding subnodes) then set the ",o.jsx(t.code,{children:"expandable"})," property to false for each node. You can then set the ",o.jsx(t.code,{children:"expanded"})," property through code to hide/show children of a node as needed. The most common case is to always set it to ",o.jsx(t.code,{children:"true"})," for all nodes."]}),`
`,o.jsx("a",{target:"_blank",href:"assets_data/staticTreeViewData.js",children:"See the Model Data"}),`
`,o.jsx(E,{of:De}),`
`,o.jsx(t.h2,{id:"setting-defaults",children:"Setting Defaults"}),`
`,o.jsxs(t.p,{children:["If there are common settings that should be used by all nodes, specific nodes, or even a single node, these can be given to the tree using the ",o.jsx(t.code,{children:"modelDefaults"})," property. This allows you to customize things like what model props are used for the nodes' labels and whether all nodes are a certain type of input. Note that the expandable node below is expanded by default, as set from ",o.jsx(t.code,{children:"modelDefaults"}),". The tree below uses the ",o.jsx(t.code,{children:"identifier"})," and ",o.jsx(t.code,{children:"description"})," properties of the node objects instead of  the defaults (",o.jsx(t.code,{children:"id"})," and ",o.jsx(t.code,{children:"label"}),"), and has all nodes expanded by default. These are set for all nodes at once by using ",o.jsx(t.code,{children:"modelDefaults"}),". For more info, see ",o.jsx(t.a,{href:"?path=/docs/grapoza-vue-tree-home--page#default-data",children:"the docs"}),"."]}),`
`,o.jsx(E,{of:Se}),`
`,o.jsx(t.h2,{id:"adding-and-removing-nodes",children:"Adding and Removing Nodes"}),`
`,o.jsxs(t.p,{children:["Any node can be marked as deletable or provide a callback used to create a new child node. To allow a node to have children added, set an ",o.jsx(t.code,{children:"addChildCallback"})," property on the returned value for the node from ",o.jsx(t.code,{children:"modelDefaults"}),". The ",o.jsx(t.code,{children:"addChildCallback"})," can take the parent node's meta data as an argument, and should return a Promise that resolves to the node data to add to the model. To make a node deletable, just set a ",o.jsx(t.code,{children:"deletable"})," property to ",o.jsx(t.code,{children:"true"})," on the returned value for the node from ",o.jsx(t.code,{children:"modelDefaults"}),". You can also optionally specify a ",o.jsx(t.code,{children:"deleteNodeCallback"})," method that accepts the meta data of the node to delete as an argument and returns a Promise resoving to a boolean indicating whether to delete that node."]}),`
`,o.jsx("a",{target:"_blank",href:"assets_data/addRemoveTreeViewData.js",children:"See the Model Data"}),`
`,o.jsx(E,{of:Ie}),`
`,o.jsx(t.h2,{id:"checkboxes",children:"Checkboxes"}),`
`,o.jsx(t.p,{children:"Support for checkboxes is built into the tree view."}),`
`,o.jsxs(t.p,{children:["To create a checkbox node, specify ",o.jsx(t.code,{children:"input.type = 'checkbox'"})," on the returned value for the node from ",o.jsx(t.code,{children:"modelDefaults"}),". To initialize the node as checked, specify ",o.jsx(t.code,{children:"state.input.value = true"}),"."]}),`
`,o.jsxs(t.p,{children:["The convenience method ",o.jsx(t.code,{children:"getCheckedCheckboxes"})," is exposed on the tree component to make it easy to get the checkbox nodes that have been checked."]}),`
`,o.jsx("a",{target:"_blank",href:"assets_data/checkboxesTreeViewData.js",children:"See the Model Data"}),`
`,o.jsx(E,{of:je}),`
`,o.jsx(t.h2,{id:"radiobuttons",children:"Radiobuttons"}),`
`,o.jsx(t.p,{children:"Support for radio buttons is also built into the tree view."}),`
`,o.jsxs(t.p,{children:["To create a radio button node, specify ",o.jsx(t.code,{children:"input.type = 'radio'"})," on the returned value for the node from ",o.jsx(t.code,{children:"modelDefaults"}),", give the node a name using the ",o.jsx(t.code,{children:"input.name"})," property, and give the node a value using ",o.jsx(t.code,{children:"input.value"}),". The name will determine the radio button group to which the radio button belongs. To initialize a node as checked set ",o.jsx(t.code,{children:"input.isInitialRadioGroupValue"})," to ",o.jsx(t.code,{children:"true"})," on the returned value for the node from ",o.jsx(t.code,{children:"modelDefaults"}),". If multiple nodes within a radio button group are specified as ",o.jsx(t.code,{children:"isInitialRadioGroupValue"}),", the last one in wins."]}),`
`,o.jsxs(t.p,{children:["The convenience method ",o.jsx(t.code,{children:"getCheckedRadioButtons"})," is exposed on the tree component to make it easy to get the radio nodes that have been checked."]}),`
`,o.jsx("a",{target:"_blank",href:"assets_data/radiobuttonsTreeViewData.js",children:"See the Model Data"}),`
`,o.jsx(E,{of:Me}),`
`,o.jsx(t.h2,{id:"selection",children:"Selection"}),`
`,o.jsxs(t.p,{children:["Any node can be marked as selectable. To set a node's selectability, set a ",o.jsx(t.code,{children:"selectable"})," property to ",o.jsx(t.code,{children:"true"})," or ",o.jsx(t.code,{children:"false"})," (the default) on the returned value for the node from ",o.jsx(t.code,{children:"modelDefaults"}),". Different selection modes allow different selection behavior, but only affect nodes that are selectable."]}),`
`,o.jsxs(t.p,{children:["The convenience method ",o.jsx(t.code,{children:"getSelected"})," is exposed on the tree component to make it easy to get the nodes that have been selected. For more info see ",o.jsx(t.a,{href:"?path=/docs/grapoza-vue-tree-home--page#selection-mode",children:"the docs"}),"."]}),`
`,o.jsx("a",{target:"_blank",href:"assets_data/selectionTreeViewData.js",children:"See the Model Data"}),`
`,o.jsx(E,{of:Ae}),`
`,o.jsx(t.h2,{id:"slots",children:"Slots"}),`
`,o.jsxs(t.p,{children:["A tree view has slots available for replacing specific types of nodes. The ",o.jsx(t.code,{children:"expander"}),", ",o.jsx(t.code,{children:"text"}),", ",o.jsx(t.code,{children:"checkbox"}),", ",o.jsx(t.code,{children:"radio"}),", ",o.jsx(t.code,{children:"loading-root"})," and ",o.jsx(t.code,{children:"loading"})," slots replace the correpsonding types of nodes. For more info, see ",o.jsx(t.a,{href:"?path=/docs/grapoza-vue-tree-home--page#slots",children:"the docs"}),"."]}),`
`,o.jsx("a",{target:"_blank",href:"assets_data/slotsTreeViewData.js",children:"See the Model Data"}),`
`,o.jsx(E,{of:Fe}),`
`,o.jsx(t.h2,{id:"asynchronous-loading",children:"Asynchronous Loading"}),`
`,o.jsx(t.p,{children:"Two types of asynchronous loading are available. The first loads the root data for the tree view itself, and the second asynchronously loads child data when a node is expanded."}),`
`,o.jsxs(t.p,{children:["You can load root nodes asynchronously by providing a function to the ",o.jsx(t.code,{children:"loadNodesAsync"})," property of the tree view. The function should return a Promise that resolves to an array of model data to add as root nodes."]}),`
`,o.jsxs(t.p,{children:["You can load child nodes asynchronously by providing a function to the ",o.jsx(t.code,{children:"loadChildrenAsync"})," property on the returned value for the node from ",o.jsx(t.code,{children:"modelDefaults"}),". The function can take the parent node's meta data as an argument, and should return a Promise that resolves to an array of model data to add as children."]}),`
`,o.jsx(E,{of:$e}),`
`,o.jsx(t.h2,{id:"custom-styles",children:"Custom Styles"}),`
`,o.jsxs(t.p,{children:["Custom styling is achieved through a combination of using the ",o.jsx(t.code,{children:"customizations"})," property on the returned value for the node from ",o.jsx(t.code,{children:"modelDefaults"})," to apply custom styles to parts of nodes, along with a custom ",o.jsx(t.code,{children:"skinStyle"})," TreeView prop and associated stylesheet. Of course, you could also just write some very specific selectors to override the default styles. For more info, see ",o.jsx(t.a,{href:"?path=/docs/grapoza-vue-tree-home--page#customizing-the-tree-view",children:"the docs"}),"."]}),`
`,o.jsx(t.p,{children:"The default styles are applied to all of the other examples on this page (with the exception of the Slots example). There's not much to see there, since the intention is for the user to handle styling the tree view while the component focuses on creating a workable structure. Things generally line up right, but not much more can be said for it."}),`
`,o.jsxs(t.p,{children:["Some simple customizations can be done by applying custom classes to various parts of the tree using the ",o.jsx(t.code,{children:"customizations"})," property on the returned value from ",o.jsx(t.code,{children:"modelDefaults"}),". In this example, ",o.jsx(t.code,{children:"customizations.classes.treeViewNodeSelfText"})," is given a value of ",o.jsx(t.code,{children:"big-text"}),". The ",o.jsx(t.code,{children:"big-text"})," class is defined in a classbased.css stylesheet."]}),`
`,o.jsx("a",{target:"_blank",href:"assets_css/classbased.css",children:"See the Stylesheet"}),`
`,o.jsx("br",{}),`
`,o.jsx("a",{target:"_blank",href:"assets_data/customizationViaClassesTreeViewData.js",children:"See the Model Data"}),`
`,o.jsx(E,{of:Ee}),`
`,o.jsxs(t.p,{children:["In the next example, a tree view has been given a ",o.jsx(t.code,{children:"skin-class"})," prop value of ",o.jsx(t.code,{children:"grayscale"}),". This effectively swaps out a class named ",o.jsx(t.code,{children:"grtv-default-skin"})," on the TreeView for the one specified as the ",o.jsx(t.code,{children:"skin-class"}),". This ",o.jsx(t.em,{children:"completely removes"})," the default styling. To provide new styles, a new stylesheet was created based on the default styles (copied right from the browser). This gives complete control of the styling, allowing for easier usage of things like Font Awesome as seen here."]}),`
`,o.jsx("a",{target:"_blank",href:"assets_css/grayscale.css",children:"See the Stylesheet"}),`
`,o.jsx("br",{}),`
`,o.jsx("a",{target:"_blank",href:"assets_data/customizationViaSkinTreeViewData.js",children:"See the Model Data"}),`
`,o.jsx(E,{of:Oe}),`
`,o.jsx(t.h2,{id:"drag-and-drop",children:"Drag and Drop"}),`
`,o.jsxs(t.p,{children:["You can drag a node that has the ",o.jsx(t.code,{children:"draggable"})," property on the returned value for the node from ",o.jsx(t.code,{children:"modelDefaults"})," set to ",o.jsx(t.code,{children:"true"}),". Any node with ",o.jsx(t.code,{children:"allowDrop"})," set to ",o.jsx(t.code,{children:"true"})," can accept a drop from any TreeView."]}),`
`,o.jsx("a",{target:"_blank",href:"assets_data/dragDropTreeViewData.js",children:"See the Model Data"}),`
`,o.jsx(E,{of:Re}),`
`,o.jsx(t.h2,{id:"filtering",children:"Filtering"}),`
`,o.jsxs(t.p,{children:["You can provide a method by which data should be filtered. Any node for which the method returns ",o.jsx(t.code,{children:"true"})," or for which a subnode returns ",o.jsx(t.code,{children:"true"})," will be included in the visual tree."]}),`
`,o.jsx("a",{target:"_blank",href:"assets_data/filteringTreeViewData.js",children:"See the Model Data"}),`
`,o.jsx(E,{of:Pe}),`
`,o.jsx(t.h2,{id:"external-model-changes",children:"External Model Changes"}),`
`,o.jsx(t.p,{children:"The tree is bound to your data model and should react to updates (and update the model) as you would generally expect."}),`
`,o.jsx("a",{target:"_blank",href:"assets_data/externalDataChangesTreeViewData.js",children:"See the Model Data"}),`
`,o.jsx(E,{of:Le})]})}function $t(e={}){const{wrapper:t}={...kt(),...e.components};return t?o.jsx(t,{...e,children:o.jsx(Ct,{...e})}):Ct(e)}const qn=Object.freeze(Object.defineProperty({__proto__:null,default:$t},Symbol.toStringTag,{value:"Module"}));export{qn as E,Rn as T};
