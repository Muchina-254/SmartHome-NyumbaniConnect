// Configuration to enhance hot reloading for Windows development
const path = require('path');

module.exports = {
  devServer: (devServerConfig) => {
    // Enable hot module replacement
    devServerConfig.hot = true;
    
    // Enable live reloading
    devServerConfig.liveReload = true;
    
    // File watching options for Windows
    devServerConfig.watchFiles = {
      paths: ['src/**/*', 'public/**/*'],
      options: {
        usePolling: true,
        interval: 1000,
      },
    };
    
    // Client configuration for WebSocket connection
    devServerConfig.client = {
      ...devServerConfig.client,
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    };
    
    return devServerConfig;
  },
  
  // Webpack configuration
  webpack: {
    configure: (webpackConfig) => {
      // Ensure proper file watching
      webpackConfig.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
      
      return webpackConfig;
    },
  },
};
