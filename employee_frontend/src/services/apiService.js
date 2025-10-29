import api from '../interfaces/axiosInstance.js' //call in axios interface

export const getPendingPayments = () => api.get('/payments')
export const getProcessedPayments = () => api.get('/paymentHistory')
export const registerEmployee = (employee) => api.post('/employee/registerEmployee', employee)
export const loginCustomer = (customer) => api.post('/customer/login', customer)
export const loginEmployee = (employee) => api.post('/employee/loginEmployee', employee)