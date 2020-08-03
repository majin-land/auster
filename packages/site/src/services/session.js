import { api } from './api'

export default {
  login: (email, password) => api.post('/session/login', { email, password }),
  register: register => api.post('/session/register', register),
  session: () => api.get('/session'),
}
