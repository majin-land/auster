import 'core-js/stable'
import 'mobx-react/batchingForReactDom'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import { syncHistoryWithStore } from 'mobx-react-router'
import { createBrowserHistory } from 'history'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'

import muiTheme from './theme'

import { appRoot } from './utils/helper'
import { rootStore } from './stores'
import App from './application'

const browserHistory = createBrowserHistory()
const history = syncHistoryWithStore(browserHistory, rootStore.routing)

const theme = createMuiTheme(muiTheme)

ReactDOM.render((
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router history={history}>
      <App />
    </Router>
  </ThemeProvider>
),
appRoot)

if (module.hot) {
  module.hot.accept()
}
