import { api } from './api'

export const fetchCategory = () => api.get('/category')
export const addCategory = ({ name, type }) => api.post('/category', { name, type })
