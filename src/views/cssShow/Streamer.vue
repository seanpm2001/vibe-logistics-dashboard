<template>
  <div class="streamer-container">
    <div ref='sec' class="sec" @click="toggleBgColor">
      <video autoplay muted loop>
        <source src="/@/assets/video/run.mp4">
      </video>
      <h2>Run</h2>
    </div>
  </div>
</template>

<script setup>

import throttle from "lodash/throttle";
const { proxy } = getCurrentInstance();
const refs = computed(() => proxy.$refs);

const toggleBgColor = () => {
  refs.value.sec.classList.toggle('is-active');
  const video = document.querySelector('video');
  video.muted && (video.muted = false);
};
</script>

<style lang="sass" scoped>
.streamer-container
  width: 100vw
  height: 100vh
  box-sizing: border-box
  font-family: 'Poppins', sans-serif
  cursor: pointer

.sec
  position: absolute
  width: 100%
  height: 100%
  overflow: hidden
  display: flex
  justify-content: center
  align-items: center
  background: #f00
  .dot
    position: absolute
    width: 40px
    height: 40px
    background: #fff
    border-radius: 50%
    transform: translate(-50%, -50%)
    cursor: default
    transition: box-shadow .5s
    &::before
      content: 'Light Mode'
      position: absolute
      top: 50%
      left: 50px
    &:active
      box-shadow: 0 0 0 200vh #fff
      border: 2px solid #000
    &.is-active
      background: #000
      border: 2px solid #000
      &:active
        box-shadow: 0 0 0 200vh #fff
        border: 2px solid #fff
    &.is-active::before
      content: 'Dark Mode'
      color: #000

  &.is-active  h2
    color: #000
    background: #fff
    mix-blend-mode: screen
  video
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    object-fit: cover
  h2
    position: absolute
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    font-size: 40vw
    color: #fff
    background: #000
    user-select: none
    font-weight: 800
    text-transform: uppercase
    text-align: center
    mix-blend-mode: multiply
</style>
