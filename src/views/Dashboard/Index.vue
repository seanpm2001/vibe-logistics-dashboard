<template>
  <div class="dashboard-container">
    <component :is="currentRole === 'ADMIN' ? AdminDashboard : EditorDashboard" />
  </div>
</template>

<script setup>
import AdminDashboard from './Admin.vue';
import EditorDashboard from './Editor.vue';
import { useUserStore } from '@/store';

const userStore = useUserStore();
const { role: currentRole } = storeToRefs(useUserStore());
</script>
