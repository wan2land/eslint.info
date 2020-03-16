const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    entry: path.resolve(__dirname, '../src/entry.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: [
      '.ts',
      '.js',
      '.json',
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    // new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}

// Development
if (process.env.NODE_ENV !== 'production') {
  module.exports.mode = 'development'
}

// Production
// if (process.env.NODE_ENV === 'production') {
//   module.exports.devtool = ''
//   module.exports.plugins.push(
//     new MinifyPlugin(),
//     new CopyWebpackPlugin([
//       {
//         from: path.resolve(__dirname, '../static'),
//         to: path.resolve(__dirname, '../dist/electron/static'),
//         ignore: ['.*']
//       }
//     ]),
//     new webpack.LoaderOptionsPlugin({
//       minimize: true
//     }),
//   )
// }
