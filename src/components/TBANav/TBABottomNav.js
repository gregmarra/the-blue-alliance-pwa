import React from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import Paper from '@material-ui/core/Paper'
import HomeIcon from '@material-ui/icons/Home'
import EventIcon from '@material-ui/icons/Event'
import PeopleIcon from '@material-ui/icons/People'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import TBANavMoreMenu from './TBANavMoreMenu'

const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: theme.zIndex.appBar,
  },
})

class TBABottomNav extends React.PureComponent {
  state = {
    moreMenuOpen: false,
    anchorEl: null,
  }

  handleNavChange = (event, value) => {
    if (value !== 'more') {
      if (value === 'home') {
        this.props.push('/')
      } else {
        this.props.push(`/${value}`)
      }
    }
  }

  handleOpen = event => {
    this.setState({ moreMenuOpen: true, anchorEl: findDOMNode(this.moreRef) })
  }

  handleClose = () => {
    this.setState({ moreMenuOpen: false })
  }

  render() {
    const { classes, promptSignInOpen } = this.props

    return (
      <Paper className={classes.root} elevation={12}>
        <BottomNavigation
          value={this.props.navValue}
          onChange={this.handleNavChange}
          showLabels
        >
          <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Events" value="events" icon={<EventIcon />} />
          <BottomNavigationAction label="Teams" value="teams" icon={<PeopleIcon />} />
          <BottomNavigationAction label="More" value="more" icon={<MoreHorizIcon />}
            onClick={this.handleOpen} ref={el => this.moreRef = el} />
        </BottomNavigation>
        <TBANavMoreMenu
          open={this.state.moreMenuOpen}
          handleClose={this.handleClose}
          anchorEl={this.state.anchorEl}
          promptSignInOpen={promptSignInOpen}
        />
      </Paper>
    )
  }
}

TBABottomNav.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state, props) => ({
  navValue: state.getIn(['appState', 'navValue']),
})

const mapDispatchToProps = (dispatch) => ({
  push: (path) => dispatch(push(path)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TBABottomNav))
