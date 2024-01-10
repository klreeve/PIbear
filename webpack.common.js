const path = require('path');
const { ModifierFlags } = require('typescript');

module.exports = {
  entry: './app/webpack/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'app/static/js'),
    publicPath: "/static/"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  }
}