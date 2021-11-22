<template>
  <div class="page">
    <h>Ui Refactor Page</h>
    <div class="content">
      <p>
        You can click link under Css Show or the link with 'Css' in the title to see different styling techniques to get inspiration for UI refactoring.
      </p>
      <p>
        Below are some display pages or video effects.
      </p>
    </div>
    <div class="card-container">
      <el-space alignment="flex-start" wrap>
        <el-card class="box-card" style="width: 250px">
          <template #header>
            <div class="card-header">
              <span>Bilibili (easy to do)</span>
            </div>
          </template>
          <div v-for="(item, index) in iframeUrlData['bilibili']" :key="index" class="text item">
            <el-link @click="openDialog(index, 'bilibili')">{{ item.name }}</el-link>
          </div>
        </el-card>
        <el-card class="box-card" style="width: 250px">
          <template #header>
            <div class="card-header">
              <span>Website (time to research)</span>
            </div>
          </template>
          <div v-for="(item, index) in iframeUrlData['website']" :key="index" class="text item">
            <el-link @click="openDialog(index, 'website')">{{ item.name }}</el-link>
          </div>
        </el-card>
      </el-space>
    </div>
    
    <el-dialog
      v-model="centerDialogVisible"
      title="Css Dialog"
      top="32px"
      width="80%"
      destroy-on-close
      center
    >
      <iframe ref="iframe" class="ui-iframe" :src="iframeUrl"></iframe>
    </el-dialog>
  </div>
</template>

<script setup>
// import DialogIframe from "/@/components/DialogIframe.vue";
import { getCurrentInstance, ref, watch } from "vue";

const { proxy } = getCurrentInstance();

const centerDialogVisible = ref(false);
const iframeUrl = ref('');
const iframeUrlData = {
  'bilibili': [
    {
      name: 'Earth Transition',
      url: 'https://www.bilibili.com/video/BV1UF411e744?spm_id_from=333.999.0.0'
    },
    {
      name: 'Parallax Demo',
      url: 'https://www.bilibili.com/video/BV1aU4y1g7oZ?spm_id_from=333.999.0.0',
      target: true
    },
  ],
  'website': [
    {
      name: 'Rouserlab',
      url: 'https://www.rouserlab.com/about'
    },
    {
      name: 'The year of greta',
      url: 'https://theyearofgreta.com/'
    },
    {
      name: 'Use pink',
      url: 'https://useplink.com/en/',
      target: true
    },
    {
      name: 'More',
      url: 'https://www.youtube.com/watch?v=AmHEfTSBXiY',
      target: true
    }
  ] 
};

const openDialog = (idx, name) => {
  const iframeUrlArr = iframeUrlData[name][idx];
  if (iframeUrlArr.target) {
    window.open(iframeUrlArr.url, "_blank");
    return;
  }
  iframeUrl.value = iframeUrlArr.url;
  centerDialogVisible.value = true;
};

</script>

<style lang="sass" scoped>
.page
  padding: 32px
  min-height: calc(100vh - 150px)
  background-color: rgb(240, 242, 245)

h
  display: block
  margin-bottom: 1rem
  font-size: 32px
  font-weight: 700
  color: #333

.card-container
  margin-top: 32px
  .el-card .item:not(:last-child)
    margin-bottom: 16px
    
.ui-iframe
  width: 100%
  height: 80vh
</style>
