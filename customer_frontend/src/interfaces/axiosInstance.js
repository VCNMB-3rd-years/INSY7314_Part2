import axios from 'axios' //imports axios to connect to api

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
  return api.post('/customer/logout', {}, { withCredentials: true });
};

//refresh csfr token by calling the backend endpoint 
export const refreshCsrfToken = async () => {
    const { data } = await api.get('/csrf-token'); //backend sets cookie snd returns token
    api.defaults.headers.common['X-CSRF-Token'] = data.csrfToken;
    return data.csrfToken;
}

//if a request fails with 403, try to refresh the csrf token and retry request (in case csrf didnt refresh)
api.interceptors.response.use(
    res => res,
    async err => {
        const { config, response } = err
        if (response?.status === 403 && !config._retry) {
            config._retry = true
            await refreshCsrfToken()
            return api(config)
        }
        return Promise.reject(err)
    }
)

export default api