import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import appState from './appState';
import models from './models';
import page from './page';

export default (history) => combineReducers({
  appState,
  models,
  page,
  router: connectRouter(history),
});
