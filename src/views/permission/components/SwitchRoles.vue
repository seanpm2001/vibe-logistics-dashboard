<template>
  <div>
    <div style="margin-bottom:15px;">
      Your roles: {{ roles }}
    </div>
    Switch roles:
    <el-radio-group v-model="roles[0]" @change="switchRoles">
      <el-radio-button label="admin" />
      <el-radio-button label="manager" />
      <el-radio-button label="editor" />
      <el-radio-button label="visitor" />
    </el-radio-group>
  </div>
</template>

<script setup>

import { useStore } from "vuex";

const store = useStore();
const { proxy } = getCurrentInstance();

const roles = computed(() => store.getters['roles']);

const switchRoles = val => {
  store.dispatch('user/changeRoles', val).then(() => {
    proxy.$emit('changeRoles');
  });
};
</script>
