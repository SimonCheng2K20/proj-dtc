const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  runtimeCompiler: true,
  // 在 prodution 下, 不要為 .js 產生 .map 檔, 才不會把註解都輸出出去
  productionSourceMap: false,
  publicPath: './',
  devServer: {
    proxy: `http://192.168.1.200` + '/RIS',
    port: 80,
    open: process.platform === 'darwin',
    //proxy: 'http://localhost:14722'
  },
  // outputDir: "../RIS_WF/app",
  //
  lintOnSave: false,
  // configureWebpack: {
  //   devtool: "source-map",
  // },
  configureWebpack: (config) => {
    config.plugins.forEach((val) => {
      if (val instanceof HtmlWebpackPlugin) {
        val.options['BUILD_TIME'] = new Date()
      }
    })
  },
}
