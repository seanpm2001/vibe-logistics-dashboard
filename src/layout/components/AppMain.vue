<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const cachedViews = computed(() => store.state.tagsView.cachedViews);
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
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px)

  .fixed-header+.app-main
    padding-top: 84px
</style>

<style lang="sass">
// fix css style bug in open el-dialog
.el-popup-parent--hidden
  .fixed-header
    padding-right: 15px
</style>
