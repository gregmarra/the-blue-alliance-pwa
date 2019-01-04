import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

export default (history) => combineReducers({
  router: connectRouter(history),
});
