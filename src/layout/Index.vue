<template>
  <div
    :class="classObj"
    class="layout-wrapper"
  >
    <!--left side-->
    <Sidebar
      v-if="settings.showLeftMenu"
      class="sidebar-container"
    />
    <!--right container-->
    <div class="main-container">
      <Navbar v-if="settings.showTopNavbar" />
      <TagsView v-if="settings.showTagsView" />
      <AppMain />
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store';
import { Sidebar, Navbar, AppMain, TagsView } from './components';

const appStore = useAppStore();
const opened = computed(() => {
  return appStore.sidebar.opened;
});

const settings = computed(() => {
  return appStore.settings;
});
const classObj = computed(() => {
  return {
    closeSidebar: !opened.value,
    hideSidebar: !settings.value.showLeftMenu
  };
});
</script>

<style lang="sass">
.main-container
  min-height: 100%
  transition: margin-left 0.28s
  margin-left: 210px
  position: relative

.sidebar-container
  transition: width 0.28s
  width: 210px !important
  background-color: rgb(51, 71, 91)
  height: 100%
  position: fixed
  font-size: 0
  top: 0
  bottom: 0
  left: 0
  z-index: 1001
  overflow: hidden

.el-menu
  .svg-icon
    margin-right: 16px
  &.el-menu--collapse .svg-icon
    margin-right: 0

.closeSidebar
  .sidebar-container
    width: 54px !important
  .main-container
    margin-left: 54px !important
  
.hideSidebar
  .sidebar-container
    width: 0 !important
  .main-container
    margin-left: 0
</style>
