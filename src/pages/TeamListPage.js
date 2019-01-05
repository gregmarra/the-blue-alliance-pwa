// General
import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/styles'
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

class TeamListPage extends PureComponent {
  render() {
    return (
      <TBAPage title='Teams'>
        <Typography variant='h4' gutterBottom>Teams</Typography>
      </TBAPage>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TeamListPage))
