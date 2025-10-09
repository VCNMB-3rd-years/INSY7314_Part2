//With Aid from Web Dev Simplified (2022),  This navbar was made
import React from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom";

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
  return (
    <nav className="nav">
      <Link to="/" className="site-title">PayNow</Link>
      <ul>
        <CustomLink to="/register">Register</CustomLink>
        <CustomLink to="/login">Login</CustomLink>
      </ul>
    </nav>
  );
}

/*
REFERENCES
===================
Web Dev Simplified, 2022. How To Create A Navbar In React With Routing. [video online]. Avaliable at: https://www.youtube.com/watch?v=SLfhMt5OUPI [Accessed 8 October 2025]

*/