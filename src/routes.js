// import Loadable from 'react-loadable';
import HomePage from './pages/HomePage';
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
  },
  {
    component: NotFoundPage,
    exact: true,
  },
]
