<template>
  <div class="btn back-btn" @click="routeGoBack">
    <svg-icon icon-name="back" /> Back
  </div>
</template>

<script setup>

const router = useRouter();

const routeGoBack = () => {
  router.go(-1);
};
</script>

<style lang="sass" scoped>
.btn.back-btn
  position: fixed
  z-index: 999
  top: 1rem
  left: 1rem
  height: 2.5rem
  padding: 1px 24px 1px 20px
  color: #fff
  background: #6cc
  cursor: pointer
  &:hover
    background: linear-gradient(48.57deg,#4b50fa 14.43%,#ff5151 101.78%)
  .svg-icon
    width: 16px
    height: 16px
    margin-right: .25rem
</style>
