const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const getPlugins = () => {
  const plugins = [
    new webpack.EnvironmentPlugin(process.env),
    new WebpackAssetsManifest({
      entrypoints: true,
      writeToDisk: true,
      output: 'manifest.json',
      entrypointsUseAssets: true,
      publicPath: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
    }),
  ];

  const hash = isProduction ? '-[contenthash:8]' : '';
  plugins.push(
    new MiniCssExtractPlugin({
      filename: `css/[name]${hash}.css`,
      chunkFilename: `css/[id]${hash}.css`,
    }),
  );

  return plugins;
};

module.exports = {
  entry: {
    app: './src/index.tsx',
  },
  plugins: getPlugins(),
  output: {
    filename: 'js/[name]-[contenthash].js',
    chunkFilename: 'js/[name]-[contenthash].chunk.js',
    hotUpdateChunkFilename: 'js/[id].[fullhash].hot-update.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
    ],
  },
  target: 'web',
  devtool: 'source-map',
  stats: 'normal',
  resolveLoader: {
    'modules': [
      'node_modules',
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.((bmp)|(gif)|(jpe?g)|(png)|(tiff)|(ico)|(avif)|(webp)|(eot)|(otf)|(ttf)|(woff)|(woff2)|(svg))$/,
        exclude: /\.(js|mjs|jsx|ts|tsx)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name]-[hash][ext][query]',
        },
      },
      {
        test: /\.(css)$/i,
        use: [
          !isProduction ? 'style-loader' : require('mini-css-extract-plugin').loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
                exportOnlyLocals: true,
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          !isProduction ? 'style-loader' : require('mini-css-extract-plugin').loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,

              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(js|jsx|mjs)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: isProduction,
              compact: isProduction,
            },
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          'ts-loader',
        ],
      },
    ],
  },
};
