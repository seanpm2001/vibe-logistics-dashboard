<template>
  <div class="dashboard-editor-container">
    <div class="f-row">
      <pan-thumb :image="avatar">
        Your roles:
        <span class="pan-info-roles">{{ role }}</span>
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
import PanThumb from '/@/components/PanThumb.vue';
import GithubCorner from '/@/components/GithubCorner.vue';
import { useUserStore } from '/@/stores';

const userStore = useUserStore();
const { name, avatar, role } = storeToRefs(userStore);
const emptyGif = ref('https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3');
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
