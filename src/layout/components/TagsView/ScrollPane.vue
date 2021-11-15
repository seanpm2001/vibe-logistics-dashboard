<template>
  <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container">
    <slot />
  </el-scrollbar>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, getCurrentInstance } from 'vue';
const tagAndTagSpacing = 4; // tagAndTagSpacing

const left = 0;
const { proxy } = getCurrentInstance();
const refs = computed(() => proxy.$refs);
const scrollWrapper = computed(() => refs.value.scrollContainer.$refs.wrap);


</script>

<style lang="sass" scoped>
.scroll-container
  white-space: nowrap
  position: relative
  overflow: hidden
  width: 100%
  :deep(.el-scrollbar__bar)
    bottom: 0px
  :deep(.el-scrollbar__wrap)
    height: 49px
</style>
