<template>
  <div v-if="ifExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon"/>
  <svg v-else :class="svgClass" aria-hidden="true">
    <use width=100% height=100% :href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>
import { isExternal } from '@/utils/validate';

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
const ifExternal = computed(() => {
  return isExternal(props.iconName);
});
const styleExternalIcon = computed(() => {
  return {
    mask: `url(${props.iconName}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${props.iconName}) no-repeat 50% 50%`
  };
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

.svg-external-icon
  background-color: currentColor
  mask-size: cover !important
  display: inline-block
</style>
