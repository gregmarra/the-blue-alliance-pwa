import moment from 'moment'

export const getCurrentYear = (state) => {
  const year = state.getIn(['models', 'config', 'byKey', 'API_STATUS', 'current_season'])
  return year ? year : moment().year()
}

export const getYear = (state, props) => {
  if (props.year) {
    return props.year
  }
  if (props.eventKey) {
    return parseInt(props.eventKey.substring(0, 4), 10)
  }
  if (props.match && props.match.params && props.match.params.year) {
    return parseInt(props.match.params.year, 10)
  }
  return getCurrentYear(state)
}
