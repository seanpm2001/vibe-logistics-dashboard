import { ElMessage } from 'element-plus';

const Message = {
  success: (message, duration = 3800) => {
    setTimeout(() => {
      ElMessage({
        message: message,
        type: 'success',
        duration
      });
    }, 10);
  },
  error: (message, duration = 3800) => {
    setTimeout(() => {
      ElMessage({
        message: message,
        type: 'error',
        duration
      });
    }, 10);
  },
  warning: (message, duration = 3800) => {
    setTimeout(() => {
      ElMessage({
        message: message,
        type: 'warning',
        duration
      });
    }, 10);
  },
  info: (message, duration = 3800) => {
    setTimeout(() => {
      ElMessage({
        message: message,
        type: 'info',
        duration
      });
    }, 10);
  },
};

export default Message;
