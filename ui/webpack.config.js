const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const { join } = require('path');
const { merge } = require('webpack-merge');

module.exports = merge({
  output: {
    path: join(__dirname, '../dist/ui'),
  },
  
  devServer: {
    port: 4200,
    historyApiFallback: true,
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/main.tsx',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      styles: ['./src/styles.css'],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    }),
  ],
  resolve: {
    alias: {
      'html2pdf.js': false,
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        use: [
          {
            loader: 'source-map-loader',
            options: {
              filterSourceMappingUrl: (url, resourcePath) => {
                // Exclude html2pdf.js from source map processing
                if (/html2pdf\.js/.test(resourcePath)) {
                  return false;
                }

                // Continue with the default behavior for other files
                return true;
              }
            }
          }
        ]
      },
      // Rule for handling font files
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/fonts/',
              publicPath: '/assets/fonts/',
            },
          },
        ],
      },
    ],
  },
});
