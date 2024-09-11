import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';

function Login({ setCurrentUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then(data => {
          throw new Error(data.error || 'Invalid username or password');
        });
      }
    })
    .then(data => {
      setCurrentUser(data);
      navigate('/');
    })
    .catch(error => {
      alert(error.message);
    });
  }

  return (
    <div className="auth-background">
      <div className="auth-container">
        <div className="auth-title-container">
          <h1 className='auth-title'>Peak Performance</h1>
        </div>
        <div className="form-container">
          <form className='user-form' onSubmit={handleSubmit}>
            <h2>Login</h2>

            <input
              type="text"
              onChange={e => setUsername(e.target.value)}
              value={username}
              placeholder='Username'
            />

            <input
              type="password"
              onChange={e => setPassword(e.target.value)}
              value={password}
              placeholder='Password'
            />

            <input
              type="submit"
              value='Login'
            />
            
            <p>Don't have an account?</p>
            <Link to='/signup'>
              <button type="button">Signup</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
