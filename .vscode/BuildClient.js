const webpack = require("webpack");
const config = require('../Src/Client/webpack.config.js');

const watching = webpack(config).watch
(
  {
    // Watch options.
    aggregateTimeout: 300,
    poll: undefined
  },
  (err, stats) =>
  {
    if (err)
    {
      console.error(err);
      return;
    }

    if (stats.hasErrors())
    {
      console.log
      (
        stats.toString
        (
          {
            colors: true,    // Shows colors in the console
            hash: false,
            version: false,
            timings: false,
            cached: false,
            assets: false,
            cachedAssets: false,
            chunks: false,    // Makes the build much quieter
            modules: false,
            chunkModules: false,
            chunkOrigins: false,
            reasons: false,
            children: false,
            source: false,
            errors: true,
            errorDetails: true,
            warnings: false,
            publicPath: false,
            entrypoints: false
          }
        )
      );
    }
    else
    {
      console.log('Client webpack build finished with no errors.');
    }
  }
);