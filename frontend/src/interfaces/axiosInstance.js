import axios from 'axios' //imports axios to connect to api

const axiosInstance = axios.create({
    baseURL: 'https://localhost:3002/v1',
    headers: {
        'Content-Type': 'application/json'
    },
})

export default axiosInstance