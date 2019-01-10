const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    // Ignore all locale files of Moment.js
    // See: https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

    // Webpack Bundle Analyzer
    if (!dev) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: target === 'web' ? '../client-webpack-report.html' : 'server-webpack-report.html',
        openAnalyzer: false,
      }));
    }
    return config;
  },
};
