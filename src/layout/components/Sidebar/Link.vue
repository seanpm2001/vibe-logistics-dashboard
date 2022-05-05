<template>
  <component
    :is="type"
    v-bind="linkProps(to)"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { isExternal } from '@/utils';
const props = defineProps({
  to: {
    type: String,
    required: true
  }
});

const isExternalValid = computed(() => {
  return isExternal(props.to);
});
const type = computed(() => {
  if (isExternalValid.value) {
    return 'a';
  }
  return 'router-link';
});
const linkProps = (to) => {
  if (isExternalValid.value) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener'
    };
  }
  return {
    to: to
  };
};
const state = reactive({
  levelList: null
});
onMounted(() => {
  // console.log(state.levelList)
  // console.log(props.to)
});
</script>

<style scoped lang="scss"></style>
