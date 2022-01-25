<template>
  <div class="dashboard-editor-container">
    <div class="f-row">
      <pan-thumb :image="avatar">
        Your roles:
        <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>
      </pan-thumb>
      <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" />
      <div class="info-container">
        <span class="display-name">{{ name }}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">Editor's Dashboard</span>
      </div>
    </div>
    <div>
      <img :src="emptyGif" class="emptyGif">
    </div>
  </div>
</template>

<script setup>

import { useStore }  from 'vuex';
import PanThumb from '/@/components/PanThumb.vue';
import GithubCorner from '/@/components/GithubCorner.vue';

const store = useStore();
const emptyGif = ref('https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3');
    
const name = computed(() => store.getters['name']);
const avatar = computed(() => store.getters['avatar']);
const roles = computed(() => store.getters['roles']);
</script>

<style lang="sass" scoped>
  .emptyGif
    display: block
    width: 45%
    margin: 0 auto

  .dashboard-editor-container
    position: relative
    background-color: #e3e3e3
    min-height: 100vh
    padding: 32px

    .pan-info-roles
      font-size: 14px
      font-weight: 700
      color: #333
      display: block
    
    .info-container
      position: relative
      margin-left: 50px
      width: 400px
      height: 150px
      line-height: 200px
      user-select: none
      .display-name
        font-size: 48px
        line-height: 48px
        color: #212121
        position: absolute
        top: 25px
</style>
