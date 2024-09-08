import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ setCurrentUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    console.log('Submitting login with:', { username, password });

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      console.log('Response status:', res.status);
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then(data => {
          throw new Error(data.error || 'Invalid username or password');
        });
      }
    })
    .then(data => {
      console.log('Login successful, user data:', data);
      setCurrentUser(data);
      navigate('/');
    })
    .catch(error => {
      console.error('Login error:', error);
      alert(error.message);
    });
  }

  return (
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
      
      <Link to='/signup'>
        <button type="signupbtn">Signup</button>
      </Link>
    </form>
  );
}

export default Login;

