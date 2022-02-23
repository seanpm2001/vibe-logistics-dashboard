<template>
  <div class="page">
    <img v-if="week===1" src="/@/assets/img/parallax/background.png">
    <img v-if="week===2" src="/@/assets/img/parallax/rock.png">
    <img v-if="week===3" src="/@/assets/img/parallax/earth.png">
    <img v-if="week===4" src="/@/assets/img/parallax/earth.png">
    <img v-if="week===5" src="/@/assets/img/parallax/rock.png">
    <img v-if="week===6" src="/@/assets/img/parallax/earth.png">
    <img v-if="week===7" src="/@/assets/img/parallax/rock.png">
  </div>
</template>

<script setup>
const week = new Date().getDay();
</script>

<style lang="sass" scoped>

</style>
