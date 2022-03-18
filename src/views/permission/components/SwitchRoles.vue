<template>
  <div>
    <div style="margin-bottom:15px;">
      Your roles: {{ role }}
    </div>
    Switch roles:
    <el-radio-group v-model="role" @change="switchRoles">
      <el-radio-button label="admin" />
      <el-radio-button label="manager" />
      <el-radio-button label="editor" />
      <el-radio-button label="visitor" />
    </el-radio-group>
  </div>
</template>

<script setup>

const store = useStore();
const { proxy } = getCurrentInstance();

const role = computed(() => store.getters['role']);

const switchRoles = val => {
  store.dispatch('user/changeRoles', val).then(() => {
    proxy.$emit('changeRoles');
  });
};
</script>
