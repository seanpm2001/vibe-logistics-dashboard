<template>
  <div class="page">
  {{formData}}
  <el-form :model="formData">
    <el-form-item required label="a" error="required" prop="a">
      <el-input v-model="formData.a"></el-input>
    </el-form-item>
    <el-form-item required label="title" error="required" prop="obj.title">
      <el-input v-model="formData.obj.title"></el-input>
    </el-form-item>
    <el-form-item required label="body" error="required" prop="obj.body">
      <el-input v-model="formData.obj.body"></el-input>
    </el-form-item>
    <template v-for="(item, idx) in formData.arr2" :key="idx">
      <el-form-item required label="name" error="required" :prop="'arr2.' + idx + '.name'">
        <el-input v-model="item.name"></el-input>
      </el-form-item>
      <el-form-item required label="age" error="required" :prop="'arr2[' + idx + '].age'">
        <el-input v-model="item.age"></el-input>
      </el-form-item>
    </template>
  </el-form>
  </div>
  
</template>

<script lang="ts" setup>
const formData = ref({
  a: null,
  arr1: [0,1,2],
  arr2: [
    {
      name: null,
      age: null
    },
    {
      name: null,
      age: null
    },
  ],
  obj: {
    title: null,
    body: null
  }
});
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  background-color: #e3e3e3
  min-height: calc(100vh - 91px - 32px)
.el-form
  width: 50%
</style>
