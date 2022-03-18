<template>
  <div class="dashboard-container">
    <component :is="currentRole === 'ADMIN' ? AdminDashboard : EditorDashboard" />
  </div>
</template>

<script setup>
import AdminDashboard from './admin/Admin.vue';
import EditorDashboard from './Editor.vue';

const store = useStore();
const currentRole = ref('ADMIN');
const role = computed(() => store.getters['role']);

if (role.value !== 'ADMIN' ) {
  currentRole.value = 'EDITOR';
}

</script>
