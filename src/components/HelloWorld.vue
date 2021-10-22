<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      <a href="/login" rel="noopener">to login page</a>.
    </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
p
  font-weight: 500
</style>
