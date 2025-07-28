const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,

  devServer: {
    port: 9091, // 前端开发服务器运行在8081端口
    // http 代理配置
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8081', // 后端服务器地址
        changeOrigin: true,
        // pathRewrite: {
        //     '^/api': '' //如果需要移除/api前缀，可以启用此配置
        // }
      }
    }
  }
})
