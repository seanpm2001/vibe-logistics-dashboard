<template>
  <div class="download-file-list">
    <strong>Files:</strong>
    <template
      v-for="file in taskItem?.files"
      :key="file.fileId"
    >
      <div>
        <el-tag
          class="cursor-pointer"
          @click="downloadFile(file)"
        >
          {{ file.fileName }}
        </el-tag>
        <svg-icon
          class="icon close-icon mgl-5"
          icon-name="close"
          @click="handleDeleteFile(file)"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { findTaskFileAPI, deleteTaskFileAPI } from '@/api';

defineProps({
  taskItem: {
    type: Object,
    required: true
  }
});

const downloadFile = file => {
  const taskId = file.fileName.split('#')[1];
  findTaskFileAPI(taskId, file.fileId).then(data => {
    window.open(data.downloadUrl);
  });
};

const handleDeleteFile = (file, fileIdx) => {
  const fileName = file.fileName;
  ElMessageBox.confirm(`Delete the file of ${fileName} ?`, 'Warning', {
    type: 'warning',
    callback: (action) => {
      if (action === 'confirm') {
        const taskId = fileName.split('#')[1];
        deleteTaskFileAPI(taskId, file.fileId).then(() => {
          successfulList.value.splice(fileIdx, 1);
        });
      } else if (action === 'cancel') {
        ElMessage.info('Delete canceled');
      }
    },
  });
};
</script>

<style lang="sass" scoped>

</style>
