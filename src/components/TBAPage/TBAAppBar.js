import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/styles'
import * as clipboard from 'clipboard-polyfill'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { goBack } from 'connected-react-router'

import AppBar from '@material-ui/core/AppBar'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import RefreshIcon from '@material-ui/icons/Refresh'
import SearchIcon from '@material-ui/icons/Search'
import ShareIcon from '@material-ui/icons/Share'
import Snackbar from '@material-ui/core/Snackbar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import TBALamp from '../../icons/tba_lamp.svg'
// import TBAAppBarSearch from './TBAAppBarSearch'

const styles = theme => ({
  appBarTitle: {
    flex: 1,
    fontWeight: theme.typography.h6.fontWeight,
    fontSize: theme.typography.h6.fontSize,
    lineHeight: theme.typography.h6.lineHeight,
    letterSpacing: theme.typography.h6.letterSpacing,
  },
  toolbar: {
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  logo: {
    height: 48,
    width: 48,
  },
  progress: {
    width: 48,
    height: 24,
    padding: 2,
    textAlign: 'center',
  },
})

class TBAAppBar extends PureComponent {
  state = {
    snackbarOpen: false,
    snackbarOpenedOnce: false,
  }

  handleClose = () => {
    this.setState({ snackbarOpen: false })
  }

  handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: document.URL,
      })
    } else {
      clipboard.writeText(document.URL)
      this.setState({ snackbarOpen: true, snackbarOpenedOnce: true })
    }
  }

  render() {
    const { classes, title } = this.props

    return (
      <AppBar>
        <Toolbar className={classes.toolbar} data-scroll-header>
          {title ?
            <IconButton
              color="inherit"
              onClick={this.props.goBack}
              aria-label="Back"
            >
              <ArrowBackIcon />
            </IconButton>
            :
            <img src={TBALamp} className={classes.logo} alt="logo" />
          }
          {typeof(title) === 'object' ?
            <div className={classes.appBarTitle}>
              {title}
            </div>
            :
            <Typography variant="h1" color="inherit" className={classes.appBarTitle} noWrap>
              {title ? title : 'The Blue Alliance'}
            </Typography>
          }
          {/*<Hidden smDown implementation="css">
            <TBAAppBarSearch />
          </Hidden>*/}
          <Hidden mdUp implementation="css">
            <IconButton
              color="inherit"
              component={Link}
              to={{pathname: '/search', state: {modal: true, searchModal: true}}}
              aria-label="Search"
            >
              <SearchIcon />
            </IconButton>
          </Hidden>
          {this.props.isLoading &&
            <div className={classes.progress}>
              <CircularProgress color="secondary" size={20} thickness={5}/>
            </div>
          }
          {!this.props.isLoading && this.props.refreshFunction &&
            <IconButton
              color="inherit"
              onClick={() => this.props.refreshFunction()}
              aria-label="Refresh"
            >
              <RefreshIcon />
            </IconButton>
          }
          <IconButton
            color="inherit"
            onClick={this.handleShare}
            aria-label="Share"
          >
            <ShareIcon />
          </IconButton>
        </Toolbar>
        {this.state.snackbarOpenedOnce && <Snackbar
          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
          open={this.state.snackbarOpen}
          onClose={this.handleClose}
          autoHideDuration={2000}
          message='Link copied!'
        />}
      </AppBar>
    )
  }
}

TBAAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state, props) => ({
  isLoading: state.getIn(['appState', 'loadingCount']) > 0,
})

const mapDispatchToProps = (dispatch) => ({
  goBack: () => dispatch(goBack()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TBAAppBar))
