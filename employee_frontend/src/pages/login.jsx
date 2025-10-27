import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginEmployee } from '../services/apiService.js';
import { useAuth } from '../context/authContext.jsx';
import '../App.css';

export default function EmployeeLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };


//toggle needed
 const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      const response = await loginEmployee({
        username: formData.username,
        password: formData.password,
      });
      const { token } = response.data;
      login(token);
      console.log(response.data);
      navigate('/paymentPortal');

      setFormData({
        username: '',
        password: '',
      });
    } catch (err) {
      console.error('Employee login error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'An error occurred during login.'
      );
    }
  };

  const handleReset = () => {
    setFormData({
      username: '',
      password: '',
    });
    setError('');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Employee Login</h1>
      <div>
        <h3>Please fill out details below</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <span
                onClick={togglePasswordVisibility}
                className="password-toggle-icon"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit">Submit</button>
          <button type="reset" onClick={handleReset}>Reset</button>
        </form>
      </div>
    </div>
  );
}

{/*(GeeksforGeeks, 2025) FOr the eye needed to see password or not
  USed for the eye in the password to see it or not*/}

/*
REFERENCES
===============
GeeksforGeeks, 2025. How to Show and Hide Password in React Native ? [Online] Available at: https://www.geeksforgeeks.org/react-native/how-to-show-and-hide-password-in-react-native/ [Accessed 09 October 2025]
W3Schools. 2025. RegExp Character Classes. [online]  available at: https://www.w3schools.com/js/js_regexp_characters.asp [Accessed 09 October 2025]
*/