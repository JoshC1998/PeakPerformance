import React from 'react';
import './home.css';

function Home({ currentUser, handleLogout }) {
  return (
    <div>
      <h1>Welcome, {currentUser.username}!</h1>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      {/* Add other content or components you want on the home page */}
    </div>
  );
}

export default Home;