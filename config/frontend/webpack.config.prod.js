const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const StatsPlugin = require('stats-webpack-plugin');
const path = require('path');

const env = getClientEnvironment('/');

if (env['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: {
    petitions: [
      path.resolve(paths.appSrc, 'bootstrap'),
      path.resolve(paths.appSrc, 'apps', 'petitions'),
    ],
    'member-facing': [
      path.resolve(paths.appSrc, 'apps', 'member-facing'),
    ],
    'call-tool': [
      path.resolve(paths.appSrc, 'bootstrap'),
      path.resolve(paths.appSrc, 'apps', 'call-tool'),
    ],
    fundraiser: [
      path.resolve(paths.appSrc, 'bootstrap'),
      require.resolve(path.join(paths.appSrc, 'apps', 'fundraiser')),
    ],
  },
  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[name].[chunkhash].chunk.js',
    publicPath: '/'
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js', '.json'],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    },
  },

  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [
          paths.appSrc,
        ],
      },
      {
        test: /\.(js)$/,
        include: paths.appSrc,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
        }),
      },
      {
        test: /\.json$/,
        use: [
          'json-loader',
        ]
      },
      // YAML
      {
        test: /\.yml$/,
        use: [
          'json-loader',
          'yaml-loader',
        ]
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              query: {
                name: 'static/media/[name].[hash:8].[ext]'
              },
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              query: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]'
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin(env),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),

    new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash:8].css'
    }),

    new StatsPlugin('manifest.json', {
      chunkModules: false,
      source: false,
      chunks: false,
      modules: false,
      assets: true
    }),

    // Create gzip files of assets
    new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
		}),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2,
    }),
  ],

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },

  externals: {
    jquery: 'jQuery',
  },
};
