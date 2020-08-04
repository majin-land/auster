import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Login from './pages/session/index'
import Register from './pages/session/register'

import Record from './pages/record/index'

export const RoutesNotLoggedIn = () => (
  <Switch>
    <Route path="/register" component={Register} />
    <Route component={Login} />
  </Switch>
)

export const RoutesLoggedIn = () => (
  <Switch>
    <Route component={Record} />
  </Switch>
)
