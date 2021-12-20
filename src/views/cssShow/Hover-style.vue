<template>
  <div class="page">
    <div class="wrap">
      <div class="icon">
        <div class="item one"></div>
        <span>视频服务</span>
      </div>
      <div class="icon">
        <div class="item two"></div>
        <span>数据安全</span>
      </div>
      <div class="icon">
        <div class="item three"></div>
        <span>互联数据</span>
      </div>
      <div class="icon">
        <div class="item four"></div>
        <span>开发运维</span>
      </div>
      <div class="icon">
        <div class="item five"></div>
        <span>万物联网</span>
      </div>
      <div class="icon">
        <div class="item six"></div>
        <span>弹性计算</span>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="sass" scoped>
.page
  width: 100%
  height: 100vh
  display: flex
  justify-content: center
  align-items: center

.wrap
  width: 50%
  height: 50%
  background: rgba(0, 0, 0, 0.2)
  border-radius: 20px
  display: grid
  grid-template-rows: 1fr 1fr
  grid-template-columns: 1fr 1fr 1fr
  justify-content: center
  align-items: center

.icon
  width: 100%
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
  cursor: pointer

.item
  width: 128px
  height: 128px

.one
  background: transparent url(/@/assets/img/css-show/1.png) 0 0 no-repeat

.two
  background: transparent url(/@/assets/img/css-show/2.png) 0 0 no-repeat

.three
  background: transparent url(/@/assets/img/css-show/3.png) 0 0 no-repeat

.four
  background: transparent url(/@/assets/img/css-show/4.png) 0 0 no-repeat

.five
  background: transparent url(/@/assets/img/css-show/5.png) 0 0 no-repeat


.six
  background: transparent url(/@/assets/img/css-show/6.png) 0 0 no-repeat

.icon span
  padding-top: 20px

.item:hover
  animation: icon 1.5s steps(21) infinite

@keyframes icon
  from
      background-position: 0 0
  to
      background-position: 0 -2688px

</style>
