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
async function refreshCsrfToken() {
    try {
        const res = await fetch('https://localhost:3002/v1/csrf-token', {
            credentials: 'include'
        })
        if (!res.ok) {
            return res.error
        }
        const data = await res.json()
        if (data && data.csrfToken) { //if successful, set token as a default header for axios
            api.defaults.headers.common['X-CSRF-Token'] = data.csrfToken
            return data.csrfToken
        }
    } catch (error) {
        console.log('refreshCsrfToken error', error)
        return null
    }
}

//if a request fails with 403, try to refresh the csrf token and retry request (in case csrf didnt refresh)
api.interceptors.response.use(
    response => response,
    async (error) => {
        const { config, response } = error
        if (response && response.status === 403 && !config._retry) {
            config._retry = true
            const token = await refreshCsrfToken()
            if (token) {
                config.headers = config.headers || {}
                config.headers['X-CSRF-Token'] = token
                return api(config)
            }
        }
        return Promise.reject(error)
    }
)

export default api