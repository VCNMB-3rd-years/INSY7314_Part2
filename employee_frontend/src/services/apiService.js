import api from '../interfaces/axiosInstance.js' //call in axios interface

export const getPendingPayments = () => api.get('/payments')
export const getProcessedPayments = () => api.get('/paymentHistory')
export const verifyPayment = (id) => api.get(`/${id}/verify`)
export const rejectPayment = (id) => api.get(`/${id}/reject`)
export const registerEmployee = (employee) => api.post('/employee/registerEmployee', employee)
export const loginAdmin = (admin) => api.post('/admin/login', admin);
export const loginEmployee = (employee) => api.post('/employee/loginEmployee', employee)