import React, { useState } from 'react';
import axios from 'axios';
import './Form.css'; // Shared CSS for login and register
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMsg('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMsg('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setMsg('Password must be at least 6 characters long');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMsg('');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        // Server responded with error status
        const errorMsg = err.response.data?.error || 'Login failed. Please try again.';
        setMsg(errorMsg);
      } else if (err.request) {
        // Request was made but no response received
        setMsg('Unable to connect to server. Please check your internet connection.');
      } else {
        // Something else happened
        setMsg('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleLogin}>
        <h2>Login to NyumbaniConnect</h2>

        {msg && <div className="error-msg">{msg}</div>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <div className="login-link">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
