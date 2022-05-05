<template>
  <div class="navbar">
    <div class="f-row col-center">
      <Hamburger
        :is-active="opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <Breadcrumb
        class="breadcrumb-container"
      />
    </div>

    <div class="right-menu">
      <ScreenFull />
      <Dropdown />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Breadcrumb, Dropdown, Hamburger, ScreenFull} from './components';
import { useAppStore } from '@/store';

const appStore = useAppStore();

const opened = computed(() => {
  return appStore.sidebar.opened;
});
const toggleSideBar = () => {
  appStore.M_toggleSideBar();
};

</script>

<style lang="sass">
.navbar
  overflow: hidden
  position: relative
  display: flex
  justify-content: space-between
  height: 50px
  background: #fff
  box-shadow: 0 1px 4px rgba(0,21,41,.08)
  .hamburger-container
    cursor: pointer
  .right-menu
    display: flex
    height: 100%
    line-height: 50px
    &:focus
      outline: none
    .right-menu-item
      display: inline-block
      height: 100%
      margin-left: 16px
      padding: 0 8px
      font-size: 18px
      color: #5a5e66
      vertical-align: text-bottom
      &.hover-effect
        cursor: pointer
        transition: background .3s
        &:hover 
          background: rgba(0, 0, 0, .025)
</style>
