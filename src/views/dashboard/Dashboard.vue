<template>
  <div class="dashboard-container">
    <component :is="currentRole === 'admin' ? AdminDashboard : EditorDashboard" />
  </div>
</template>

<script setup>
import AdminDashboard from './admin/Admin.vue';
import EditorDashboard from './Editor.vue';

const store = useStore();
const currentRole = ref('admin');
const roles = computed(() => store.getters['roles']);

if (!roles.value.includes('admin')) {
  currentRole.value = 'editor';
}

</script>
