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

class TeamPage extends PureComponent {
  render() {
    const { classes } = this.props

    return (
      <TBAPage title='Team XXX - NICKNAME (YEAR)'>
        <Typography variant='h4' gutterBottom>Team XXX - NICKNAME</Typography>
      </TBAPage>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TeamPage))
