<template>
  <div class="f-row col-center">
    <span v-if="icon">
      <i v-if="icon.includes('el-icon')" class={[icon, sub-el-icon]} />
      <svg-icon v-else :icon-name="icon" />
    </span>
    <span v-if="title">{{ title }}</span>
  </div>
</template>

<script setup>


// eslint-disable-next-line no-undef
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
});
</script>

<style lang="sass" scoped>
.sub-el-icon
  color: currentColor
  width: 16px
  height: 16px

</style>
