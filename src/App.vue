<template>
  <router-view name="backBtn" />
  <router-view v-slot="{ Component }">
    <transition name="slide-fade">
      <component
        :is="Component"
        class="page-transition-view"
      />
    </transition>
  </router-view>
</template>

<script setup>

</script>

<style lang="sass">
@import "./assets/css/main.sass"
</style>
