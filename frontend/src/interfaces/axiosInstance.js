import axios from 'axios' //imports axios to connect to api
import { useAuth } from '../context/authContext'

export const api = axios.create({
    baseURL: 'https://localhost:3003/v1',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true //sends cookies automatically between back and frontend
})

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common[`Authorization`] = `Bearer ${token}`; //passes token through authorization header to api call
    } else {
        delete api.defaults.headers.common[`Authorization`];
    }
};

//LOGGING OUT WITH COOKIES SET UP
export const logoutCustomer = async () => {
  return axios.post('/customer/logout', {}, { withCredentials: true });
};

export default api