<template>
  <div class="page">
    <switch-roles @changeRoles="handleRolesChange" />
    <div :key="key" style="margin-top:30px;">
      <div>
        <span v-permission="['admin']" class="permission-alert">
          Only
          <el-tag class="permission-tag" size="small">admin</el-tag> can see this
        </span>
        <el-tag v-permission="['admin']" class="permission-sourceCode" type="info">
          v-permission="['admin']"
        </el-tag>
      </div>

      <div>
        <span v-permission="['editor']" class="permission-alert">
          Only
          <el-tag class="permission-tag" size="small">editor</el-tag> can see this
        </span>
        <el-tag v-permission="['editor']" class="permission-sourceCode" type="info">
          v-permission="['editor']"
        </el-tag>
      </div>

      <div>
        <span v-permission="['admin','editor']" class="permission-alert">
          Both
          <el-tag class="permission-tag" size="small">admin</el-tag> and
          <el-tag class="permission-tag" size="small">editor</el-tag> can see this
        </span>
        <el-tag v-permission="['admin','editor']" class="permission-sourceCode" type="info">
          v-permission="['admin','editor']"
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { checkPermission } from '/@/assets/utils/permission'; // 权限判断函数
import SwitchRoles from './components/SwitchRoles.vue';
const router = useRouter();

const key = ref(1); // 切换权限的时重新初始化指令
const handleRolesChange = () => {
  key.value++;
};
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  :deep(.permission-alert)
    width: 320px
    margin-top: 15px
    background-color: #f0f9eb
    color: #67c23a
    padding: 8px 16px
    border-radius: 4px
    display: inline-block
  :deep(.permission-sourceCode)
    margin-left: 15px
  :deep(.permission-tag)
    background-color: #ecf5ff
</style>

