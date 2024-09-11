// UserPanel/Home.jsx
import React from 'react';
import './home.css';

function Home({ currentUser, handleLogout }) {
  return (
    <div className="home-page">
      <div className="content-container">
        <h4>Welcome, {currentUser.username}!</h4>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        {/* Add other content or components you want on the home page */}
      </div>
    </div>
  );
}

export default Home;
