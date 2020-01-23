/* eslint quotes: ["error", "double"] */
/* eslint comma-dangle: ["error", "never"] */

const path = require("path");
const merge = require("webpack-merge");
const nodeModules = path.resolve(__dirname, 'node_modules');
const bowerComponents = path.resolve(__dirname, 'bower_components');
const CleanWebpackPlugin = require("clean-webpack-plugin");

const common = {
  entry: "./frontend/js/index.js",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [nodeModules, bowerComponents],
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  plugins: [
    new CleanWebpackPlugin(["frontend/scaffold/bundle"])
  ],
  output: {
    path: path.resolve(__dirname, "frontend/scaffold/bundle/"),
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    port: 3000, // use any port suitable for your configuration
    host: '0.0.0.0', // to accept connections from outside container
    // watchOptions: {
    //     aggregateTimeout: 500, // delay before reloading
    //     poll: 1000 // enable polling since fsevents are not supported in docker
    // }
  }
};

switch (process.env.NODE_ENV) {
  case "production":
    module.exports = merge(common, {
      mode: "production",
      devtool: "source-map"
    });
    break;
  default:
    module.exports = merge(common, {
      mode: "development",
      devtool: "inline-source-map",
      devServer: {
        contentBase: path.join(__dirname, "frontend/scaffold/"),
        port: 3000,
        hotOnly: true
      }
    });
    break;
}
