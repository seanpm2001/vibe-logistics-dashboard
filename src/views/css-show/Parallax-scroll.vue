<template>
  <div class="page">
    <div class="image" style="background-image: url('https://cdn.jsdelivr.net/gh/leopold7/parallax-scrolling-demo@main/images/pic1.jpg')"></div>
    <div class="heading">
        <h1>When you are confused</h1>
    </div>
    <div class="text">
        <h1>Set goals in your mind</h1>
    </div>

    <div class="image" style="background-image: url('https://cdn.jsdelivr.net/gh/leopold7/parallax-scrolling-demo@main/images/pic2.jpg')"></div>
    <div class="heading">
        <h1>When you're down</h1>
    </div>
    <div class="text">
        <h1>Try to wake up the beast in your heart</h1>
    </div>

    <div class="image" style="background-image: url('https://cdn.jsdelivr.net/gh/leopold7/parallax-scrolling-demo@main/images/pic3.jpg')"></div>
    <div class="heading">
        <h1>When prople leave you</h1>
    </div>
    <div class="text">
        <h1>It's time to start your season</h1>
    </div>

    <div class="image" style="background-image: url('https://cdn.jsdelivr.net/gh/leopold7/parallax-scrolling-demo@main/images/pic4.jpg')"></div>
    <div class="heading">
        <h1>Come on,stranger.</h1>
    </div>
  </div>
</template>

<script setup>
// import onMounted  from "vue"
// import "/@/assets/js/jarallax"
// import "/@/assets/js/jarallax-element"

// onMounted(() => 
//   // eslint-disable-next-line no-undef
//   jarallax(document.getElementsByClassName('jarallax'), 
//     speed: 0.6
//   )
// )

</script>

<style lang="sass" scoped>
.page 
  height: 100vh
  overflow-x: hidden
  overflow-y: unset 
  perspective: 3px
 
.page div
  position: relative
  display: flex
  justify-content: center
  align-items: center
  font-style: 30px
  letter-spacing: 2px

.image
  transform: translateZ(-1px) scale(1.6)
  background-size: cover
  height: 100vh
  z-index: -1

.text
  height: 50vh
  background-color: #fff

.text h1
  color: #000

.heading
  z-index: -1
  transform: translateY(-30vh) translateZ(1px)
  color: #fff
  font-size: 30px

</style>
