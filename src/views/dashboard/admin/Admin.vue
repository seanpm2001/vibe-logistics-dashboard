<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <pan-thumb :image="avatar" style="float: left;">
        Your roles:
        <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>
      </pan-thumb>
      <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" />
      <div class="info-container">
        <span class="display_name">{{ name }}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">Admin's Dashboard</span>
      </div>
    </div>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
// import PanelGroup from './components/PanelGroup.vue'
// import BoxCard from './components/BoxCard.vue'
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
.dashboard-editor-container
  padding: 32px
  background-color: rgb(240, 242, 245)
  position: relative

  .info-container
    position: relative
    margin-left: 190px
    height: 150px
    line-height: 200px
    .display_name
      font-size: 48px
      line-height: 48px
      color: #212121
      position: absolute
      top: 25px

  .github-corner
    position: absolute
    top: 0px
    border: 0
    right: 0

  .chart-wrapper
    background: #fff
    padding: 16px 16px 0
    margin-bottom: 32px
  


@media (max-width:1024px)
  .chart-wrapper
    padding: 8px
  

</style>
