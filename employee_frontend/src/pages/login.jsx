import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginEmployee, loginAdmin } from '../services/apiService.js';
import { useAuth } from '../context/authContext.jsx';
import '../App.css';

export default function EmployeeLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      const adminRes = await loginAdmin({
        username: formData.username,
        password: formData.password,
      });

      const { token, admin } = adminRes.data;
      login(token);                       // store JWT
      console.log('Admin login success:', admin);

      navigate('/registerEmployee');
      setFormData({ username: '', password: '' });
      return;
    } catch (adminErr) {
      // Only continue if the error is "Invalid credentials"
      const msg = adminErr.response?.data?.message;
      if (msg !== 'Invalid credentials') {
        // Real server error → stop
        setError(msg || adminErr.message || 'Admin login failed');
        return;
      }
    }

    try {
      const empRes = await loginEmployee({
        username: formData.username,
        password: formData.password,
      });

      const { token } = empRes.data;
      login(token);
      console.log('Employee login success');

      navigate('/paymentPortal');
      setFormData({ username: '', password: '' });
      return;
    } catch (empErr) {
      setError(
        empErr.response?.data?.message ||
        empErr.message ||
        'Invalid username or password.'
      );
    }
  };

  const handleReset = () => {
    setFormData({ username: '', password: '' });
    setError('');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Login</h1>
      <div>
        <h3>Please enter your credentials</h3>
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

          <button type="submit">Login</button>
          <button type="reset" onClick={handleReset}>Reset</button>
        </form>
      </div>
    </div>
  );
}