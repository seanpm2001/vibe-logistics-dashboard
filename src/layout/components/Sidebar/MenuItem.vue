<template>
  <div class="f-row col-center">
    <svg-icon :icon-name="meta?.icon" />
    <span v-if="meta?.title && !isCollapse">{{ meta?.title }}</span>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-undef
const props = defineProps({
  meta: {
    type: Object,
    default: null
  },
  isCollapse: {
    type: Boolean,
    default: false
  }
});
</script>

<style lang="sass" scoped>
.sub-el-icon
  color: currentColor
  width: 16px
  height: 16px

</style>
