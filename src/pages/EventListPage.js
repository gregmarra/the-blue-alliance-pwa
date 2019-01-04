// General
import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'

// Components
import Typography from '@material-ui/core/Typography'

// TBA Components
import TBAPage from '../components/TBAPage'

const mapStateToProps = (state, props) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

const styles = theme => ({
})

class EventListPage extends PureComponent {
  static getInitialData({ store }) {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('RESULT!');
      }, 1000);
    });

    return Promise.all([
      promise,
    ])
  }

  render() {
    const { classes } = this.props

    return (
      <TBAPage title='2019 Events'>
        <Typography variant='h4' gutterBottom>2019 Events</Typography>
      </TBAPage>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(EventListPage))
