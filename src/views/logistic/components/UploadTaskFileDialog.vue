<template>
  <el-dialog
    v-model="dialogUploadVisible"
    width="80%"
    title="Upload File"
    :before-close="beforeCloseUploadDialog"
  >
    <el-row :gutter="40">
      <el-col :span="11">
        <el-upload
          action=""
          class="upload-serial"
          drag
          multiple
          :auto-upload="false"
          :on-change="handleUpdate"
          :on-preview="handlePreview"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
          :file-list="pdfFileList"
        >
          <el-icon class="el-icon--upload">
            <UploadFilled />
          </el-icon>
          <div class="el-upload__text">
            Drag files here or <em>click to upload</em>
          </div>
        </el-upload>
        <!-- <el-row style="margin: .75rem 0 0 -1rem">
          <el-button
            type="primary"
            @click="handleTaskFile('create')"
          >
            Submit Sub-TaskFile
          </el-button>
        </el-row> -->
      </el-col>
      <el-col :span="11">
        <strong>Saved in Database:</strong>
        <template
          v-for="(file, idx) in successfulList"
          :key="file.fileId"
        >
          <div>
            Task {{ file.fileName.split('#')[1] }}:
            <el-tag
              class="cursor-pointer"
              @click="downloadFile(file)"
            >
              {{ file.fileName }}
            </el-tag>
            <svg-icon
              class="icon close-icon mgl-5"
              icon-name="close"
              @click="handleDeleteFile(file, idx)"
            />
          </div>
        </template>
      </el-col>
    </el-row>
    <el-dialog
      v-model="dialogPreviewVisible"
      title="Preview Dialog"
      top="5vh"
      :before-close="beforeCloseDialog"
    >
      <iframe
        class="preview-iframe"
        :src="previewUrl"
      />
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { UploadFilled } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import { findTaskAPI, createTaskFileAPI, deleteTaskFileAPI, findTaskFileAPI } from '@/api';

const dialogUploadVisible= inject('dialogUploadVisible') ;

const pdfFileList = ref([]);
const successfulList = ref([]);
const previewUrl = ref(null);

const dialogPreviewVisible = ref(false);

const getTaskId = (filename) => {
  return new Promise((resolve, reject) => {
    const taskId = filename.split('#')[1];
    findTaskAPI(taskId).then(data => {
      const isRepeated = data.files.some(file => file.fileName === filename);
      if (isRepeated) {
        ElMessage.error('Repeated File');
        return resolve(false);
      }
      resolve(taskId);
    }).catch(err => {
      ElMessage.error('Can\'t find related task or unknown err!');
      resolve(false);
    });
  });
};

const clearFiles = (status, fileList) => {
  const len = fileList.length;
  for (let i = len - 1; i >= 0; i--) {
    if (fileList[i]?.status === status) {
      fileList.splice(i, 1);
    }
  }
};

const handleUpdate = async (file, fileList) => {
  const taskId = await getTaskId(file.name);
  if (!taskId) {
    clearFiles('ready', fileList);
    return;
  }

  const formData = new FormData();
  formData.append('file', file.raw);
  createTaskFileAPI(taskId, formData).then(data => {
    console.log('data: ', data);
    successfulList.value.push(data);
  });
};

const handleExceed = (files, fileList) => {
  ElMessage.warning(
    `The limit is 1, you selected ${files.length} files this time, we will raise the limit in the future.`
  );
};
const handlePreview = file => {
  previewUrl.value = window.URL.createObjectURL(file.raw);
  dialogPreviewVisible.value = true;
};

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

const beforeRemove = (file, fileList) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`Remove the file of ${file.name} ?`, 'Warning', {
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          // 移除文件时重置sub batch products
          
          resolve(action);
        } else if (action === 'cancel') {
          reject();
          ElMessage.info('Delete canceled');
        }
      },
    });
  });
};

const beforeCloseUploadDialog = (done) => {
  pdfFileList.value = [];
  successfulList.value = [];
  done();
};

const beforeCloseDialog = (done) => {
  window.URL.revokeObjectURL(previewUrl.value);
  done();
};

</script>

<style lang="sass" scoped>
:deep(.el-upload-list__item.is-ready)
  cursor: pointer

.preview-iframe
  width: 100%
  min-height: 90vh
</style>
