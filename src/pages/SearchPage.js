// General
import React, { PureComponent } from 'react'
import { Redirect } from 'react-router'
import { withStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import hoistNonReactStatics from 'hoist-non-react-statics';
import queryString from 'query-string'

// Components
import Typography from '@material-ui/core/Typography'

// TBA Components
import TBAPage from '../components/TBAPage'

const mapStateToProps = (state, props) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

const styles = theme => ({
})

class SearchPage extends PureComponent {
  render() {
    const searchQuery = queryString.parse(this.props.location.search).q;
    if (/^\d+$/.test(searchQuery)) {
      return <Redirect to={`/team/${searchQuery}`} />
    }
    if (/^\d{4}[a-zA-Z\d]+$/.test(searchQuery)) {
      return <Redirect to={`/event/${searchQuery}`} />
    }
    return (
      <TBAPage title='Search'>
        <Typography variant='h4' gutterBottom>Search results for: {searchQuery}</Typography>
        <Typography>TODO</Typography>
      </TBAPage>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(hoistNonReactStatics(withStyles(styles)(SearchPage), SearchPage))
