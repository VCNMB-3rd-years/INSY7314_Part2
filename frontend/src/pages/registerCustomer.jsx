import { useEffect, useState } from 'react'
import { registerCustomer } from '../services/apiService.js'
import { useNavigate } from 'react-router-dom';
import '../App.css'

export default function RegisterCustomer() {
    const navigate = useNavigate(); // Initialize navigate hook
    const [formData, setFormData] = useState({
        fullName: '',
        idNumber: '',
        accNumber: '',
        userPassword: ''
    })

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value }) //updates variable data as user types
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await registerCustomer(formData)
            alert('Customer added')
            setFormData({
                fullName: '',
                idNumber: '',
                accNumber: '',
                userPassword: ''
            })
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    }

    const handleReset = () => {
        setFormData({
            fullName: '',
            idNumber: '',
            accNumber: '',
            userPassword: ''
        })
    }

    const namePattern = "^[a-zA-Z0-9]{1,30}$" // w3schools
    const idPattern = "^(?!.*[A-Za-z])\\d{13}$" // w3schools
    const accNrPattern = "^acc\\d{9}$"; // w3schools
    const passwordPattern = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])[^\\s]{8,16}$"; // qho, 2023

    return (
        <div>
            <h1>Customer Registration</h1>
            <div>
                <h3>Please fill out details below</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        pattern={namePattern}
                        title="Ensure that the name has no special characters and is between 1 and 30 characters"
                    />

                    <br />

                    <input
                        type="text"
                        name="idNumber"
                        placeholder="ID Number"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        required
                        pattern={idPattern}
                        title="Ensure that the ID is 13 digits with no alphabetical characters"
                    />

                    <br />

                    <input
                        type="text"
                        name="accNumber"
                        placeholder="e.g. acc123456789"
                        value={formData.accNumber.toLowerCase()}
                        onChange={handleInputChange}
                        pattern={accNrPattern}
                        title="Account number must start with 'acc' followed by 9 digits"
                        required
                    />

                    <br />

                    <input
                        type="password"
                        name="userPassword"
                        placeholder="Password"
                        value={formData.userPassword}
                        onChange={handleInputChange}
                        pattern={passwordPattern}
                        title="Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character, and be 8-16 characters long"
                        required
                    />

                    <br />

                    <button type="submit">Submit</button>
                    <button type="reset" onClick={handleReset}>Reset</button>
                </form>
            </div>
        </div>
    )
}

/*
REFERENCES:
    W3Schools. 2025. RegExp Character Classes. [online] available at: https://www.w3schools.com/js/js_regexp_characters.asp date accessed 09 October 2025
    qho. 2023. strict password validator. [online] available at: https://regex101.com/r/0bH043/3 date accessed 09 October 2025
*/