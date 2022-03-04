<template>
  <el-dialog
    width="90%"
    title="Warehousing Task"
    v-model="dialogHousingVisible"
    :close-on-click-modal="false"
    :before-close="beforeCloseDialog"
  >
    
  </el-dialog>
</template>

<script setup>

/* Start data */
const dialogHousingVisible = inject('dialogHousingVisible');

/* End data */
</script>

<style lang="sass" scoped>

</style>
