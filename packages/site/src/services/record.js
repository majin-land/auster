import { api } from './api'

export const fetchRecord = () => api.get('/record')
export const addRecord = record => api.post('/record', record)
