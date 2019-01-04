import express from 'express';
import compression from 'compression';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import JssProvider from 'react-jss/lib/JssProvider';
import { SheetsRegistry } from 'jss';
import uglifycss from 'uglifycss';
import { createGenerateClassName } from '@material-ui/core/styles';

import App from './App';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .use(compression())
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
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
      res.status(200).send(
        `<!doctype html>
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
          process.env.NODE_ENV === 'production'
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
      );
    }
  });

export default server;
