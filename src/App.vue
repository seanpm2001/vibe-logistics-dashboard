<template>
  <router-view name="backBtn" />
  <router-view v-slot="{ Component }">
    <transition name="slide-fade">
      <keep-alive>
        <component
          :is="Component"
          class="page-transition-view"
        />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>

</script>

<style lang="sass">
@import "./assets/css/main.sass"
</style>
