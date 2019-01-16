const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const moment = require('moment-timezone');
const child_process = require('child_process');

const buildTime = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss z');
const gitHash = process.env.GITHUB_SHA || child_process.execSync('git rev-parse HEAD').toString();

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    const isWeb = target === 'web';

    // Add build info
    config.plugins.push(new webpack.DefinePlugin({
      __BUILD_TIME__: JSON.stringify(buildTime),
      __GIT_HASH__: JSON.stringify(gitHash),
    }));

    // Configure vendor bundles
    // See: https://hackernoon.com/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
    if (isWeb) {
      config.optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace('@', '')}`;
              },
            },
          },
        },
      };
    }

    // Ignore all locale files of Moment.js
    // See: https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

    if (!dev && isWeb) {
      // Generate index.html for offline
      config.plugins.push(new HtmlWebpackPlugin({
        template: './src/index_template.html',
        filename: 'index.html',
      }));

      // Setup Workbox service worker
      config.plugins.push(new WorkboxPlugin.InjectManifest({
        swSrc: './src/sw.js',
      }));
    }

    // Webpack Bundle Analyzer
    if (!dev) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: isWeb ? '../client-webpack-report.html' : 'server-webpack-report.html',
        openAnalyzer: false,
      }));
    }
    return config;
  },
};
