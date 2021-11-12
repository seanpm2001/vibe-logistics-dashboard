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
      <h2 id="text"><span></span></h2>
    </section>
  </div>
</template>

<style lang="sass" scoped>
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
  justify-content: center
  align-items: center
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

section
  position: relative
  width: 100%
  min-height: 100vh
  display: flex
  justify-content: center
  align-items: center
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



</style>