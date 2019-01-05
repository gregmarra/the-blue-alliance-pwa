// General
import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

// Components
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

// TBA Components
import TBAPage from '../components/TBAPage'

const mapStateToProps = (state, props) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
})

class HomePage extends PureComponent {
  render() {
    const { classes } = this.props

    return (
      <TBAPage>
        <Typography gutterBottom>The Blue Alliance is the best way to scout, watch, and relive the <em>FIRST</em> Robotics Competition.</Typography>
        <Typography gutterBottom>Welcome to a beta version of our new app!</Typography>

        <Typography gutterBottom>Handy links for testing:</Typography>
        <Button
          color='default'
          className={classes.button}
          variant='contained'
          component={Link}
          to='/team/254/2017'
        >
          254 in 2017
        </Button>
        <Button
          color='default'
          className={classes.button}
          variant='contained'
          component={Link}
          to='/team/254/2017#2017casj'
        >
          254 @ 2017casj
        </Button>
        <Button
          color='default'
          className={classes.button}
          variant='contained'
          component={Link}
          to='/event/2017casj'
        >
          2017casj
        </Button>
        <Button
          color='default'
          className={classes.button}
          variant='contained'
          component={Link}
          to='/match/2017casj_f1m2'
        >
          2017casj_f1m2
        </Button>
        <Button
          color='default'
          className={classes.button}
          variant='contained'
          component={Link}
          to='/team/191/2018'
        >
          191 in 2018
        </Button>
      </TBAPage>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(HomePage))
