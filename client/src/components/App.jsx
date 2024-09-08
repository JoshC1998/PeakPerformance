import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import UserDetails from './UserPanel/UserDetails';
import Login from './UserPanel/Login';
import Signup from './UserPanel/Signup';
import SubmitLift from './UserPanel/SubmitLifts';
import Tracker from './UserPanel/Tracker';
import Workouts from './UserPanel/Workouts';
import LeaderBoard from './UserPanel/LeaderBoard';
import { VideoProvider } from './UserPanel/VideoContext'; 

const API_URL = 'http://localhost:5555'; 

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liftData, setLiftData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/check_session`)
      .then(res => {
        if (res.status === 204) {
          return {}; 
        }
        return res.json(); 
      })
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error checking session:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/lifts`)
      .then(res => res.json())
      .then(data => setLiftData(data))
      .catch(error => console.error('Error fetching lift data:', error));
  }, []);

  function handleLogout() {
    fetch(`${API_URL}/api/logout`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setCurrentUser(null);
        } else {
          console.error('Failed to logout');
        }
      })
      .catch(error => console.error('Error logging out:', error));
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <VideoProvider>
      <div className='app App'>
        <NavBar currentUser={currentUser} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={
            currentUser ? 
            <UserDetails currentUser={currentUser} setCurrentUser={setCurrentUser} /> : 
            <Navigate to="/login" />
          } />
          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
          <Route path="/signup" element={<Signup setCurrentUser={setCurrentUser} />} />
          <Route path="/lifts" element={currentUser ? <SubmitLift currentUser={currentUser} /> : <Navigate to="/login" />} />
          <Route path="/tracker" element={currentUser ? <Tracker /> : <Navigate to="/login" />} />
          <Route path="/workouts" element={currentUser ? <Workouts /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={currentUser ? <LeaderBoard liftData={liftData} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </VideoProvider>
  );
}

export default App;