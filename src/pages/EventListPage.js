// General
import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import hoistNonReactStatics from 'hoist-non-react-statics';

// Actions
import { resetPage, setPageState, fetchYearEvents } from '../actions'

// Selectors
import { getYear, getCurrentPageState } from '../selectors/CommonPageSelectors'
import { getSortedEvents } from '../selectors/EventListPageSelectors'

// Components
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

// TBA Components
import TBAPage from '../components/TBAPage'
import EventListCard from '../components/EventListCard'

const mapStateToProps = (state, props) => ({
  year: getYear(state, props),
  events: getSortedEvents(state, props),
  searchText: getCurrentPageState(state, props).get('searchText') || '',
});

const mapDispatchToProps = (dispatch) => ({
  resetPage: (defaultState) => dispatch(resetPage(defaultState)),
  setPageState: (state) => dispatch(setPageState(state)),
  fetchYearEvents: (year) => dispatch(fetchYearEvents(year)),
});

const styles = theme => ({
  sideNav: {
    position: 'sticky',
    top: 56 + theme.spacing.unit*4,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      top: 48 + theme.spacing.unit*4,
    },
    [theme.breakpoints.up('sm')]: {
      top: 64 + theme.spacing.unit*4,
    },
  },
  inputCard: {
    position: 'sticky',
    padding: theme.spacing.unit,
    margin: `0px ${-theme.spacing.unit}px ${theme.spacing.unit}px`,
    zIndex: 1,
    // maxWidth: theme.breakpoints.values.sm,
    top: 56,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      top: 48,
    },
    [theme.breakpoints.up('sm')]: {
      top: 64,
      margin: `0px auto ${theme.spacing.unit}px`,
    },
  },
  textField: {
    margin: 0,
  },
  list: {
    // maxWidth: theme.breakpoints.values.sm,
    margin: '0 auto',
    paddingBottom: theme.spacing.unit,
    [theme.breakpoints.up('sm')]: {
      padding: `0 ${theme.spacing.unit}px ${theme.spacing.unit*3}px`,
    },
  },
})

class EventListPage extends PureComponent {
  static getInitialData({ dispatch, match }) {
    return Promise.all([
      dispatch(fetchYearEvents(match.params.year)),
    ])
  }

  refreshFunction = () => {
    this.props.fetchYearEvents(this.props.year)
  }

  handleSearchFocus = e => {
    if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
      e.preventDefault();
      this.searchRef.current.focus();
    } else if (e.keyCode === 27) {
      this.searchRef.current.blur();
    }
  }

  handleTextFieldChange = e => {
    this.props.setPageState({searchText: e.target.value});
  }

  constructor(props) {
    super(props);
    this.props.resetPage({
      searchText: '',
    });
    this.searchRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleSearchFocus);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleSearchFocus);
  }

  render() {
    const { classes, year, events, searchText } = this.props

    return (
      <TBAPage
        title={`${year} Events`}
        metaDescription={`${year} season FIRST Robotics Competition events list`}
        refreshFunction={this.refreshFunction}
      >
        <Typography variant='h4' gutterBottom>{year} <i>FIRST</i> Robotics Competition Events</Typography>
        <Grid container spacing={16}>
          <Grid item xs={12} md={3} lg={2}>
            <div className={classes.sideNav}>
              TODO: YEAR PICKER & SECTIONS
            </div>
          </Grid>
          <Grid item xs={12} md={9} lg={10}>
            <Paper className={classes.inputCard} square>
              <TextField
                className={classes.textField}
                inputRef={this.searchRef}
                label='Search by name or location'
                fullWidth
                margin='normal'
                onChange={this.handleTextFieldChange}
                value={searchText}
              />
            </Paper>
            {events && <div className={classes.list}>
              <EventListCard
                events={events.filter(event =>
                  event.name.toLowerCase().includes(searchText.toLowerCase()) ||
                  event.getCityStateCountry().toLowerCase().includes(searchText.toLowerCase())
                )}
              />
            </div>}
          </Grid>
        </Grid>
      </TBAPage>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(hoistNonReactStatics(withStyles(styles)(EventListPage), EventListPage));
