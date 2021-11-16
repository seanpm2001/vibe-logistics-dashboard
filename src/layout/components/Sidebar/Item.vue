<template>
  <div>
    <span v-if="icon">
      <i v-if="icon.includes('el-icon')" class={[icon, sub-el-icon]} />
      <svg-icon v-else :icon-name="icon" />
    </span>
    <span v-if="title">{{ title }}</span>
  </div>
</template>

<script setup>
import { computed, defineComponent, ref } from 'vue';
import { useRoute } from "vue-router";
import { useStore } from "vuex";

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

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
