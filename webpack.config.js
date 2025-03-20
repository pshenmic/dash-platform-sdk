const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  optimization: {
    concatenateModules: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ]
  },
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/')
    }
  },
  output: {
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
    library: 'DashPlatformSDK',
    libraryExport: 'default',
    libraryTarget: 'umd'
  }
}

