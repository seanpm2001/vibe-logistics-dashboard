<template>
  <img v-if="week===1" src="/@img/parallax/background.png">
  <img v-else-if="week===2" src="/@img/parallax/rock.png">
  <img v-else-if="week===3" src="/@img/parallax/earth.png">
  <img v-else-if="week===4" src="/@img/parallax/earth.png">
  <img v-else-if="week===5" src="/@img/parallax/rock.png">
  <img v-else-if="week===6" src="/@img/parallax/earth.png">
  <img v-else-if="week===7" src="/@img/parallax/rock.png">
</template>

<script setup>
const week = new Date().getDay();
</script>

<style lang="sass" scoped>

</style>
