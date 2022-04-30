<template>
  <div
    style="padding: 0 12px"
    @click="toggleClick"
  >
    <svg-icon
      icon-name="hamburger"
      :class="{ 'is-active': isActive }"
      class="hamburger"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggleClick']);
const toggleClick = () => {
  emit('toggleClick');
};
</script>

<style lang="sass" scoped>
.hamburger
  display: inline-block
  vertical-align: middle
  width: 20px
  height: 20px

.hamburger.is-active
  transform: rotate(180deg)
</style>
