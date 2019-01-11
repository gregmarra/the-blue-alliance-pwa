import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/styles'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import NoSsr from '@material-ui/core/NoSsr'
import Snackbar from '@material-ui/core/Snackbar'

import CloseIcon from '@material-ui/icons/Close'

import { openSnackbar, closeSnackbar } from '../actions'

const styles = theme => ({
})

class TBASnackbars extends React.PureComponent {
  state = {
    dialog: null,
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.props.closeSnackbar()
  }

  closeSnackbarAndOpenDialog = () => {
    this.props.closeSnackbar()
    this.setState({dialog: this.props.snackbar})
  }

  handleDialogClose = () => {
    this.setState({dialog: null})
  }

  render() {
    const { snackbar } = this.props;
    return (
      <NoSsr defer>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackbar === 'readyForOffline'}
          onClose={this.handleSnackbarClose}
          message={<span>Ready for use offline!</span>}
          action={[
            <Button key="info" color="secondary" onClick={this.closeSnackbarAndOpenDialog}>
              More Info
            </Button>,
            <IconButton
              key="close"
              color="inherit"
              onClick={this.handleSnackbarClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
        <Dialog
          open={this.state.dialog === 'readyForOffline'}
          onClose={this.handleDialogClose}
        >
          <DialogTitle>The Blue Alliance works offline!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Previously loaded content and data will work, even without internet.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary" autoFocus>
              Ok, Cool!
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackbar === 'newContentAvailable'}
          onClose={this.handleSnackbarClose}
          message={<span>The Blue Alliance has been updated! Please refresh for the latest content.</span>}
          action={[
            <Button key="refresh" color="secondary" onClick={() => window.location.reload()}>
              Refresh Now
            </Button>,
            <IconButton
              key="close"
              color="inherit"
              onClick={this.handleSnackbarClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </NoSsr>
    )
  }
}

TBASnackbars.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state, props) => ({
  snackbar: state.getIn(['appState', 'snackbar']),
});

const mapDispatchToProps = (dispatch) => ({
  openSnackbar: (value) => dispatch(openSnackbar(value)),
  closeSnackbar: () => dispatch(closeSnackbar()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TBASnackbars))
