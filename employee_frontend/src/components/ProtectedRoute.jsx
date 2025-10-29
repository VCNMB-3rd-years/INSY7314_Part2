// allow us to send the user to different pages
import { Navigate } from 'react-router-dom'
// import our Auth context file, so that we can check authentication
import { useAuth } from '../context/authContext.jsx'

export default function ProtectedRoute({children}) {
    // get whether the user is authenticated from AuthContext (the short term memory for Auth)
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return <div>Loading Authentication...</div>; //pull token data before redirects
    }

    // if the user is not authenticated...
    if (!isAuthenticated) {
        // navigate them back TO the login page, and REPLACE the current request with this.
        return <Navigate to="/login" replace />
    }
    // otherwise, let them have access to the page they want to go to!
    return children;
}