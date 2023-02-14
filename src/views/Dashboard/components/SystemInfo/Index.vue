<template>
  <el-descriptions
    style="margin-top: 32px"
    title="System Info"
    border
  >
    <el-descriptions-item
      key="IP"
      label="IP"
    >
      {{ ip }}
    </el-descriptions-item>
    <el-descriptions-item
      v-for="(value, key) in browserInfo"
      :key="key"
      :label="key"
    >
      {{ value }}
    </el-descriptions-item>
    <el-descriptions-item label="网络状态">
      <el-tag :type="online ? 'success' : 'danger'">
        {{ online ? 'Online' : 'Offline' }}
      </el-tag>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import {useOnline} from './useOnline';
import BrowserType from './browser-type';

const browserInfo = ref(BrowserType('en'));
const { online } = useOnline();
const ip = ref(sessionStorage.Ip);

function getIpByIpify() {
  if (sessionStorage.Ip) return;

  return fetch('https://api.ipify.org/?format=json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.text())
    .then((res) => {
      ip.value = JSON.parse(res).ip;
      sessionStorage.Ip = ip.value;
    })
    .catch((err) => {
      console.log('getIpByIpify err: ', err);
    });
}

onMounted(() => {
  getIpByIpify();
});
</script>
