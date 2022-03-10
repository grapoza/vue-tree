<template>
  <div class="page-container">
    <div class="side-menu">
      <router-link to="/">Checkboxes</router-link>
      <router-link to="/radio">Radiobuttons</router-link>
      <router-link to="/slots">Slots</router-link>
      <router-link to="/addremove">Add/Remove Nodes</router-link>
      <router-link to="/selection">Selection</router-link>
      <router-link to="/async">Async Loading</router-link>
      <router-link to="/dragdrop">Drag and Drop</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'App',
});
</script>

<style>
.page-container {
  display: grid;
  grid-template-columns: max-content 1fr;
}

.side-menu {
  background: #EEE;
  margin-right: 20px;
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>