const moment = require("moment");

module.exports = {
  publicPath: '/EMR/',
  configureWebpack: (config) => {
    config.devtool = "source-map";
    config.plugins.forEach((val) => {
      if (val.constructor.name === "HtmlWebpackPlugin") {
        const year = new Date().getFullYear() - 1911;
        const str = year + "年" + moment().format("M月D日 HH:mm:ss");
        val.options["BUILD_TIME"] = str;
      }
    });
  },
}