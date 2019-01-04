import express from 'express';
import compression from 'compression';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import JssProvider from 'react-jss/lib/JssProvider';
import { SheetsRegistry } from 'jss';
import uglifycss from 'uglifycss';
import LRUCache from 'lru-cache';
import { createGenerateClassName } from '@material-ui/core/styles';

import App from './App';

const isProd = process.env.NODE_ENV === 'production';

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

const server = express();
server
  .use(compression())
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const cacheKey = `${req.url}`
    total++

    // If a page is cached in production, serve it
    if (isProd && cache.has(cacheKey)) {
      res.setHeader('x-ssr-cache', 'HIT')
      res.send(cache.get(cacheKey))
      hits++
      logCacheInfo(true)
      return
    }

    const context = {};
    const sheetsRegistry = new SheetsRegistry();
    const generateClassName = createGenerateClassName();

    const markup = renderToString(
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </JssProvider>
    );

    const css = uglifycss.processString(sheetsRegistry.toString());

    if (context.url) {
      res.redirect(context.url);
    } else {
      const html = `<!doctype html>
  <html lang="">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
    <title>The Blue Alliance</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${
      assets.client.css
        ? `<link rel="stylesheet" href="${assets.client.css}">`
        : ''
    }
    ${
      isProd
        ? `<script src="${assets.client.js}" defer></script>`
        : `<script src="${assets.client.js}" defer crossorigin></script>`
    }
    <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
    <style id="jss-server-side">${css}</style>
  </head>
  <body>
    <div id="root">${markup}</div>
  </body>
</html>`

      // Cache and send final HTML
      res.setHeader('x-ssr-cache', 'MISS');
      res.status(200).send(html);
      cache.set(cacheKey, html);
      logCacheInfo(false);
    }
  });

export default server;