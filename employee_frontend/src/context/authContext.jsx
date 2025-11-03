//need required imports
import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { setAuthToken, api } from '../interfaces/axiosInstance.js'

//create the section of memory first for remembering if user is logged in
const AuthContext = createContext()

//check if the user's token in HTTP only cookie is valid
const checkAuthStatus = async () => {
    try {
        //using protected route to test if valid token is stored
        await api.get('/payments'); 
        
        //if request has status 200 for success, token was valid
        return true; 
    } catch (error) {
        //if 401 or 403 returns, the token is invalid
        return false;
    }
};

export function AuthProvider({children}) { //any child object this method has to interact with
    const [isAuthenticated, setIsAuthenticated] = useState(false) //boolean variable tracking if user was authenticated and logged in (Bajgain, 2025)
    const [isLoading, setIsLoading] = useState(true); //for checking for valid tokens
    const [token, setToken] = useState(null) //start it as empty
    const [userRole, setUserRole] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => { 
        const loadUser = async () => {
            const status = await checkAuthStatus();
            
            if (status) { //if valid token
                setIsAuthenticated(true); //authenticate user
            } else {
                await logout(); //else logout
            }
            
            setIsLoading(false); // stop loading after check
        };
        
        loadUser();
    }, []);

    const login = async (newToken, role, isSuper) => { 
        setIsAuthenticated(true) //(Bajgain, 2025)
        setToken(newToken) //set the value of the token with the new passed in token (Bajgain, 2025)
        setUserRole(role);
        setIsSuperAdmin(isSuper);
    }
    
    const logout = async () => {
        try {
           await api.post('/employee/logout');
           setIsAuthenticated(false); //(Bajgain, 2025)
           setToken(null); //(Bajgain, 2025)
           setUserRole(null);
           setIsSuperAdmin(false);

           console.log("Logout was successful and session has been cleared!");
        } catch (error) {
            setIsAuthenticated(false); //(Bajgain, 2025)
           setToken(null); //(Bajgain, 2025)
           setUserRole(null);
           setIsSuperAdmin(false);
            console.error("Logout failed:", error.message);
        }
    }

    useEffect(() => { //sets up token value in axios as it chanegs
        setAuthToken(token); //(Bajgain, 2025)
    }, [token]);

    if (isLoading) {
        return <div>Loading...</div>; //slows redirect down before token is validated
    }

    return (
        //providing ino from this context to the rest of the app to check status anywhere as needed with handling login and logout on the pages //(Arya, 2023)
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout, isSuperAdmin, userRole }}> 
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext) //whenever useAuth is called it will use authContext file

/* REFERENCES
    Arya, S. 28 May 2023. JWT Authentication in React with react-router. [Online]. Avaialable at: <https://dev.to/sanjayttg/jwt-authentication-in-react-with-react-router-1d03> [Accessed 9 October 2025]
    Bajgain, D. 2 January 2025. JWT Authentication and Authorization in React. [Online]. Available at: <https://towardsdev.com/jwt-authentication-and-authorization-in-react-254066a738eb> [Accessed 9 October 2025]

*/