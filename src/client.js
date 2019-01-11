import './bootstrap';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { StylesProvider } from '@material-ui/styles';

import App from './App';
import createStore from './store/createStore';
import registerServiceWorker from './registerServiceWorker';

const { store, history } = createStore();

hydrate(
  <Provider store={store}>
    <StylesProvider>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </StylesProvider>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    hydrate(
      <Provider store={store}>
        <StylesProvider>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </StylesProvider>
      </Provider>,
      document.getElementById('root')
    );
  });
}

registerServiceWorker(store);
