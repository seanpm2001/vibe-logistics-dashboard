<template>
  <div class="container">
    <header id="header">
      <a href="#" class="logo">Vibe</a>
      <ul>
        <li><a href="#" class="is-active">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Destination</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </header>
    <section>
      <h2 id="text"><span>It's time for a new</span><br>Adventure</h2>
      <img :src="bird1" id="bird1">
      <img :src="bird2" id="bird2">
      <img :src="forest" id="forest">
      <a href="#" id="btn">Explore</a>

      <img :src="rock" id="rock">
    </section>
    <div class="sec">
      <h2>Parallax Scrolling Effects</h2>
      <p>
        Parallax Scrolling EffectsParallax Scrolling EffectsParallax Scrolling EffectsParallax 
        Scrolling EffectsParallax Scrolling EffectsParallax Scrolling EffectsParallax Scrolling
       EffectsParallax Scrolling EffectsParallax Scrolling EffectsParallax Scrolling EffectsParallax
        Scrolling EffectsParallax Scrolling EffectsParallax Scrolling EffectsParallax Scrolling 
        EffectsParallax Scrolling EffectsParallax Scrolling EffectsParallax Scrolling EffectsParallax
         Scrolling EffectsParallax Scrolling EffectsParallax Scrolling EffectsParallax Scrolling 
         EffectsParallax Scrolling EffectsParallax Scrolling EffectsParallax Scrolling EffectsParallax Scrolling EffectsParallax Scrolling EffectsParallax Scrolling Effects
      </p>
    </div>
  </div>
</template>

<script setup>
import bird1 from "/@/assets/img/parallax/bird2.png";
import bird2 from "/@/assets/img/parallax/bird2.png";
import forest from "/@/assets/img/parallax/forest.png";
import rocks from "/@/assets/img/parallax/rock.png";
</script>

<style lang="sass">
.container
  width: 100%
  min-height: 100%
  background: #fff
  box-sizing: border-box
  font-family: 'Poppins', sans-serif
  overflow-x: hidden

#header
  position: absolute
  top: 0
  left: 0
  width: 100%
  padding: 30px 100px
  display: flex
  justify-content: space-around
  align-items: center
  z-index: 999
  .logo
    color: #094b65
    font-weight: 700
    font-size: 2em
    text-decoration: none
  ul
    display: flex
    justify-content: center
    align-items: center
    li
      list-style: none
      margin-left: 20px
      a
        text-decoration: none
        padding: 6px 15px
        color: #094b65
        border-radius: 20px
        &.is-active, &:hover
          background: #094b65
          color: #fff
section
  position: relative
  width: 100%
  min-height: 100vh
  display: flex
  justify-content: center
  align-items: center
  &::before
    content: ''
    position: absolute
    bottom: 0
    left: 0
    width: 100%
    height: 100px
    background: linear-gradient(to top, #f00, transparent)
    z-index: 10
  img
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    object-fit: cover

  #text
    position: absolute
    color: #094b65
    font-size: 10vw
    text-align: center
    line-height: .55em
    span
      font-size: .2em
      letter-spacing: 2px
      font-weight: 400       
      font-family: 'Poppins', sans-serif
  #btn
    text-decoration: none
    display: inline-block
    padding: 8px 30px
    color: #094b65
    font-size: 1.2em
    font-weight: 500
    letter-spacing: 2px
    background: #fff
    border-radius: 40px
    transform: translateY(100px)
.sec
  position: relative
  padding: 100px
  background: #094b65
  h2
    font-size: 3.5em
    color: #fff
    margin-bottom: 10px
  p
    font-size: 1em

</style>