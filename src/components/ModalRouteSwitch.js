import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { setPageKey } from '../actions'
import routes from '../routes';

class ModalRouteSwitch extends React.Component {
  state = {
    modalOpen: false,
  }
  basePageLocation = this.props.location
  modalKeyDepths = {}
  modalBaseLocations = {}  // Keeps track of what base page was showing for a given modal
  initialKey = null

  constructor(props) {
    super(props)
    this.initialKey = props.location.key
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const { location } = this.props
    const { location: nextLocation, history: nextHistory } = nextProps

    // Restore base page location
    if (
      nextHistory.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.basePageLocation = location
    } else {
      const loc = this.modalBaseLocations[nextLocation.key]
      if (loc) {
        this.basePageLocation = loc
      }
    }

    if (nextLocation.key !== location.key && nextHistory.action === 'PUSH') {
      // Keep track of modal depth
      if (location.state && location.state.modal) {
        if (location.key in this.modalKeyDepths) {
          this.modalKeyDepths[nextLocation.key] = this.modalKeyDepths[location.key] + 1
        } else {
          this.modalKeyDepths[nextLocation.key] = 1
        }
      } else {
        this.modalKeyDepths[nextLocation.key] = 1
      }

      // Keep track of base page location
      if (nextLocation.state && nextLocation.state.modal) {
        if (location.state && location.state.modal && this.modalBaseLocations[location.key]) {
          this.modalBaseLocations[nextLocation.key] = this.modalBaseLocations[location.key]
        } else {
          this.modalBaseLocations[nextLocation.key] = location
        }
      }
    }

    // Set modalOpen state
    const nextIsModal = (
      nextLocation.state &&
      nextLocation.state.modal &&
      this.initialKey !== nextLocation.key
    )
    if (nextIsModal && !this.state.modalOpen) {
      requestAnimationFrame(() => this.setState({modalOpen: true}))
      this.props.setPageKey(this.basePageLocation.key)
    }
    if (!nextIsModal && this.state.modalOpen) {
      // Set synchronously to ensure modal is closed after navigation
      this.setState({modalOpen: false})
    }
  }

  handleClose = () => {
    requestAnimationFrame(() => this.setState({modalOpen: false}))
    this.props.history.go(-this.modalKeyDepths[this.props.location.key])
  }

  render() {
    const { location } = this.props
    const isModal = (
      location.state !== undefined &&
      location.state.modal &&
      this.initialKey !== location.key
    )

    // Set key to force remount when route changes
    return (
      <React.Fragment key={isModal ? this.basePageLocation.key : location.key}>
        <Switch location={isModal ? this.basePageLocation : location}>
          {routes.map(({ path, component, exact }, i) =>
            <Route key={i} exact={exact} path={path} component={component} />
          )}
        </Switch>
        {/*<TBAModalDialog isModal={isModal && !Boolean(location.state.searchModal)} open={this.state.modalOpen} handleClose={this.handleClose} />*/}

        {/*
        <SearchModal isModal={isModal && Boolean(location.state.searchModal)} open={this.state.modalOpen} handleClose={this.handleClose} />
        */}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, props) => ({
})

const mapDispatchToProps = (dispatch) => ({
  setPageKey: basePageKey => dispatch(setPageKey(basePageKey)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalRouteSwitch);
