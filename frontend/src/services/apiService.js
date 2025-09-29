import axios from '../interfaces/axiosInstance.js' //call in axios interface

export const getPendingPayments = () => axios.get('/payments')