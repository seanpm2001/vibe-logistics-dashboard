<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script setup>
const tagAndTagSpacing = 4; // tagAndTagSpacing

const left = ref(0);
const { proxy } = getCurrentInstance();
const scrollWrapper = computed(() => proxy.$refs.scrollContainer.$refs.wrap$);

const handleScroll = (e) => {
  const eventDelta = e.wheelDelta || -e.deltaY * 40;
  const $scrollWrapper = scrollWrapper.value;
  $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
};

const emitScroll = () => {
  proxy.$emit('scroll');
};

const moveToTarget = (currentTag, tagList) => {
  const $container = proxy.$refs.scrollContainer.$el;
  const $containerWidth = $container.offsetWidth;
  const $scrollWrapper = scrollWrapper.value;

  let firstTag = null;
  let lastTag = null;

  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0];
    lastTag = tagList[tagList.length - 1];
  }

  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0;
  } else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
  } else {
    // find preTag and nextTag
    const currentIndex = tagList.findIndex((item) => item === currentTag);
    const prevTag = tagList[currentIndex - 1];
    const nextTag = tagList[currentIndex + 1];

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft =
      nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing;

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing;

    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
    }
  }
};

// eslint-disable-next-line no-undef
defineExpose({
  moveToTarget,
});

onMounted(() => {
  scrollWrapper.value.addEventListener('scroll', emitScroll, true);
});
</script>

<style lang="sass" scoped>
.scroll-container
  white-space: nowrap
  position: relative
  overflow: hidden
  width: 100%
  :deep(.el-scrollbar__bar)
    bottom: 0px
  :deep(.el-scrollbar__wrap)
    height: 49px
</style>
