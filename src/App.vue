<template>
  <router-view name="backBtn"></router-view>
  <router-view v-slot="{ Component }">
    <transition name="slide-fade">
      <keep-alive>
        <component class="page-transition-view" :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup>

</script>

<style lang="sass">
@import "./assets/css/main.sass"
</style>
