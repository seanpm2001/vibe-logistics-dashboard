<template>
  <div :class="classObj" class="app-wrapper">
    <div class="sidebar-container">
      <sidebarComponent />
    </div>
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{'fixed-header': fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script setup>
import { AppMain, Navbar, SidebarComponent, TagsView } from './components/index';
import { useAppStore, useSettingStore } from '/@/stores';

const { sidebar, device} = storeToRefs(useAppStore());
const { tagsView: needTagsView, fixedHeader: fixedHeader } = storeToRefs(useSettingStore());

const classObj = computed(() => {
  return {
    hideSidebar: !sidebar.value.opened,
    openSidebar: sidebar.value.opened,
    withoutAnimation: sidebar.value.withoutAnimation,
    mobile: device === 'mobile'
  };
});

</script>

<style lang="sass">
@import "/@css/_mixin.sass"
@import "/@css/_variables.sass"
@import '/@css/sidebar.sass'
.app-wrapper
  @include clearfix
  position: relative
  height: 100%
  width: 100%
  &.mobile.openSidebar
    position: fixed
    top: 0

.drawer-bg
  background: #000
  opacity: 0.3
  width: 100%
  top: 0
  height: 100%
  position: absolute
  z-index: 999

.fixed-header
  position: fixed
  top: 0
  right: 0
  z-index: 9
  width: calc(100% - #{$sideBarWidth})
  transition: width 0.28s

.hideSidebar .fixed-header
  width: calc(100% - 54px)

.mobile .fixed-header
  width: 100%
</style>
