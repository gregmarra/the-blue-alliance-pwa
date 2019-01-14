import { matchPath } from 'react-router-dom';
import { LOCATION_CHANGE } from 'connected-react-router';
import { setNav } from '../actions';
import routes from '../routes';

export const navValueMiddleware = store => next => action => {
  next(action);
  if (action.type === LOCATION_CHANGE) {
    const path = store.getState().getIn(['router', 'location', 'pathname']);
    let navValue = null;
    routes.forEach((route, index) => {
      const match = matchPath(path, route.path, route);
      if (match && (!route.exact || match.isExact) && route.navValue) {
        navValue = route.navValue;
      }
    });
    store.dispatch(setNav(navValue));
  }
}
