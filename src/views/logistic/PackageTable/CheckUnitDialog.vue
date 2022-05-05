<template>
  <el-dialog
    v-model="dialogCheckUnitVisible"
    width="50%"
    title="Check Unit"
    :close-on-click-modal="false"
  >
    <el-row>
      <el-button>check</el-button>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
/* Start Data*/
const dialogCheckUnitVisible = inject('dialogCheckUnitVisible');

/* End Data*/

</script>

<style lang="sass" scoped>

</style>
