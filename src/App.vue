<template>
  <router-view v-slot="{ Component }">
    <transition name="slide-fade">
      <component class="page-transition-view" :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
</script>

<style lang="sass">
@import "./assets/css/main.sass"
</style>
