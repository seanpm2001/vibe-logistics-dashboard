export const commonEnv = {
  VITE_HOST : '0.0.0.0',
  VITE_PORT : 8080,
  VITE_BASE_URL : './',
  VITE_OUTPUT_DIR : 'dist',
};

export const developmentEnv = {
  NODE_ENV : 'development',
  VITE_API_DOMAIN : 'https://vibe-beta.com/api/' // 测试环境API地址
};

export const productionEnv = {
  NODE_ENV : 'production',
  VITE_API_DOMAIN : 'https://vibe.us/api/' // 线上环境API地址
};
