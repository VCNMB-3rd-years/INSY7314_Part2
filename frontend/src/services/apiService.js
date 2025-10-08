import axios from '../interfaces/axiosInstance.js' //call in axios interface

export const getPendingPayments = () => axios.get('/payments')
export const createPayment = (payment) => axios.post('/payments/', payment)
export const registerCustomer = (customer) => axios.post('/customer/register', customer)
export const loginCustomer = (customer) => axios.post('/customer/login', customer)
export const loginEmployee = (employee) => axios.post('/employee/loginEmployee', employee)