// import Loadable from 'react-loadable';
import HomePage from './pages/HomePage';
import EventListPage from './pages/EventListPage';
import EventPage from './pages/EventPage';
import MatchPage from './pages/MatchPage';
import TeamListPage from './pages/TeamListPage';
import TeamPage from './pages/TeamPage';
import NotFoundPage from './pages/NotFoundPage';

//const HomePage = Loadable({
//  loader: () => import(/* webpackChunkName: "HomePage"*/ './pages/HomePage'),
//  loading: () => null,
//  modules: ['HomePage'],
//});
// const NotFoundPage = Loadable({
//   loader: () => import(/* webpackChunkName: "NotFoundPage"*/ './pages/NotFoundPage'),
//   loading: () => null,
//   modules: ['NotFoundPage'],
// });

export default [
  {
    path: '/',
    component: HomePage,
    exact: true,
    navValue: 'home',
  },
  {
    path: '/events/:year?',
    component: EventListPage,
    exact: true,
    navValue: 'events',
  },
  {
    path: '/event/:eventKey',
    component: EventPage,
    exact: true,
  },
  {
    path: '/match/:matchKey',
    component: MatchPage,
    exact: true,
  },
  {
    path: '/teams',
    component: TeamListPage,
    exact: true,
    navValue: 'teams',
  },
  {
    path: '/team/:teamNumber/:year?',
    component: TeamPage,
    exact: true,
  },
  {
    component: NotFoundPage,
    exact: true,
  },
]
