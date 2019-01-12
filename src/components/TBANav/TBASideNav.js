import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { withStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { toggleTheme } from '../../actions'
// import { withFirebase } from 'react-redux-firebase'

import HomeIcon from '@material-ui/icons/Home'
import StarIcon from '@material-ui/icons/Star'
import VideocamIcon from '@material-ui/icons/Videocam'
import EventIcon from '@material-ui/icons/Event'
import PeopleIcon from '@material-ui/icons/People'
// import PersonIcon from '@material-ui/icons/Person'

// import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import LinearProgress from '@material-ui/core/LinearProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
// import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

// Set defaults so tests don't fail
let BUILD_TIME;
let GIT_HASH;
try {
  BUILD_TIME = __BUILD_TIME__;
  GIT_HASH = __GIT_HASH__;
} catch {
  BUILD_TIME = '';
  GIT_HASH = ''
}

const styles = theme => ({
  root:  {
    zIndex: 1,
    position: 'absolute',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 190,
    marginTop: 64,
    overflowY: 'auto',
    height: '100%',
  },
  activeIcon: {
    color: theme.palette.primary.main,
  },
  activeText: {
    fontWeight: 500,
  },
  buildInfo: {
    padding: theme.spacing.unit,
  },
})

class TBASideNavContent extends PureComponent {
  render() {
    const {
      classes,
      // auth,
      navValue,
      toggleTheme,
      darkTheme,
      // apiEnabled,
      // idbEnabled,
      // toggleAPI,
      // toggleIDB,
      // promptSignInOpen,
    } = this.props

    return (
    <Drawer className={classes.root} variant="permanent">
      <div className={classes.content}>
        <div>
          <List component='div'>
            <ListItem button component={Link} to="/">
              <ListItemIcon className={classNames({[classes.activeIcon]: navValue === 'home'})}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" classes={{primary: classNames({[classes.activeText]: navValue === 'home'})}}/>
            </ListItem>
            <ListItem button component={Link} to="/mytba">
              <ListItemIcon className={classNames({[classes.activeIcon]: navValue === 'mytba'})}>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="myTBA" classes={{primary: classNames({[classes.activeText]: navValue === 'mytba'})}}/>
            </ListItem>
            <ListItem button component={Link} to="/gameday">
              <ListItemIcon className={classNames({[classes.activeIcon]: navValue === 'gameday'})}>
                <VideocamIcon />
              </ListItemIcon>
              <ListItemText primary="GameDay" classes={{primary: classNames({[classes.activeText]: navValue === 'gameday'})}}/>
            </ListItem>
            <ListItem button component={Link} to="/events">
              <ListItemIcon className={classNames({[classes.activeIcon]: navValue === 'events'})}>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Events" classes={{primary: classNames({[classes.activeText]: navValue === 'events'})}}/>
            </ListItem>
            <ListItem button component={Link} to="/teams">
              <ListItemIcon className={classNames({[classes.activeIcon]: navValue === 'teams'})}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Teams" classes={{primary: classNames({[classes.activeText]: navValue === 'teams'})}}/>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListSubheader>Temp for testing</ListSubheader>
            <ListItem>
              <ListItemText primary={darkTheme ? "Dark Theme" : "Light Theme"} />
              <ListItemSecondaryAction>
                <Switch
                  onClick={toggleTheme}
                  checked={!darkTheme}
                />
              </ListItemSecondaryAction>
            </ListItem>
            {/*<ListItem>
              <ListItemText primary={apiEnabled ? "API Enabled" : "API Disabled"} />
              <ListItemSecondaryAction>
                <Switch
                  onClick={toggleAPI}
                  checked={apiEnabled}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary={idbEnabled ? "IDB Enabled" : "IDB Disabled"} />
              <ListItemSecondaryAction>
                <Switch
                  onClick={toggleIDB}
                  checked={idbEnabled}
                />
              </ListItemSecondaryAction>
            </ListItem>*/}
            <ListItem disableGutters>
              <LinearProgress style={{width: '100%'}}/>
            </ListItem>
          </List>
          <Divider />
          {/*<List component='div'>
            {auth.isEmpty ?
              <ListItem
                button
                component='div'
                onClick={promptSignInOpen}
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='Sign In' />
              </ListItem>
              :
              <ListItem
                button
                component={Link}
                to='/account'
              >
                <ListItemAvatar>
                  <Avatar>
                    {auth.isEmpty ? <PersonIcon /> : <Avatar alt={auth.displayName} src={auth.photoURL} />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='Account' classes={{primary: classNames({[classes.activeText]: navValue === 'account'})}} />
              </ListItem>
            }
          </List>*/}
        </div>
        <div>
          <Divider />
          <div className={classes.buildInfo}>
            <Typography variant='caption' noWrap>
              Build: <a
                href={`https://github.com/the-blue-alliance/the-blue-alliance-pwa/commit/${GIT_HASH}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {GIT_HASH}
              </a>
            </Typography>
            <Typography variant='caption'>
              {BUILD_TIME} UTC
            </Typography>
          </div>
        </div>
      </div>
    </Drawer>
    )
  }
}

const mapStateToProps = (state, props) => ({
  navValue: state.getIn(['appState', 'navValue']),
  darkTheme: state.getIn(['appState', 'darkTheme']),
  // apiEnabled: state.getIn(['appState', 'apiEnabled']),
  // idbEnabled: state.getIn(['appState', 'idbEnabled']),
  // auth: state.get('firebase').auth,
});

const mapDispatchToProps = (dispatch) => ({
  toggleTheme: () => dispatch(toggleTheme()),
  // toggleAPI: () => dispatch(toggleAPI()),
  // toggleIDB: () => dispatch(toggleIDB()),
});

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withFirebase(withStyles(styles)(TBASideNavContent)))
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TBASideNavContent))
