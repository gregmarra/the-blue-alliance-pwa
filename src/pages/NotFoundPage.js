import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/styles'
import { connect } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import TBAPage from '../components/TBAPage'

const styles = theme => ({
  paper: {
    margin: theme.spacing.unit * 5,
    padding: theme.spacing.unit * 5,
  },
  logo: {
    float: 'right',
  },
})

class NotFoundPage extends PureComponent {
  constructor(props) {
    super(props)
    if (props.staticContext) {
      props.staticContext.statusCode = 404
    }
  }

  render() {
    const { classes } = this.props

    return (
      <TBAPage
        title='404 - Page Not Found'
      >
        <Paper className={classes.paper}>
          <Grid container spacing={24}>
            <Grid item xs={12} md={7}>
              <Typography variant='h2' gutterBottom>Oh Noes!1!!</Typography>
              <Typography variant='h4' gutterBottom>Error 404</Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography>Sorry, we couldn't find the thing you were looking for. Try searching for it.</Typography>
              TODO PUT SEARCHBOX HERE
            </Grid>
          </Grid>
        </Paper>
      </TBAPage>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(NotFoundPage))
