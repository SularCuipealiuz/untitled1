// 載入轉存 css 檔案的套件

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
var webpack = require('webpack')

var config = {
  entry: {
    // 指定進入點並設定名稱及來源
    // "名稱":"來源 scss or sass 檔案"
    style: './public/stylesheets/style.scss'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          // 需要用到的 loader
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 指定輸出位置
      // [name] 為上方進入點設定的 "名稱"
      filename: './css/style.css'
    }),
    new webpack.ProvidePlugin({})
  ],
  resolve: {
    alias: {}
  },
  devtool: 'inline-source-map'
}

module.exports = config
