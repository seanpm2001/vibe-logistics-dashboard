<template>
  <div @click="addTags">
    <span v-if="icon">
      <i v-if="icon.includes('el-icon')" class={[icon, sub-el-icon]} />
      <svg-icon v-else :icon-name="icon" />
    </span>
    <span v-if="title">{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  functional: true,
};
</script>

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

const route = useRoute();
const store = useStore();
const visitedViews = computed(() => store.state.tagsView.visitedViews);

const addTags = () => {
  const { path } = route;

  if (path) {
    store.dispatch('tagsView/addView', route);
  }
  return false;
};


</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
