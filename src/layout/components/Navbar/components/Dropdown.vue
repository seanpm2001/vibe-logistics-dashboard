<template>
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
</template>

<script setup>
import { useUserStore, useAppStore } from '@/store';
import avatarUrl from '@img/common/avatar.gif';

const userStore = useUserStore();

const router = useRouter();

const logout = async () => {
  await userStore.logout();
  router.push(`/login?redirect=${route.fullPath}`);
};
</script>

<style lang="sass" scoped>
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
