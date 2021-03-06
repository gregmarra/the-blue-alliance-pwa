import React from 'react';
import { Route } from 'react-router-dom'

import TBAThemeProvider from './components/TBAThemeProvider';
import TBANav from './components/TBANav';
import TBASnackbars from './components/TBASnackbars';
import ModalRouteSwitch from './components/ModalRouteSwitch';
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
          <React.Fragment>
            <TBANav />
            <TBASnackbars />
            <Route component={ModalRouteSwitch} />
          </React.Fragment>
        }
      </TBAThemeProvider>
    );
  }
}


export default App;
