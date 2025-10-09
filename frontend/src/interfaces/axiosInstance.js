import axios from 'axios' //imports axios to connect to api
import { useAuth } from '../context/authContext'

const axiosInstance = axios.create({
    baseURL: 'https://localhost:3003/v1',
    headers: {
        'Content-Type': 'application/json'
    },
})

export const setAuthToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`; //passes token through authorization header to api call
    } else {
        delete axiosInstance.defaults.headers.Authorization;
    }
};

export default axiosInstance