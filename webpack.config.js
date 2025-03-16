const path = require('path');

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd'
  },
};

