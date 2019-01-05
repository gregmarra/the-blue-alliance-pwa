import React from 'react'
import { connect } from 'react-redux'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider, withStyles } from "@material-ui/styles"
import { createMuiTheme } from '@material-ui/core'

import amber from '@material-ui/core/colors/amber'
import indigo from '@material-ui/core/colors/indigo'

const createTheme = darkTheme => {
  return createMuiTheme({
    palette: {
      primary: indigo,
      secondary: amber,
      type: darkTheme ? 'dark' : 'light',
    },
    typography: {
      useNextVariants: true,
    },
  })
}

class TBAThemeProvider extends React.Component {
  state = {
    theme: createTheme(false)
  }

  componentDidMount() {
    this.setState({theme: createTheme(this.props.darkTheme)})
  }

  componentDidUpdate(prevProps) {
    if (prevProps.darkTheme !== this.props.darkTheme) {
      this.setState({theme: createTheme(this.props.darkTheme)})
    }
  }

  render() {
    const { children } = this.props
    return (
      <ThemeProvider theme={this.state.theme}>
        <CssBaseline />
        <TBAGlobalStyle />
        {children}
      </ThemeProvider>
    )
  }
}

const mapStateToProps = (state, props) => ({
  darkTheme: state.getIn(['appState', 'darkTheme']),
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(TBAThemeProvider)

const TBAGlobalStyle = withStyles((theme) => ({
  '@global': {
    body: {
      margin: 0,
      padding: 0,
      fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
      overscrollBehavior: 'contain',
    },
    a: {
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.light,
      textDecoration: 'none',
    },
    'a:hover': {
      textDecoration: 'underline',
    },
    // For hiding scrollbar on tabs. Doesn't work for Firefox
    '.hide-scrollbar ::-webkit-scrollbar': {
      display: 'none',
    },
    '.hide-scrollbar': {
      '-ms-overflow-style': 'none',
    },
    // For IE
    main: {
      display: 'block',
    },
  },
}))((props) => {
  return null
})
