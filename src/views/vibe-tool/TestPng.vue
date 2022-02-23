<template>
  <div class="page">
    <img :src="src">
  </div>
</template>

<script setup>
const week = new Date().getDay();
console.log('week: ', week);

const src = computed(() => {
  switch(week) {
  case 1: return '/@/assets/img/parallax/background.png';
  case 2: return '/@/assets/img/parallax/facebook.png';
  case 3: return '/@/assets/img/parallax/earth.png';
  case 4: return '/@/assets/img/parallax/rock.png';
  case 5: return '/@/assets/img/parallax/mid.png';
  case 6: return '/@/assets/img/parallax/earth.png';
  case 7: return '/@/assets/img/parallax/rock.png';
  }
});
</script>

<style lang="sass" scoped>

</style>
