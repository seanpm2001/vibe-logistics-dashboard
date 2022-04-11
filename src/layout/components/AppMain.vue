<template>
  <section class="app-main">
    <router-view :key="key" v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script setup>
import { useTagStore } from '/@/stores';
const { cachedViews } = storeToRefs(useTagStore());
const route = useRoute();

const key = computed(() => route.path);
</script>

<style lang="sass" scoped>
.app-main
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px)
  width: 100%
  position: relative
  overflow: hidden


.fixed-header+.app-main
  padding-top: 50px

.hasTagsView
  .app-main
    /* 91 = navbar + tags-view = 50 + 41 */
    min-height: calc(100vh - 91px)

  .fixed-header+.app-main
    padding-top: 91px
</style>

<style lang="sass">
// fix css style bug in open el-dialog
.el-popup-parent--hidden
  .fixed-header
    padding-right: 15px
</style>
