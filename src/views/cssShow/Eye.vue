<template>
  <div ref="eyeContainer" class="eye-container" @mousemove="eyeBall">
    <div class="eye-box">
      <div ref="leftEye" class="eye"></div>
      <div ref="rightEye" class="eye"></div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, computed } from 'vue';
const { proxy } = getCurrentInstance();
const refs = computed(() => proxy.$refs);

function setEyePosition(el) {
  const x = (el.getBoundingClientRect().left) + (el.clientWidth / 2);
  const y = (el.getBoundingClientRect().top) + (el.clientWidth / 2);

  const radian = Math.atan2(event.pageX - x, event.pageY - y);
  const rotation = (radian * (180 / Math.PI) * -1) + 270;
  el.style.transform = `rotate(${rotation}deg)`;
}



const eyeBall = () => {
  setEyePosition(refs.value.rightEye);
  setEyePosition(refs.value.leftEye);
};
</script>

<style lang="sass" scoped>
.eye-container
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  min-height: 100vh
  background: radial-gradient(#f2761e, #ef4921)

.eye-box
  display: flex
  .eye
    position: relative
    display: block
    width: 120px
    height: 120px
    margin: 0 20px
    background: #fff
    border-radius: 50%
    box-shadow: 0 5px 45px rgba(0, 0, 0, .2)
    &::before
      content: ''
      position: absolute
      top: 50%
      left: 35px
      transform: translate(-50%, -50%)
      width: 45px
      height: 45px
      border-radius: 50%
      background: #000
      border: 10px solid #2196f3
      box-sizing: border-box
</style>
