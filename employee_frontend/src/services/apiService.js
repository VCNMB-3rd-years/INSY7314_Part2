import api from '../interfaces/axiosInstance.js' //call in axios interface

export const getPendingPayments = () => api.get('/payments')
export const getProcessedPayments = () => api.get('/payments/paymentHistory')
export const verifyPayment = (id) => api.put(`/payments/${id}/verify`)
export const rejectPayment = (id) => api.put(`/payments/${id}/reject`)
export const registerEmployee = (employee) => api.post('/employee/registerEmployee', employee)
export const loginAdmin = (admin) => api.post('/admin/login', admin);
export const loginEmployee = (employee) => api.post('/employee/loginEmployee', employee)
export const getAllEmployees = () => api.get('/employee/viewAllEmployees')
export const deleteEmployeeApi = (username) => api.delete('/admin/deleteEmployee', { data: { username } })
export const getCurrentAdmin = () => api.get('/admin/current')
export const getCurrentUser = () => api.get('/auth/current')