import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withStyles } from '@material-ui/styles'

import Paper from '@material-ui/core/Paper'

import EventListItem from './EventListItem'

const styles = theme => ({
  eventListCard: {
    marginBottom: theme.spacing.unit*2,
  },
})

class EventListCard extends PureComponent {
  render() {
    const { classes, events } = this.props

    return (
      <Paper className={classes.eventListCard}>
        {events.map(event => {
          return <EventListItem key={event.key} event={event}/>
        })}
      </Paper>
    )
  }
}

EventListCard.propTypes = {
  classes: PropTypes.object.isRequired,
  events: ImmutablePropTypes.seq,
}

export default withStyles(styles)(EventListCard)