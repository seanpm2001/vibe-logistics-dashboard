<template>
  <div
    id="Sidebar"
    class="reset-menu-style"
  >
    <!--router nav-->
    <el-scrollbar>
      <el-menu
        class="el-menu-vertical"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="$style.menuBg"
        :text-color="$style.menuText"
        :unique-opened="false"
        :active-text-color="$style.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <SubMenu
          v-for="routeItem in routes"
          :key="routeItem.path"
          :router-item="routeItem"
          :base-path="routeItem.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import SubMenu from './SubMenu.vue';
import { useAppStore, usePermissionStore } from '@/store';

const appStore = useAppStore();

const route = useRoute();
const permissionStore = usePermissionStore();
const routes = computed(() => {
  return permissionStore.routes;
});
const isCollapse = computed(() => {
  return !appStore.sidebar.opened;
});

const activeMenu = computed(() => {
  const { meta, fullPath } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return fullPath;
});
</script>

<style module lang="sass">
@import "@css/_variables"
.el-menu-vertical
  width: $sideBarWidth
</style>

<style lang="sass">
@import "@css/_variables"
.reset-menu-style
  .el-menu
    border-right: none
  
  .el-scrollbar__wrap
    padding-bottom: 10vh

  .el-scrollbar__view
    height: 100%
    .el-menu
      height: 100%

  .el-menu-item
    &:hover, &.is-active
      background-color: $menuHover !important
    &.is-active > .el-submenu__title
      color: $subMenuActiveText !important
</style>
