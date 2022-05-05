<template>
  <div
    id="screenfull"
    class="pl-1 pr-1 mtPx-2"
  >
    <svg-icon
      v-if="isFullscreen"
      icon-name="exit-fullscreen"
      class="nav-svg-icon"
      @click="click"
    />
    <svg-icon
      v-else
      icon-name="fullscreen"
      class="nav-svg-icon"
      @click="click"
    />
  </div>
</template>

<script lang="ts" setup>
import screenfull from 'screenfull';
import { ElMessage } from 'element-plus';

const isFullscreen = ref(false);

onMounted(() => {
  init();
});
onUnmounted(() => {
  destroy();
});

const click = () => {
  if (!screenfull.isEnabled) {
    ElMessage({
      message: 'you browser can not work',
      type: 'warning'
    });
    return false;
  }
  screenfull.toggle();
};
const change = () => {
  isFullscreen.value = screenfull.isFullscreen;
};
const init = () => {
  if (screenfull.isEnabled) {
    screenfull.on('change', change);
  }
};
const destroy = () => {
  if (screenfull.isEnabled) {
    screenfull.off('change', change);
  }
};
</script>

<style lang="sass" scoped>
.nav-svg-icon
  cursor: pointer
  font-size: 18px
  color: #5a5e66
  margin-top: 4px
</style>
