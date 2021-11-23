<template>
  <div v-if="ifExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon"/>
  <svg v-else :class="svgClass" aria-hidden="true">
    <use width=100% height=100% :href="iconName" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { isExternal } from '/@/assets/utils/validate';

// eslint-disable-next-line no-undef
const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  iconClass: {
    type: String,
    default: ''
  }
});


const ifExternal = computed(() => {
  return isExternal(props.iconName);
});
const iconName = computed(() => `#icon-${props.iconName}`);

const svgClass = computed(() => {
  if (props.iconClass) {
    return 'svg-icon ' + props.iconClass;
  } else {
    return 'svg-icon';
  }
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

.svg-external-icon
  background-color: currentColor
  mask-size: cover !important
  display: inline-block
</style>
