<template>
  <div class="page">
    <section>
      <div class="box">
        <h2 data-jarallax-element="0 -200">Parallax Scrolling Demo One</h2>
        <div class="container">
          <div class="imgBx jarallax">
            <img class="jarallax-img" src="https://cdn.jsdelivr.net/gh/leopold7/parallax-scrolling-demo@main/images/pic1.jpg">
          </div>
          <div class="content" data-jarallax-element="-200 0">
            <p>With Vibe’s interactive smart boards and collaboration software, teams can innovate, ideate, and collaborate in real-time from anywhere in the world.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="box">
        <h2 data-jarallax-element="0 200">Parallax Scrolling Demo Two</h2>
        <div class="container">
          <div class="imgBx jarallax">
            <img class="jarallax-img" src="https://cdn.jsdelivr.net/gh/leopold7/parallax-scrolling-demo@main/images/pic2.jpg">
          </div>
          <div class="content" data-jarallax-element="-200 0">
            <p>With Vibe’s interactive smart boards and collaboration software, teams can innovate, ideate, and collaborate in real-time from anywhere in the world.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="box">
        <h2 data-jarallax-element="0 -200">Parallax Scrolling Demo Three</h2>
        <div class="container">
          <div class="imgBx jarallax">
            <img class="jarallax-img" src="https://cdn.jsdelivr.net/gh/leopold7/parallax-scrolling-demo@main/images/pic3.jpg">
          </div>
          <div class="content" data-jarallax-element="-200 0">
            <p>With Vibe’s interactive smart boards and collaboration software, teams can innovate, ideate, and collaborate in real-time from anywhere in the world.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="box">
        <h2 data-jarallax-element="0 200">Parallax Scrolling Demo Four</h2>
        <div class="container">
          <div class="imgBx jarallax">
            <img class="jarallax-img" src="https://cdn.jsdelivr.net/gh/leopold7/parallax-scrolling-demo@main/images/pic4.jpg">
          </div>
          <div class="content" data-jarallax-element="-200 0">
            <p>With Vibe’s interactive smart boards and collaboration software, teams can innovate, ideate, and collaborate in real-time from anywhere in the world.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import "/@/assets/js/jarallax";
import "/@/assets/js/jarallax-element";

onMounted(() => {
  // eslint-disable-next-line no-undef
  jarallax(document.getElementsByClassName('jarallax'), {
    speed: 0.6
  });
});

</script>

<style lang="sass" scoped>
.page 
  background: #111
  padding-bottom: 50px
  overflow-x: hidden
  box-sizing: border-box
  &:before
    content: 'Parallax'
    position: fixed
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    font-size: 16em
    font-weight: 700
    color: transparent
    -webkit-text-stroke: 1px #555

section
  position: relative
  display: flex
  justify-content: center
  align-items: center
  min-height: 100vh

section h2
  margin-left: 200px
  font-size: 4em
  color: #fff
  margin-bottom: 20px

section .container
  position: relative
  width: 1000px
  display: flex
  justify-content: space-between
  align-items: center

section:nth-child(even) .container
  flex-direction: row-reverse

section .container .imgBx
  position: relative
  width: 800px
  height: 400px
  overflow: hidden
  box-shadow: 0 25px 35px rgba(0, 0, 0, 0.1)

section .container .imgBx img
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  object-fit: cover

section .container .content
  position: absolute
  right: 0
  margin-top: 200px
  margin-bottom: 40px
  padding: 40px
  background: #333
  z-index: 1
  max-width: 400px
  color: #fff
  box-shadow: 0 25px 35px rgba(0, 0, 0, 0.1)
  border-bottom: 6px solid #4ac7ff

section:nth-child(even) .container .content
  left: 0

.jarallax
    position: relative
    z-index: 0

.jarallax > .jarallax-img
    position: absolute
    object-fit: cover
    /* support for plugin https://github.com/bfred-it/object-fit-images */
    font-family: 'object-fit: cover'
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: -1

</style>