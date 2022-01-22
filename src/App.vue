<template>
  <router-view name="backBtn"></router-view>
  <router-view v-slot="{ Component }">
    <transition name="slide-fade">
      <keep-alive>
        <component class="page-transition-view" :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup>
// import { listWarehousesAPI } from "/@/server/api/logistic";
// import { useStore } from 'vuex';

// const store = useStore();

// 初始化2个以上物流页面都需要的enum/固定的数据
// const init = () => {
//   if (store.getters.token && JSON.stringify(store.getters.warehouseEnum) === '{}')
//     store.dispatch('logistic/setWarehouseEnum');
// };
// init();
</script>

<style lang="sass">
@import "./assets/css/main.sass"
</style>
