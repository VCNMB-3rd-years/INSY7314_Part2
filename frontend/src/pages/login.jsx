import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCustomer, loginEmployee } from '../services/apiService.js';
import { useAuth } from '../context/authContext.js';
import '../App.css';

export default function Login() {
  const [formData, setFormData] = useState({
    fullName: '',
    accNumber: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.password) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      if (formData.accNumber) {
        const response = await loginCustomer({
          fullName: formData.fullName,
          accNumber: formData.accNumber,
          userPassword: formData.password,
        });
        const { token } = response.data
        useAuth().login(token)
        console.log(response.data);
        navigate('/makePayment');
      } else {
        const response = await loginEmployee({
          username: formData.fullName,
          password: formData.password,
        });
        const { token } = response.data
        useAuth().login(token)
        console.log(response.data);
        navigate('/paymentPortal');
      }

      setFormData({
        fullName: '',
        accNumber: '',
        password: '',
      });
    } catch (err) {
      setError(
        err.response?.data?.message || 'an error occured during login'
      );
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      accNumber: '',
      password: '',
    });
    setError('');
  };
  const accNrPattern = "^acc\\d{9}$"; // w3schools
  return (
    <div>
      <h1>Login</h1>
      <div>
        <h3>Please fill out details below</h3>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Username/Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
          <br />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <br />
          <input
            type="text"
            name="accNumber"
            placeholder="Account Number (customers only)"
            value={formData.accNumber.toLowerCase()}
            onChange={handleInputChange}
            pattern={accNrPattern}
            title="Account number must start with 'acc' followed by 9 digits"
          />
          <br />
          <button type="submit">Submit</button>
          <button type="reset" onClick={handleReset}>Reset</button>
        </form>
      </div>
    </div>
  );
}

/*
W3Schools. 2025. RegExp Character Classes. [online]  available at: https://www.w3schools.com/js/js_regexp_characters.asp date accessed date 09 October 2025
*/