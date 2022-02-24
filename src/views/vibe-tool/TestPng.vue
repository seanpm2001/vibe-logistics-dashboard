<template>
  <img v-if="week===1" src="/@/assets/img/parallax/background.png">
  <img v-else-if="week===2" src="/@/assets/img/parallax/rock.png">
  <img v-else-if="week===3" src="/@/assets/img/parallax/earth.png">
  <img v-else-if="week===4" src="/@/assets/img/parallax/earth.png">
  <img v-else-if="week===5" src="/@/assets/img/parallax/rock.png">
  <img v-else-if="week===6" src="/@/assets/img/parallax/earth.png">
  <img v-else-if="week===7" src="/@/assets/img/parallax/rock.png">
</template>

<script setup>
const week = new Date().getDay();
</script>

<style lang="sass" scoped>

</style>
