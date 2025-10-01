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
                    >
                    </input>

                    <br></br>

                    <input
                        type="text"
                        name="accNumber"
                        placeholder="e.g. 1234567890"
                        value={formData.accNumber}
                        onChange={handleInputChange}
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
                        required
                    >
                    </input>

                    <br></br>

                    <button type="submit" onClick={() => { }}>Submit</button>
                    <button type="reset" onClick={handleReset}>Reset</button>
                </form>
            </div>
        </div>
    )
}