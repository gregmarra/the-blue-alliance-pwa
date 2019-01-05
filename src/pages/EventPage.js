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

class EventPage extends PureComponent {
  render() {
    return (
      <TBAPage title='EVENT NAME'>
        <Typography variant='h4' gutterBottom>EVENT NAME</Typography>
      </TBAPage>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(EventPage))
