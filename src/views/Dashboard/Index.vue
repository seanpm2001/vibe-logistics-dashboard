<template>
  <div class="dashboard-container">
    <component :is="currentRole === 'ADMIN' ? AdminDashboard : EditorDashboard" />
  </div>
</template>

<script lang="ts" setup>
import AdminDashboard from './Admin/Index.vue';
import EditorDashboard from './Editor.vue';
import { useUserStore } from '@/store';

const userStore = useUserStore();
console.log('userStore: ', userStore);
const { role: currentRole } = storeToRefs(useUserStore());
console.log('currentRole: ', currentRole);
</script>
