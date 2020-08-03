import { observable, flow, action } from 'mobx'
import { persist } from 'mobx-persist'

import { setApiAuth } from '~/src/services/api'
import sessionService from '~/src/services/session'

export default class SessionStore {
  @persist @observable accessToken = null
  @observable.ref user = null
  @observable processing = false

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action setAccessToken = ({ accessToken }) => {
    this.accessToken = accessToken
    setApiAuth(this.accessToken)
  }

  login = flow(function* ({ email, password }) {
    if (this.processing) return null
    this.processing = true
    try {
      const response = yield sessionService.login(email, password)
      if (response.ok) {
        this.setAccessToken(response.data)
        yield this.current()
        return response.data
      }
      throw new Error(response)
    } finally {
      this.processing = false
    }
  }).bind(this)

  current = flow(function* () {
    try {
      const response = yield sessionService.session()
      if (response.ok) {
        const user = response.data
        this.user = user

        return user
      }
      return null
    } catch (error) {
      throw new Error(error)
    }
  }).bind(this)

}
