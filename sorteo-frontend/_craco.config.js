// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig, {env, paths}) => {
      // Agregar una nueva regla para source-map-loader con exclusión para react-datepicker
      webpackConfig.module.rules.push ({
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules\/react-datepicker/,
      });
      return webpackConfig;
    },
  },
};
