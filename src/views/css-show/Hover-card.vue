<template>
  <div class="page">
    <div class="container">
      <div class="card">
        <div class="circle">
          <h2>01</h2>
        </div>
        <div class="content">
          <p>
            With Vibe’s interactive smart boards and collaboration software, teams can innovate, ideate, and collaborate in real-time from anywhere in the world.
          </p>
          <a href="/#/hover-card">Learn More</a>
        </div>
      </div>
      <div class="card">
        <div class="circle">
          <h2>02</h2>
        </div>
        <div class="content">
          <p>
            With Vibe’s interactive smart boards and collaboration software, teams can innovate, ideate, and collaborate in real-time from anywhere in the world.
          </p>
          <a href="/#/hover-card">Learn More</a>
        </div>
      </div>
      <div class="card">
        <div class="circle">
          <h2>03</h2>
        </div>
        <div class="content">
          <p>
            With Vibe’s interactive smart boards and collaboration software, teams can innovate, ideate, and collaborate in real-time from anywhere in the world.
          </p>
          <a href="/#/hover-card">Learn More</a>
        </div>
      </div>
    </div>
    <div class="f-row row-center">
      <div class="card3">
        <div class="content">
          <h2>04</h2>
          <h3>Card Four</h3>
          <p>
            With Vibe’s interactive smart boards and collaboration software, teams can innovate, ideate, and collaborate in real-time from anywhere in the world.
          </p>
          <a href="/#/hover-card">Learn More</a>
        </div>
      </div>
      <div class="card3">
        <div class="content">
          <h2>05</h2>
          <h3>Card Six</h3>
          <p>
            With Vibe’s interactive smart boards and collaboration software, teams can innovate, ideate, and collaborate in real-time from anywhere in the world.
          </p>
          <a href="/#/hover-card">Learn More</a>
        </div>
      </div>
    </div>
    <div class="card2">
      <div class="circle">
        <h2>06</h2>
      </div>
      <div class="imgBox">
        <img :src="buddha1">
        <img :src="buddha2">
      </div>
      <div class="content">
        <p>
          With Vibe’s interactive smart boards and collaboration software, teams can innovate, ideate, and collaborate in real-time from anywhere in the world.
        </p>
        <a href="/#/hover-card">Learn More</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import buddha1 from '@img/css-show/buddha1.jpeg';
import buddha2 from '@img/css-show/buddha2.jpeg';
import '@/assets/js/vanilla-tilt.min';
onMounted(() => {
  const card3 = document.querySelectorAll('.card3');
  // eslint-disable-next-line no-undef
  VanillaTilt.init(card3);
  // eslint-disable-next-line no-undef
  // card3.addEventListener("tiltChange", callback);
});
</script>

<style lang="sass" scoped>
.page
  width: 100%
  height: 100%
  padding-bottom: 20px
  background: #161623
  
.container
  position: relative
  display: flex
  justify-content: center
  align-items: center
  flex-wrap: wrap
  max-width: 1150px
  padding: 20px
  margin: 0 auto
  &:hover .card
    filter: blur(20px)
    transform: scale(.9)
    opacity: .5
  & .card:hover
    filter: blur(0px)
    transform: scale(1.1)
    opacity: 1

.card
  position: relative
  width: 300px
  height: 420px
  margin: 20px
  background: #fff
  border-radius: 20px
  overflow: hidden
  box-shadow: 0 15px 25px rgba(0, 0, 0, .2)
  transition: .5s
  &:nth-child(1)
    .circle, .content a
      background: #ffaf00
  &:nth-child(2)
    .circle, .content a
      background: #da2268
  &:nth-child(3)
    .circle, .content a
      background: #bbff20  
  .circle
    position: relative
    width: 100%
    height: 100%
    background: #000
    clip-path: circle(180px at center 0)
    text-align: center
  h2
    padding: 30px 0
    color: #fff
    font-size: 4.5em
  .content
    position: absolute
    bottom: 10px
    padding: 20px
    text-align: center
    p
      font-family: sans-serif
      font-size: 16px
      color: #666
.content a
  position: relative
  display: inline-block
  margin-top: 20px
  padding: 10px 20px
  text-text-decoration: none
  color: #fff
  background: #000
  border-radius: 40px
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
  user-select: none
  
.card2
  position: relative
  width: 300px
  height: 420px
  margin: 20px auto
  background: #fff
  box-shadow: 0 15px 25px rgba(0, 0, 0, .2)
  transform-style: preserve-3d
  transition: .7s
  .circle, .content a
    background: blue
  .circle
    position: absolute
    top: 0
    width: 100%
    height: 100%
    background: blue
    clip-path: circle(180px at center 0)
    text-align: center
  h2
    padding: 30px 0
    color: #fff
    font-size: 4.5em
  .content
    position: absolute
    bottom: 10px
    padding: 20px
    text-align: center
    p
      font-family: sans-serif
      font-size: 16px
      color: #666
  &:hover
    transform: translateX(50%)
  &:hover .imgBox
    transform: rotateY(-180deg) translateZ(1px)
  .imgBox
    position: relative
    width: 100%
    height: 100%
    z-index: 1
    transform-origin: left
    transform-style: preserve-3d
    background: #000
    transition: 1.2s transform
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      object-fit: cover
      transform-style: preserve-3d
      -webkit-backface-visibility: hidden
      backface-visibility: hidden
    img:nth-child(2) 
      transform: rotateY(180deg) translateZ(1px)

.card3
  position: relative
  overflow: hidden
  display: flex
  justify-content: center
  align-items: center
  width: 280px
  height: 400px
  margin: 30px
  box-shadow: 20px 20px 50px rgba(0, 0, 0, .5)
  border-radius: 15px
  background: rgba(255, 255, 255, .1)
  border-top: 1px solid rgba(255, 255, 255, .5)
  border-left: 1px solid rgba(255, 255, 255, .5)
  backdrop-filter: blur(5px)
  &:hover .content
    transform: translateY(0)
    opacity: 1
  .content
    padding: 20px
    text-align: center
    transform: translateY(100px)
    opacity: 0
    transition: .5s
    h2
      position: absolute
      top: -100px
      right: 20px
      font-size: 8em
      color: rgba(255, 255, 255, .5)
      pointer-events: none
    h3
      font-size: 1.8em
      color: #fff
      z-index: 1
    p
      margin-top: 8px
      font-size: 1em
      color: #fff
      font-weight: 300
    a
      position: relative
      display: inline-block
      padding: 8px 20px
      margin-top: 15px
      background: #fff
      font-weight: 500
      color: #000
      text-decoration: none
      border-radius: 20px

</style>
