import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Login from './pages/session/index'

const RoutesNotLoggedIn = () => (
  <Switch>
    <Route component={Login} />
  </Switch>
)

export default RoutesNotLoggedIn
