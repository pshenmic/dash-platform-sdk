const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './index.ts',
  optimization: {
    concatenateModules: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true
        }
      })
    ]
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    // fix "process is not defined" error:
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/')
    }
  },
  output: {
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
    library: 'DashPlatformSDK',
    libraryTarget: 'umd',
    filename: 'bundle.min.js'
  }
}
