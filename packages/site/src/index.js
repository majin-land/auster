import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'

import { appRoot } from './utils/helper'
import muiTheme from './theme'
import App from './application'

const theme = createMuiTheme(muiTheme)

ReactDOM.render((
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <App />
    </Router>
  </ThemeProvider>
), appRoot)

if (module.hot) {
  module.hot.accept()
}
