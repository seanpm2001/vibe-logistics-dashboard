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

<script>
import { defineComponent, reactive, toRefs } from 'vue';
import { useGetters } from '/@/assets/utils/vuex-helper';
import Timeline from './components/Timeline.vue';
import { ElCard, ElCol, ElRow, ElTabs, ElTabPane  } from 'element-plus';

export default defineComponent({
  name: 'Profile',
  components: {
    Timeline,
    ElCard,
    ElCol,
    ElRow,
    ElTabs,
    ElTabPane,
  },
  setup() {
    const data = reactive({
      user: {},
      activeTab: 'activity'
    });

    const storeData =  {
      ...useGetters('', [
        'name',
        'avatar',
        'roles'
      ])
    };
    console.log('storeData333: ', storeData.avatar);

    const getUser = () => {
      data.user = {
        name: storeData.name,
        role: storeData.roles.join(' | '),
        email: 'admin@test.com',
        avatar: storeData.avatar
      };
    };

    getUser();

    return {
      ...toRefs(data),
      storeData,
      getUser
    };
  },
});
</script>
