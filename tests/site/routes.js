import { createRouter, createWebHistory } from "vue-router";
import CheckboxesDemo from "./CheckboxesDemo.vue";
import RadiobuttonsDemo from "./RadiobuttonsDemo.vue";
import SlotsDemo from "./SlotsDemo.vue";
import AddRemoveDemo from "./AddRemoveDemo.vue";
import SelectionDemo from "./SelectionDemo.vue";
import AsyncDemo from "./AsyncDemo.vue";
import DragDropDemo from "./DragDropDemo.vue";

const routes = [
  {
    path: "/",
    component: CheckboxesDemo,
  },
  {
    path: "/radio",
    component: RadiobuttonsDemo,
  },
  {
    path: "/slots",
    component: SlotsDemo,
  },
  {
    path: "/addremove",
    component: AddRemoveDemo,
  },
  {
    path: "/selection",
    component: SelectionDemo,
  },
  {
    path: "/async",
    component: AsyncDemo,
  },
  {
    path: "/dragdrop",
    component: DragDropDemo,
  }
];

export const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(),
  routes,
});