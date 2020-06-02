// import { create } from 'mobx-persist'
import { RouterStore } from 'mobx-react-router'

class RootStore {
  constructor() {
    this.routing = new RouterStore()
  }
}

// const hydrate = create({
//   storage: localStorage,
//   jsonify: true,
// })

const _rootStore = new RootStore()
export const rootStore = _rootStore

export const hydrateAll = () => {
  return Promise.all([
    //
  ])
}
