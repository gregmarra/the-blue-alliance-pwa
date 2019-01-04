import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import appState from './appState'

export default (history) => combineReducers({
  appState,
  router: connectRouter(history),
});
