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
   const { isAuthenticated, logout } = useAuth();
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
            <CustomLink to="/customerPayments">Payment Portal</CustomLink>
            <CustomLink to="/makePayment">Create Payment</CustomLink>

            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <CustomLink to="/register">Register</CustomLink>
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
Web Dev Simplified, 2022. How To Create A Navbar In React With Routing. [video online]. Avaliable at: https://www.youtube.com/watch?v=SLfhMt5OUPI [Accessed 8 October 2025]

*/