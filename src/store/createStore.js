import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router/immutable';
import thunk from 'redux-thunk';
import { createBrowserHistory, createMemoryHistory } from 'history';
import createRootReducer from '../reducers';
import { isServer } from '../utils';
import preloadState from './preloadState';
import { navValueMiddleware } from './middleware';

export default (url = '/') => {
  // Create a history depending on the environment
  const history = isServer
    ? createMemoryHistory({
        initialEntries: [url]
      })
    : createBrowserHistory();

  const enhancers = [];

  // Dev tools are helpful
  if (process.env.NODE_ENV === 'development' && !isServer) {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  const composedEnhancers = compose(
    applyMiddleware(
      thunk,
      routerMiddleware(history),
      navValueMiddleware,
    ),
    ...enhancers
  );

  // Use preloaded state from server if it exists
  const initialState = preloadState();

  // Create the store
  const store = createStore(
    createRootReducer(history),
    initialState,
    composedEnhancers
  );

  return {
    store,
    history,
  };
};
