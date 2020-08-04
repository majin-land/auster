import { api } from './api'

export const session = () => api.get('/session')
export const login = ({ email, password }) => api.post('/session', { email, password })
export const register = params => api.post('/session/register', params)
export const logout = () => api.delete('/session')
