import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);

      // Add client-side validation (e.g., email format, password strength) here

      const response = await axios.post('http://localhost:5000/api/login', formData);

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        console.log('Login successful');

        // Redirect to the dashboard or any other protected route after successful login
        navigate('/');
      } else {
        // Handle other possible response status codes with specific error messages
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      // Handle network errors or server issues
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='container'>
      <h1>Login</h1>
      <form>
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            name='username'
            value={formData.username}
            onChange={handleChange}
            placeholder='Enter your username'
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Enter your Password'
          />
        </div>
      </form>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <p>
        Don't have an account? <Link to='/signup'>Signup here</Link>
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;










