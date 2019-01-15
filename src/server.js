import './bootstrap';
import express from 'express';
import compression from 'compression';
import proxy from 'http-proxy-middleware';
import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter, matchPath } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { SheetsRegistry } from 'react-jss';
import LRUCache from 'lru-cache';
import { StylesProvider } from '@material-ui/styles';

import { isProd } from './utils';
import App from './App';
import createStore from './store/createStore';
import routes from './routes'
import { setNav, fetchAPIStatus } from './actions';

// Prepare LRU cache
const cache = new LRUCache({
  length: function (n, key) {
    return n.toString().length + key.toString().length;
  },
  max: 50 * 1e6, // ~50MB cache soft limit
  maxAge: 60 * 1e3, // 1 min
});
let hits = 0;
let total = 0;
const logCacheInfo = (hit) => {
  isProd && console.log(`[CACHE] ${hit ? 'HIT' : 'MISS'} (${hits}/${total}: ${(100*hits/total).toFixed(1)}%) (count: ${cache.itemCount}, size: ${(cache.length/1e6).toFixed(2)}MB)`);
}

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const scripts = Object.entries(assets).map(asset => {
  if (asset[0] && asset[1].js) {
    return isProd ? `<script src="${asset[1].js}" defer></script>` : `<script src="${asset[1].js}" defer crossorigin></script>`
  }
}).join('');

const server = express();
server
  .disable('x-powered-by')
  .use(compression())
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR, {index: false}))
  .use('/api', proxy({ target: isProd ? 'https://tbatv-prod-hrd.appspot.com' : 'https://www.thebluealliance.com', changeOrigin: true }))
  .get('/*', (req, res) => {
    // Set common headers
    res.setHeader('Vary', 'Accept-Encoding');  // Need to manually set for 304 responses

    // If a page is cached in production, serve it
    const cacheKey = `${req.url}`
    total++
    if (isProd && cache.has(cacheKey)) {
      res.setHeader('x-ssr-cache', 'HIT')
      res.send(cache.get(cacheKey))
      hits++
      logCacheInfo(true)
      return
    }

    const { store } = createStore(req.url);
    const context = {};
    const sheetsRegistry = new SheetsRegistry();

    Promise.all([
      store.dispatch(fetchAPIStatus()), // Must be fetched before getInitialData
    ]).then(() => {
      // Run getInitialData() lifecycle hook on matching routes
      const matches = routes.map((route, index) => {
        const match = matchPath(req.url, route.path, route);
        if (match && (!route.exact || match.isExact)) {
          // Set navValue based on route
          if (route.navValue) {
            store.dispatch(setNav(route.navValue));
          }
          const obj = {
            route,
            match,
            promise: route.component.getInitialData
              ? route.component.getInitialData({
                  dispatch: store.dispatch,
                  match,
                })
              : null,
          };
          return obj;
        }
        return null;
      });
      return Promise.all(matches.map(match => (match ? match.promise : null)));
    }).then(() => {
      const markup = renderToString(
        <Provider store={store}>
          <StylesProvider sheetsRegistry={sheetsRegistry} sheetsManager={new Map()}>
            <StaticRouter context={context} location={req.url}>
              <App />
            </StaticRouter>
          </StylesProvider>
        </Provider>
      );

      const helmet = Helmet.renderStatic();
      const css = sheetsRegistry.toString();
      // Remove parts of state that are client-only
      const state = JSON.stringify(store.getState().delete('page')).replace(/</g, '\\u003c'); // Be careful of XSS

      if (context.url) {
        res.redirect(context.url);
      } else {
        // TODO: use ./src/index_template.html
        const html = `<!doctype html>
  <html lang="en">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="canonical" href="https://www.thebluealliance.com${req.url}" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#3F51B5" />
    <link rel="manifest" href="/manifest.json" />
    ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
    <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
    <style id="jss-server-side">${css}</style>
  </head>
  <body>
    <div id="root">${markup}</div>
    <script id="preloaded-state-server-side">window.__PRELOADED_STATE__ = ${state}</script>
    ${scripts}
  </body>
</html>`

        if (context.statusCode) {
          res.status(context.statusCode);
        } else {
          res.status(200);
          // Only cache 200 responses
          cache.set(cacheKey, html);
        }

        // Cache and send final HTML
        res.setHeader('x-ssr-cache', 'MISS');
        res.send(html);
        logCacheInfo(false);
      }
    })
  });

export default server;
