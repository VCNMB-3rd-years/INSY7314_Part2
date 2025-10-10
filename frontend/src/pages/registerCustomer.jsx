import { useEffect, useState } from 'react'
import { registerCustomer } from '../services/apiService.js'
import '../App.css'

export default function RegisterCustomer() {
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
        await registerCustomer(formData)
        alert('Customer added')
        setFormData({
            fullName: '',
            idNumber: '',
            accNumber: '',
            userPassword: ''
        })
    }

    const handleReset = (e) => {
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
                        title="Ensure that the name enters has no special characters in it, and between 1 and 30 characters"
                    >
                    </input>

                    <br></br>

                    <input
                        type="text"
                        name="idNumber"
                        placeholder="ID Number"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        required
                        pattern={idPattern}
                        title="ensure that the id is a lenght of 13 letters and no alphabetical characters"
                    >
                    </input>

                    <br></br>

                    <input
                        type="text"
                        name="accNumber"
                        placeholder="e.g. acc123456789"
                        value={formData.accNumber.toLowerCase()}
                        onChange={handleInputChange}
                        pattern={accNrPattern}
                        title="Account number must start with 'acc' followed by 9 digits"
                        required
                    >
                    </input>

                    <br></br>
                    <input
                        type="text"
                        name="userPassword"
                        placeholder="password"
                        value={formData.userPassword}
                        onChange={handleInputChange}
                        pattern={passwordPattern}
                        title='Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character.'
                        required
                    />
                    <br>
                    </br>

                    <button type="submit" onClick={() => { }}>Submit</button>
                    <button type="reset" onClick={handleReset}>Reset</button>
                </form>
            </div>
        </div>
    )
}
/*
REFERENCES:
    W3Schools. 2025. RegExp Character Classes. [online]  available at: https://www.w3schools.com/js/js_regexp_characters.asp date accessed date 09 October 2025
    qho. 2023. strict password validator. [online] available at: https://regex101.com/r/0bH043/3 date accessed date 09 October 2025
*/