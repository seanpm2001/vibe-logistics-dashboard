<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>

import { useStore } from 'vuex';
import Timeline from './components/Timeline.vue';

const store = useStore();

const user = ref({});
const activeTab = ref('activity');

const name = ref(store.getters['name']);
const avatar = ref(store.getters['avatar']);
const roles = ref(store.getters['roles']);


const getUser = () => {
  user.value = {
    name: name.value,
    role: roles.value.join(' | '),
    email: 'admin@test.com',
    avatar: avatar.value
  };
};

getUser();
</script>
