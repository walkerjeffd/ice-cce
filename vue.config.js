const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/cce-dev/'
    : '/',
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        L: 'leaflet',
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
  }
};