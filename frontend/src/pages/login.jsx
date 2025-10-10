import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginCustomer, loginEmployee } from '../services/apiService.js';
import { useAuth } from '../context/authContext.jsx';
import '../App.css';

export default function Login() {
  const [formData, setFormData] = useState({
    fullName: '',
    accNumber: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false); //GeeksforGeeks, 2025
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth()

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
        login(token)
        console.log(response.data);
        navigate('/makePayment');
      } else {
        const response = await loginEmployee({
          username: formData.fullName,
          password: formData.password,
        });
        const { token } = response.data
        login(token)
        console.log(response.data);
        navigate('/paymentPortal');
      }

      setFormData({
        fullName: '',
        accNumber: '',
        password: '',
      });
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'An error occurred during login.'
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
  const accNrPattern = "^acc\\d{9}$"; // (w3schools,  2025)
  return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1>Login</h1>
            <div>
                <h3>Please fill out details below</h3>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Username/Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Username/Full Name"
                            value={formData.fullName}
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

                    <div className="form-group">
                        <label htmlFor="accNumber">Account Number</label>
                        <input
                            type="text"
                            id="accNumber"
                            name="accNumber"
                            placeholder="Account Number (customers only)"
                            value={formData.accNumber.toLowerCase()}
                            onChange={handleInputChange}
                            pattern={accNrPattern}
                            title="Account number must start with 'acc' followed by 9 digits"
                        />
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