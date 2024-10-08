import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

function NavBar({ currentUser, handleLogout }) {
  return (
    <nav role="navigation" className="navbar">
      
      {currentUser ? (
        <>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/lifts">Submit Lifts</NavLink>
          <NavLink to="/tracker">Tracker</NavLink>
          <NavLink to="/workouts">Workouts</NavLink>
          <NavLink to="/leaderboard">Leader Board</NavLink>
          <NavLink to="/meals">Meals</NavLink>
        </>
      ) : (
        <div className="parent-container">
          <h3 className='title'>Peak Performance</h3>
        </div>
         
      )}
    </nav>
  );
}

export default NavBar;

