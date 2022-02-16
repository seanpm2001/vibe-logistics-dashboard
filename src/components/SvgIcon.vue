<template>
  <svg :class="svgClass" aria-hidden="true">
    <use width=100% height=100% :href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  iconName: {
    type: String,
    required: true,
  },
  iconClass: {
    type: String,
  },
  alt: {
    type: String,
  },
  color: {
    type: String,
    default: '#333',
  },
}); 

const symbolId = computed(() => `#${props.prefix}-${props.iconName}`);
const svgClass = computed(() => {
  if (props.iconClass) {
    return 'svg-icon ' + props.iconClass;
  } else {
    return 'svg-icon';
  }
});
</script>

<style lang="sass" scoped>
.svg-icon
  width: 16px
  height: 16px
  vertical-align: -3px
  fill: currentColor
  overflow: hidden

svg
  &.is-current
    fill: currentColor
    fill-rule: evenodd
  &.is-red
    fill: #ff6666
  &.is-grey
    fill: #000
</style>
