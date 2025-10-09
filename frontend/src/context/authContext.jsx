//need required imports
import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { setAuthToken } from '../interfaces/axiosInstance.js'

//create the section of memory first for remembering if user is logged in
const AuthContext = createContext()

export function AuthProvider({children}) { //any child object this method has to interact with
    const [isAuthenticated, setIsAuthenticated] = useState(false) //boolean variable tracking if user was authenticated and logged in
    const [token, setToken] = useState(null) //start it as empty

    const login = (newToken) => { 
      setIsAuthenticated(true) 
      setToken(newToken) //set the value of the token with the new passed in token
    }
    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
    }

    useEffect(() => { //sets up token value in axios as it chanegs
        setAuthToken(token);
    }, [token]);

    return (
        //providing ino from this context to the rest of the app to check status anywhere as needed with handling login and logout on the pages
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext) //whenever useAuth is called it will use authContext file