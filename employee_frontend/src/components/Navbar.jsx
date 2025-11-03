//With Aid from Web Dev Simplified (2022),  This navbar was made
import React from 'react';
import { Link, useMatch, useResolvedPath, useNavigate} from "react-router-dom";
import { useAuth } from '../context/authContext.jsx'


//calling the logout fuction from the class: Authcontext


//Method comes from youtube video (Web Dev Simplified, 2022)
function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

console.log('Navbar mounted'); //Log purposes



//Method comes from youtube video (Web Dev Simplified, 2022)
export default function Navbar() {
   const { isAuthenticated, userRole, logout, isSuperAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
      await logout()
      navigate('/')
  }

  return (
    <nav className="nav">
      <Link to="/" className="site-title">PayNow</Link>
      <ul>
       {isAuthenticated ? (
          <>
            <CustomLink to="/paymentPortal">Payment Portal</CustomLink>
            <CustomLink to="/paymentHistory">Payment History</CustomLink>
          {userRole === 'admin' && (
            <CustomLink to="/allEmployees">All Employees</CustomLink>
            
          )}

          {isSuperAdmin && (
            <CustomLink to="/register">Register Employees</CustomLink>
            
          )}
          
          
          
          <li className="nav-item">
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </li>
          </>
       ):(
        <>
          <CustomLink to="/login">Login</CustomLink>
        </>
       )}
      </ul>
    </nav>
  );
}

/*
REFERENCES
===================
W3schools, 2025. JavaScript Comparison.  [Online]. Avaliable at: https://www.w3schools.com/js/js_comparisons.asp
Web Dev Simplified, 2022. How To Create A Navbar In React With Routing. [video online]. Avaliable at: https://www.youtube.com/watch?v=SLfhMt5OUPI [Accessed 8 October 2025]

*/