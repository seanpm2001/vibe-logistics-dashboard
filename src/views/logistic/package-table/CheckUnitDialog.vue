<template>
  <el-dialog
    width="50%"
    title="Check Unit"
    v-model="dialogCheckUnitVisible"
    :close-on-click-modal="false"
  >
    <el-row>
      <el-button>check</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup>
/* Start Data*/
const dialogCheckUnitVisible = inject('dialogCheckUnitVisible');

/* End Data*/

</script>

<style lang="sass" scoped>

</style>
