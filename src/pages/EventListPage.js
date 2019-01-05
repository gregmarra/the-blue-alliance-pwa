// General
import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import hoistNonReactStatics from 'hoist-non-react-statics';

// Actions
import { fetchYearEvents } from '../actions'

// Selectors
import { getYear } from '../selectors/CommonPageSelectors'
import { getSortedEvents } from '../selectors/EventListPageSelectors'

// Components
import Typography from '@material-ui/core/Typography'

// TBA Components
import TBAPage from '../components/TBAPage'

const mapStateToProps = (state, props) => ({
  year: getYear(state, props),
  events: getSortedEvents(state, props),
});

const mapDispatchToProps = (dispatch) => ({
  fetchYearEvents: (year) => dispatch(fetchYearEvents(year)),
});

const styles = theme => ({
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

  render() {
    const { year, events } = this.props

    return (
      <TBAPage
        title={`${year} Events`}
        metaDescription={`${year} season FIRST Robotics Competition events list`}
        refreshFunction={this.refreshFunction}
      >
        <Typography variant='h4' gutterBottom>{year} <i>FIRST</i> Robotics Competition Events</Typography>
        {events && events.map(event => <div key={event.key}>{event.key}</div>)}
      </TBAPage>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(hoistNonReactStatics(withStyles(styles)(EventListPage), EventListPage));
