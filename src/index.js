import http from 'http';

let app = require('./server').default;

const server = http.createServer(app);

let currentApp = app;

// Prevent PORT from being inlined during build
const getEnv = c => process.env[c];
const PORT = getEnv('PORT') || 3001;

server.listen(PORT, error => {
  if (error) {
    console.log(error);
  }

  console.log(`🚀 started on port: ${PORT}`);
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}
