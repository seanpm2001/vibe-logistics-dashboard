<template>
  <div class="navbar">
    <div class="f-row col-center">
      <Hamburger
        :is-active="opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <Breadcrumb
        id="breadcrumb-container"
        class="breadcrumb-container"
      />
    </div>

    <div class="right-menu">
      <ScreenFull />
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="hover"
      >
        <div class="avatar-wrapper">
          <img
            :src="`${avatarUrl}?imageView2/1/w/80/h/80`"
            class="user-avatar"
          >
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>Dashboard</el-dropdown-item>
            </router-link>
            <a
              target="_blank"
              href="https://github.com/vibeus/vibe-logistics-dashboard"
            >
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a
              target="_blank"
              href="https://panjiachen.github.io/vue-element-admin-site/#/"
            >
              <el-dropdown-item>Docs</el-dropdown-item>
            </a>
            <el-dropdown-item
              divided
              @click="logout"
            >
              <span style="display:block;">Log Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Breadcrumb, Hamburger, ScreenFull} from './components';
import avatarUrl from '@img/common/avatar.gif';
import { useUserStore, useAppStore } from '@/store';

const appStore = useAppStore();
const userStore = useUserStore();

const opened = computed(() => {
  return appStore.sidebar.opened;
});
const toggleSideBar = () => {
  appStore.M_toggleSideBar();
};

const route = useRoute();
const router = useRouter();

const logout = async () => {
  await userStore.logout();
  router.push(`/login?redirect=${route.fullPath}`);
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
  .errLog-container
    display: inline-block
    vertical-align: top
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

    .avatar-container
      .avatar-wrapper
        margin-top: 5px
        position: relative
        .user-avatar
          cursor: pointer
          width: 40px
          height: 40px
          border-radius: 10px
        .el-icon-caret-bottom
          cursor: pointer
          position: absolute
          right: -20px
          top: 25px
          font-size: 12px
</style>
