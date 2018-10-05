const path = require('path');

module.exports =
{
  entry: './Src/Client/KosmudClient.ts',
  devtool: 'inline-source-map',
  mode: 'production',
  module:
  {
    rules:
    [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
        options: { transpileOnly: true }
      }
    ]
  },
  resolve:
  {
    extensions: [ '.ts', '.js' ]
  },
  output:
  {
    filename: 'KosmudClient.js',
    // We use path.resolve() because this must be a full path.
    // (__dirname leads to directory where webpack.config.js is located).
    path: path.resolve(__dirname, '../../Client/js')
  }
};