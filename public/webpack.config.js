const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './public/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
      exclude: /node_modules/,
    }, {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    },{
      test: /\.(png|jpe?g|gif)$/i,
      use: [
        {
          loader: 'file-loader',
        },
      ],
    }]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  plugins: [HTMLWebpackPluginConfig],

};