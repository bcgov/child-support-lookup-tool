'use strict';

const webpack = require('webpack');
const WebpackShellPlugin = require('webpack-shell-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {

  entry: [
    'bootstrap-loader',
    './src/scripts/index'
  ],

  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, './public'),
    pathinfo: true
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader?presets[]=es2015'
          }
        ]
      },
      {
        test: /\.jst$/,
        use: {
          loader: 'underscore-template-loader'
        }
      },
      {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.scss$/,
        use: [{
            loader: 'style-loader' // creates style nodes from JS strings
        }, {
            loader: 'css-loader' // translates CSS into CommonJS
        }, {
            loader: 'sass-loader' // compiles Sass to CSS
        }]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  resolve: {
    extensions: ['.js']
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    //new WebpackShellPlugin({
    //  onBuildEnd: [
        //'echo "transferring files to test ... "',
        //'cp ./public/main.bundle.js ./test'
    //  ]
    //}),
    new CleanWebpackPlugin(['public']),
    new HtmlWebpackPlugin({
      title: 'My App',
      inject: true,
      template: './src/index.tmpl'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      _: 'underscore',
      Backbone: 'backbone'
    })
  ],

  devServer: {
    contentBase: './public',
    port: 3000,
    open: true
  }
};

