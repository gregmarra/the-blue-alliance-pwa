import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import appState from './appState';
import models from './models';

export default (history) => combineReducers({
  appState,
  models,
  router: connectRouter(history),
});
