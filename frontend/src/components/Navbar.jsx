/**
 * Navbar Component
 * TODO: Implement navigation bar with user menu and links
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // TODO: Get user data from context
  // TODO: Implement logout functionality
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">PrepVerse</Link>
      </div>
      
      <div className="navbar-menu">
        {/* TODO: Add navigation links */}
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/questions">Questions</Link>
        <Link to="/planner">Study Planner</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/gate-papers">GATE Papers</Link>
      </div>
      
      <div className="navbar-user">
        {/* TODO: Add user menu with profile and logout */}
        <button>Profile</button>
        <button>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
