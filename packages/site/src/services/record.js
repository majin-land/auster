import { api } from './api'

export const fetchRecord = ({ startDate, endDate }) => api.get(`/record/${startDate}/${endDate}`)
export const addRecord = record => api.post('/record', record)
export const deleteRecord = id => api.delete(`record/${id}`)
export const updateRecord = record => api.put(`/record/${record.id}`, record)
