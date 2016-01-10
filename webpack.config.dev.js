var path    = require('path');
var webpack = require('webpack');

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
	    { test: /\.json?$/, loader: 'json' }
    ]
  }
};
