var path    = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');


module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/js/'
  },
  plugins: [
    new HtmlwebpackPlugin({
      template: 'node_modules/html-webpack-template/index.html',
      title: 'react-tree-menu-faceted-navigation' ,
      appMountId: 'main'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
	    {
        test: /\.jsx?$/,
        loader: 'babel',
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules/react-tree-menu") // react-tree-menu needs tobe compiled, otherwise got error
        ]
      },
      { test: /\.css$/, loader: "style!css" },
      { test: /\.less$/, loader: "style!css!less" },
	    { test: /\.json?$/, loader: 'json' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  }
};
