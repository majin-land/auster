import { create } from 'mobx-persist'
import { RouterStore } from 'mobx-react-router'

import SessionStore from './session'

class RootStore {
  constructor() {
    this.routing = new RouterStore()
    this.sessionStore = new SessionStore()
  }
}

const hydrate = create({
  storage: localStorage,
  jsonify: true,
})

const _rootStore = new RootStore()
export const rootStore = _rootStore

export const hydrateAll = () => {
  return Promise.all([
    hydrate('session', _rootStore.sessionStore),
  ])
}
