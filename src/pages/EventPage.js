// General
import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import hoistNonReactStatics from 'hoist-non-react-statics';

// Actions
import { resetPage, setPageState, fetchEventInfo } from '../actions'

// Selectors
import { getStatusCode } from '../selectors/CommonPageSelectors'
import { getEventKey, getEventModel } from '../selectors/EventPageSelectors'

// Components
import Typography from '@material-ui/core/Typography'

// TBA Components
import TBAPage from '../components/TBAPage'
import NotFoundPage from './NotFoundPage'

const mapStateToProps = (state, props) => ({
  statusCode: getStatusCode(state, props),
  eventKey: getEventKey(state, props),
  event: getEventModel(state, props),
});

const mapDispatchToProps = (dispatch) => ({
  resetPage: (defaultState) => dispatch(resetPage(defaultState)),
  setPageState: (state) => dispatch(setPageState(state)),
  fetchEventInfo: (eventKey) => dispatch(fetchEventInfo(eventKey)),
});

const styles = theme => ({
})

class EventPage extends PureComponent {
  static getInitialData({ dispatch, state, props }) {
    return Promise.all([
      dispatch(fetchEventInfo(getEventKey(state, props))),
    ])
  }

  refreshFunction = () => {
    this.props.fetchEventInfo(this.props.eventKey)
  }

  constructor(props) {
    super(props);
    this.props.resetPage({});
  }

  render() {
    if (this.props.statusCode === 404) {
      return  <NotFoundPage {...this.props} />
    }

    const { event } = this.props;

    let name = null;
    let year = null;
    if (event) {
      year = event.year;
      name = `${event.name} (${year})`;
    }

    return (
      <TBAPage
        title={name}
        metaDescription={event && `Videos and match results for the ${year} ${event.name} FIRST Robotics Competition in ${event.getCityStateCountry()}.`}
        refreshFunction={this.refreshFunction}
      >
        <Typography variant='h4' gutterBottom>{name}</Typography>
      </TBAPage>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(hoistNonReactStatics(withStyles(styles)(EventPage), EventPage))
