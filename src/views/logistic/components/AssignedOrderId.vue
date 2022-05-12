<template>
  <el-tag v-if="order?.id">
    <a
      v-if="!order.rawOrders && order.shopifyId"
      :href="`https://vibeus.myshopify.com/admin/orders/${order.shopifyId}`"
      target="_blank"
    >
      #{{ order.id }}
    </a>
    <span
      v-else
      @click="showOrderDrawer(order)"
    >
      #{{ order.id }}
    </span>
  </el-tag>
  <div v-if="order?.rawOrders">
    <template
      v-for="item in order.rawOrders"
      :key="item.id"
    >
      <el-tag>
        <a
          v-if="item.shopifyId"
          :href="`https://vibeus.myshopify.com/admin/orders/${item.shopifyId}`"
          target="_blank"
        >
          #{{ item.id }}
        </a>
        <span
          v-else
          @click="showOrderDrawer(item)"
        >
          #{{ item.id }}
        </span>
      </el-tag>
      <br>
    </template>
  </div>
</template>

<script setup>
defineProps({
  order: {
    type: Object,
    default: () => {}
  }
});


const emit = defineEmits(['showOrderDrawer']);
const showOrderDrawer = () => emit('showOrderDrawer');
</script>

<style lang="sass" scoped>
.el-tag
  cursor: pointer
</style>
