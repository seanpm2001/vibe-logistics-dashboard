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
        <sidebar-item v-for="route in permissionRroutes" :key="route.path" :item="route" :base-path="route.path" />
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
const route = useRoute();
const store = useStore();
const permissionRroutes = computed(() => store.getters['permissionRroutes']);

const sidebar = computed(() => store.getters['sidebar']);

const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});

const showLogo = computed (() => store.state.setting.sidebarLogo);
const isCollapse = computed (() => !sidebar.value.opened);

</script>

<style module lang="sass">
@import "/@/assets/css/_variables.sass"
</style>
