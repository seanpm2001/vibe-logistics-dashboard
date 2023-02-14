<template>
  <div class="dashboard-container">
    <component :is="currentRole === 'ADMIN' ? AdminDashboard : EditorDashboard" />
    <Navgation />
    <SystemInfo />
  </div>
</template>

<script setup>
import AdminDashboard from './Admin.vue';
import EditorDashboard from './Editor.vue';
import Navgation from './components/Navgation.vue';
import SystemInfo from './components/SystemInfo/Index.vue';
import { useUserStore } from '@/store';

const userStore = useUserStore();
const { role: currentRole } = storeToRefs(useUserStore());
</script>

<style lang="sass" scoped>
.dashboard-container
  position: relative
  min-height: calc(100vh - 91px - 64px)
  padding: 32px
  background-color: rgb(240, 242, 245)
</style>
