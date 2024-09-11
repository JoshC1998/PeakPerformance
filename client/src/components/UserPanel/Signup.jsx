import React, { useState } from 'react'; // Ensure useState is imported
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';

function Signup({ setCurrentUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then(data => {
          throw new Error(data.error);
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
    <div className="auth-container">
      <div className="auth-title-container">
        <h1 className='auth-title'>Peak Performance</h1>
      </div>
      <div className="form-container">
        <form className='user-form' onSubmit={handleSubmit}>
          <h2>Signup</h2>

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
            value='Signup'
          />
          
          <p>Already have an account?</p>
          <Link to='/login'>
            <button type="button">Login</button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;