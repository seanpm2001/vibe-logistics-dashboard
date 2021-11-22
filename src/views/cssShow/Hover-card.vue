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
    <div class="card2">
      <div class="circle">
        <h2>04</h2>
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

<script setup>
import buddha1 from "/@/assets/img/css-show/buddha1.jpeg";
import buddha2 from "/@/assets/img/css-show/buddha2.jpeg";
</script>

<style lang="sass" scoped>
.page
  width: 100%
  height: 100%
  padding-bottom: 20px
  background: #fff

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
  transition: 1s
  .circle, .content a
    background: #000
  .circle
    position: absolute
    top: 0
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
    transition: 1s transform
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
</style>