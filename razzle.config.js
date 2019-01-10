const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  modify: (config, { target, dev }, webpack) => {
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
