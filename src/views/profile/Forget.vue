<template>
  <div class="account">
    Forget password
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Forget",
});
</script>

<style scoped lang="sass">
.account
  width: 100vw
  height: 100vh
  background-color: #282828
  .form-wrap
    width: 300px
    margin: 0 auto
    padding-top: 100px
    color: #fff
    label
      display: block
      font-size: 14px
      color: #fff
</style>
