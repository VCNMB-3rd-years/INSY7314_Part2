import api from '../interfaces/axiosInstance.js' //call in axios interface

export const getPendingPayments = () => api.get('/payments')
export const getCustomerPayments = () => api.get('/payments/customer')
export const createPayment = (payment) => api.post('/payments/', payment)
export const registerCustomer = (customer) => api.post('/customer/register', customer)
export const loginCustomer = (customer) => api.post('/customer/login', customer)
export const loginEmployee = (employee) => api.post('/employee/loginEmployee', employee)