import { useEffect, useState } from 'react'
import { registerCustomer } from '../services/apiService.js'
import '../App.css'
import icon from '../../image/icon.png'

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
        
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <img 
            src={icon} 
            alt="Company Logo" 
            style={{ width: '200px', height: 'auto', marginBottom: '1px' }} 
        />
            
            
            <h1>Customer Registration</h1>
            <div>
                <h3>Please fill out details below</h3>
                <form onSubmit={handleSubmit}>
                    {/*(Ui prep, 2025) Used it to figire out how to chnage the input fields*/}
                    <div className="form-group"> 
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            pattern={namePattern}
                            title="Ensure that the name enters has no special characters in it, and between 1 and 30 characters"
                        />
                    </div>
                        {/*(Ui prep, 2025) */}
                    <div className="form-group">
                        <label htmlFor="idNumber">ID Number</label>
                        <input
                            type="text"
                            id="idNumber"
                            name="idNumber"
                            placeholder="ID Number"
                            value={formData.idNumber}
                            onChange={handleInputChange}
                            required
                            pattern={idPattern}
                            title="ensure that the id is a lenght of 13 letters and no alphabetical characters"
                        />
                    </div>

                    {/*(Ui prep, 2025) */}
                    <div className="form-group">
                        <label htmlFor="accNumber">Account Number</label>
                        <input
                            type="text"
                            id="accNumber"
                            name="accNumber"
                            placeholder="e.g. acc123456789"
                            value={formData.accNumber.toLowerCase()}
                            onChange={handleInputChange}
                            pattern={accNrPattern}
                            title="Account number must start with 'acc' followed by 9 digits"
                            required
                        />
                    </div>

                    {/*(Ui prep, 2025) */}
                    <div className="form-group">
                        <label htmlFor="userPassword">Password</label>
                        <input
                            type="password"
                            id="userPassword"
                            name="userPassword"
                            placeholder="password"
                            value={formData.userPassword}
                            onChange={handleInputChange}
                            pattern={passwordPattern}
                            title='Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character.'
                            required
                        />
                    </div>

                    <button type="submit">Submit</button>
                    <button type="reset" onClick={handleReset}>Reset</button>
                </form>
            </div>
        </div>
    )
}


{/*
REFERENCES:
    Ui prep, 2025. UI Designer’s Guide to Creating Forms & Inputs. [Online]Available at: https://www.uiprep.com/blog/ui-designers-guide-to-creating-forms-inputs
    W3Schools. 2025. RegExp Character Classes. [online]  Available at: https://www.w3schools.com/js/js_regexp_characters.asp date accessed date 09 October 2025
    qho. 2023. strict password validator. [online] available at: https://regex101.com/r/0bH043/3 date accessed date 09 October 2025
*/}