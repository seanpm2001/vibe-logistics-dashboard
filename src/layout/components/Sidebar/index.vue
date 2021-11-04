<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="$style.menuBg"
        :text-color="$style.menuText"
        :unique-opened="false"
        :active-text-color="$style.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Logo from './Logo.vue';
import SidebarItem from './SidebarItem.vue';
import { useRoute } from 'vue-router';
import { ElMenu, ElScrollbar } from 'element-plus';
import { useGetters } from '/@/assets/utils/vuex-helper';
const route = useRoute();
const store = useStore();
const permission_routes = store.getters['permission_routes'];
console.log('permission_routes: ', permission_routes);
const sidebar = store.getters['sidebar'];

const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});

// Todo 
const showLogo = computed (() => {
  return true; // 暂时写死
});
// Todo 
const isCollapse = computed (() => {
  return false; // 暂时写死
});

</script>

<style module lang="sass">
@import "/@/assets/css/_variables.sass"
</style>
