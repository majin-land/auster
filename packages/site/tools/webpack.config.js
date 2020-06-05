/* eslint-disable global-require, no-confusing-arrow, max-len */
const { TARGET } = process.env
const ENV = process.env.NODE_ENV || 'development'
const isDebug = ENV !== 'production'

let dotEnvPath = './.env'
if (TARGET === 'prod') {
  dotEnvPath = './.env.production'
}
require('dotenv').config({ path: dotEnvPath })

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Dotenv = require('dotenv-webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v')

const babelConfig = require('../babel.config.js')

const analyze = process.argv.includes('analyze') || false

const PORT = process.env.PORT || 3000

// Webpack configuration (index.js => dist/main.{hash}.js)
// http://webpack.github.io/docs/configuration.html
const config = {

  target: 'web',

  mode: isDebug ? 'development' : 'production',

  // The base directory for resolving the entry option
  context: path.resolve(__dirname, '../src'),

  // The entry point for the bundle
  entry: [
    './index.js',
  ],

  // Options affecting the output of the compilation
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: isDebug ? '[name].[hash].js' : '[name].[contenthash].js',
    chunkFilename: isDebug ? '[name].[hash].js' : '[name].[contenthash].js',
  },

  // Developer tool to enhance debugging, source maps
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: isDebug ? 'source-map' : false,

  resolve: {
    symlinks: false,
    alias: {
      // 'react-dom': '@hot-loader/react-dom',
      '~': path.resolve(__dirname, '../'),
    },
  },

  // What information should be printed to the console
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
    modules: false,
  },

  // The list of plugins for Webpack compiler
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      __ENV__: `'${TARGET}'`,
      __VERSION__: JSON.stringify(require('../package.json').version),
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.LoaderOptionsPlugin({
      debug: isDebug,
      minimize: !isDebug,
    }),
    new Dotenv({
      path: dotEnvPath, // load this now instead of the ones in '.env'
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.ejs'),
      config: { ENV },
      hash: isDebug,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new CaseSensitivePathsPlugin(),
    new CopyPlugin({
      patterns: [
        path.resolve(__dirname, '../assets'),
      ],
    }),
  ],

  // Options affecting the normal modules
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/[/\\\\]node_modules[/\\\\]/], // exclude node_modules folder per default
        include: [
          path.resolve(__dirname, '../src'),
        ],
        use: [
          {
            loader: 'thread-loader',
          },
          {
            loader: 'babel-loader',
            options: {
              ...babelConfig,
              cacheDirectory: isDebug,
              compact: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          isDebug ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ico|eot|ttf|wav|mp3|csv|mp4)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]',
        },
      },
    ],
  },
}

// Optimize the bundle in release (production) mode
if (!isDebug) {
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin())
  config.plugins.push(new webpack.HashedModuleIdsPlugin())
  config.plugins.push(new MiniCssExtractPlugin({
    filename: '[name].[hash].css',
    chunkFilename: '[id].[hash].css',
  }))
  config.optimization = {
    nodeEnv: 'production',
    minimize: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  }
} else {
  config.entry.unshift('react-hot-loader/patch')
  config.resolve.alias['react-dom'] = '@hot-loader/react-dom'
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin())
  config.devServer = {
    host: '0.0.0.0',
    port: PORT,
    contentBase: path.resolve(__dirname, '../dist'),
    compress: false,
    open: true,
    hot: true,
    disableHostCheck: true,
    historyApiFallback: true,
  }
  config.optimization = {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  }
}

if (analyze) {
  config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config
