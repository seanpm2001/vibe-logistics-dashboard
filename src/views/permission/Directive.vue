<template>
  <div class="page">
    <switch-roles @changeRoles="handleRolesChange" />
    <div :key="key" style="margin-top:30px;">
      <div>
        <span v-permission="['admin']" class="permission-alert">
          <el-tag class="permission-tag" size="small">admin</el-tag> can see this
        </span>
        <el-tag v-permission="['admin']" class="permission-sourceCode" type="info">
          v-permission="['admin']"
        </el-tag>
      </div>

      <div>
        <span v-permission="['editor']" class="permission-alert">
          <el-tag class="permission-tag" size="small">admin</el-tag>
          <el-tag class="permission-tag" size="small">editor</el-tag> can see this
        </span>
        <el-tag v-permission="['editor']" class="permission-sourceCode" type="info">
          v-permission="['editor']"
        </el-tag>
      </div>

      <div>
        <span v-permission="['admin','manager']" class="permission-alert">
          <el-tag class="permission-tag" size="small">admin</el-tag>
          <el-tag class="permission-tag" size="small">manager</el-tag> can see this
        </span>
        <el-tag v-permission="['admin','manager']" class="permission-sourceCode" type="info">
          v-permission="['admin','manager']"
        </el-tag>
      </div>

      <div>
        <span v-permission="['admin','manager','editor']" class="permission-alert">
          <el-tag class="permission-tag" size="small">admin</el-tag> 
          <el-tag class="permission-tag" size="small">manager</el-tag> 
          <el-tag class="permission-tag" size="small">editor</el-tag> can see this
        </span>
        <el-tag v-permission="['admin','manager','editor']" class="permission-sourceCode" type="info">
          v-permission="['admin','manager','editor']"
        </el-tag>
      </div>

      <div>
        <span v-permission="['admin','manager','editor','visitor']" class="permission-alert">
          <el-tag class="permission-tag" size="small">admin</el-tag>
          <el-tag class="permission-tag" size="small">manager</el-tag>
          <el-tag class="permission-tag" size="small">editor</el-tag>
          <el-tag class="permission-tag" size="small">visitor</el-tag> can see this
        </span>
        <el-tag v-permission="['admin','manager','editor','visitor']" class="permission-sourceCode" type="info">
          v-permission="['admin','manager','editor','visitor']"
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
    width: 340px
    margin-top: 15px
    background-color: #f0f9eb
    color: #67c23a
    padding: 8px 16px
    border-radius: 4px
    display: inline-block
  :deep(.permission-sourceCode)
    margin-left: 15px
  :deep(.permission-tag)
    &:not(last-child)
      margin-right: .25rem
    background-color: #ecf5ff
</style>

