const registerRouter = require('./backend/router')

module.exports = {
  css: {
    loaderOptions: {
        sass: {
          // 全局引入变量和 mixin
          additionalData: `
            @import "@/assets/scss/variable.scss";
            @import "@/assets/scss/mixin.scss";
          `
        }
    }
  },
  // 后端起服务
  // webpack的devServer.before 可以提供了一个在 devServer 内部的 所有中间件执行之前的自定义执行函数。
  // 故：可以采用此方法来模拟后台数据接口。  express 去起一个serve服务
  devServer: {
    // app 是express的一个实例
    before(app) {
      registerRouter(app)
    }
  },
  configureWebpack: (config) => {
    if (process.env.npm_config_report) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  }
}
