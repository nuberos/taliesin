var Path = require('path');

var config = {
  entry: {
    index: Path.join(__dirname,'dist','index.js')
  },
  output: {
    path: Path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
        /*use: ["source-map-loader"],
        enforce: "pre"*/
      }
    ]
  }
};

module.exports = config;
