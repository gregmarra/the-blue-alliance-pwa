import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';

import TBAThemeProvider from './components/TBAThemeProvider';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';

class App extends React.Component {
  state = { hasError: false }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  componentDidCatch(error, info) {
    // TODO: Report error
    this.setState({ hasError: true })
  }

  render() {
    return (
      <TBAThemeProvider>
        {this.state.hasError ?
          <ErrorPage />
          :
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact component={NotFoundPage} />
          </Switch>
        }
      </TBAThemeProvider>
    );
  }
}


export default App;
