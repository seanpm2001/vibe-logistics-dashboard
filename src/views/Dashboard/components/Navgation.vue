<template>
  <div
    class="dashboard-navgation"
  >
    <template
      v-for="route in logisticRoutes"
      :key="route.path"
    >
      <router-link
        class="link"
        :to="resolveLogisticPath(route.path)"
      >
        {{ route.meta.title }}
      </router-link>
    </template>
  </div>
</template>

<script setup>
import { logisticRouter } from '@/router/modules/logistic';

const logisticRouteBasePath = logisticRouter[0].path;
const logisticRoutes = logisticRouter[0].children;

const resolveLogisticPath = (routePath) => logisticRouteBasePath + '/' + routePath;
</script>

<style lang="sass">
.dashboard-navgation
  margin-top: 2rem
  .link
    color: #00e
    &:not(:last-child)
      padding-right: .5rem
      border-right: 1px solid #bfcbd9
    &:not(:first-child)
      padding-left: .5rem
    &:hover
      text-decoration: underline
</style>
