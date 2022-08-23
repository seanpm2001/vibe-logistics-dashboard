<template>
  <div class="page">
    <div class="nav">
      <div class="logo">
        Explore.
      </div>
      <div class="nav-links">
        <ul>
          <li>
            <img
              src="@img/parallax/linkedin.png"
              alt=""
            >
          </li>
          <li>
            <img
              src="@img/parallax/facebook.png"
              alt=""
            >
          </li>
          <li>
            <img
              src="@img/parallax/instagram-logo.png"
              alt=""
            >
          </li>
        </ul>
      </div>
    </div>

    <section
      id="sectionone"
      class="screen"
    >
      <div id="scene">
        <div
          data-depth="0.1"
          class="bg"
        >
          <img
            src="@img/parallax/background.png"
            alt=""
          >
        </div>
        <div
          data-depth="0.2"
          class="rock1"
        >
          <img
            src="@img/parallax/rock.png"
            alt=""
          >
        </div>
        <div
          data-depth="1.2"
          class="earth"
        >
          <img
            src="@img/parallax/earth.png"
            alt=""
          >
        </div>
        <div
          data-depth="0.1"
          class="text"
        >
          <h1>PLANETS</h1>
        </div>
        <div
          data-depth="0.4"
          class="mid"
        >
          <img
            src="@img/parallax/mid.png"
            alt=""
          >
        </div>
        <div
          data-depth="0.1"
          class="fore"
        >
          <img
            src="@img/parallax/foreground.png"
            alt=""
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>

import '@/assets/js/parallax.min';
onMounted(() => {
  // eslint-disable-next-line no-undef
  const parallaxInstance = new Parallax(document.getElementById('scene'));
});
</script>

<style lang="sass" scoped>
.page
  margin: 0
  padding: 0
  overflow-x: hidden
  font-family: "Roboto"
  list-style: none
  box-sizing: border-box
  background: #000

.nav
  position: fixed
  z-index: 100
  height: 8vh
  width: 96%
  display: flex
  justify-content: space-between
  align-items: center
  padding: 10px 30px

.logo
  color: #fff
  font-weight: 600
  font-size: 16px


.nav .nav-links ul
  display: flex
  flex-direction: row

.nav .nav-links ul li
  padding: 0 4px
  list-style: none


.nav .nav-links ul li img
  transform: scale(0.45)


section
  height: 100vh
  overflow: hidden


.bg img
  width: 110vw
  height: 110vh
  filter: brightness(0.6)


.rock1
  position: absolute !important
  left: 10vw !important
  top: 20vh !important


.rock1 img
  width: 40%
  filter: brightness(0.5)


.text h1
  font-family: "AlphaCentauri" !important
  font-size: 5vw
  color: #fff
  letter-spacing: 20px
  position: absolute
  top: 35vh
  left: 34vw


.earth img
  width: 400px
  height: 400px
  position: absolute
  left: 35vw
  top: 17vh
  z-index: 1
  filter: brightness(0.7)


.mid
  left: -150px !important
  bottom: -100px !important
  top: unset !important


.mid img
  width: 100%
  z-index: 2
  left: -20px
  top: 20vh !important
  filter: brightness(0.8)


.fore
  right: -50px !important
  bottom: -200px !important
  top: 0px !important
  left: unset !important


.fore img
  width: 400px
  height: 110vh
  z-index: 3
  filter: brightness(0.5)
</style>
