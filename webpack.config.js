const path = require('path');

module.exports = {
  mode: 'production',
  entry: './index.js',
  resolve: {
    fallback: {
      "stream":  require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/")
    },
  },
  output: {
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd'
  },
};

