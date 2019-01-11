const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    const isWeb = target === 'web';

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
