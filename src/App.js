import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './pages/Home';

import TBAThemeProvider from './components/TBAThemeProvider';

class App extends React.Component {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    return (
      <TBAThemeProvider>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </TBAThemeProvider>
    );
  }
}


export default App;
