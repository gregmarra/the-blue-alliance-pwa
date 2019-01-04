import React from 'react';

import Button from '@material-ui/core/Button';

import TBAPage from '../components/TBAPage';

class Home extends React.Component {
  render() {
    return (
      <TBAPage>
        <Button color='primary' variant='contained'>
          HELLO!
        </Button>
      </TBAPage>
    );
  }
}

export default Home;
