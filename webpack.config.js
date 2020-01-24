const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, options) => {

  return ({
    mode: 'development',
    entry: path.resolve(__dirname, './src/app.js'),
    devtool: 'inline-source-map',

    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 2000,
      compress: true,
      open: true, // Open the page in the browser
      // useLocalIp: true,
      // host: '0.0.0.0',
    },

    output: {
      filename: '[name].js',
      chunkFilename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },

    module: {
      rules: [{
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      }, {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }]
    },

    performance: {
      hints: "warning", // enum
      // maxAssetSize: 2000000, // int (in bytes),
      // maxEntrypointSize: 4000000, // int (in bytes)
    },

    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Trainings App',
        template: 'index.html',
        meta: {
          'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no', // Will generate: <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          'theme-color': '#000000' // Will generate: <meta name="theme-color" content="#000000">
        },
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      }),
      new CopyPlugin([
        { from: 'models', to: 'models' },
        { from: 'workers', to: 'workers' },
        { from: 'images', to: 'images' },
      ]),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new Dotenv(),
    ]
  })
};