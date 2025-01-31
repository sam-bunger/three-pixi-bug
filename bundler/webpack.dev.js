/* eslint-disable @typescript-eslint/no-var-requires */
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const path = require('path')
module.exports = merge(commonConfiguration, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    open: ['http://localhost:8080'],
    watchFiles: {
      paths: [
        '../src/**/*'
      ],
      options: {
        usePolling: true,
      },
    },
    allowedHosts: 'all',
    hot: true,
    historyApiFallback: true,
  },
  optimization: {
    runtimeChunk: 'single',
  },
  plugins: [
  
  ],
})
