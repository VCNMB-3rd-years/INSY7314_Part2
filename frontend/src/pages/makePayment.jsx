import { useEffect, useState } from 'react'
import { createPayment } from '../services/apiService.js'
import '../App.css'

export default function CreatePayment() {
    const [formData, setFormData] = useState({
        customerName: '',
        amount: 0,
        currency: '',
        provider: '',
        verified: false
    })

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value}) //updates variable data as user types
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await createPayment(formData)
        alert('Payment added')
        setFormData({
            customerName: '',
            amount: 0,
            currency: '',
            provider: '',
            verified: false
        })
    }

    const handleReset = (e) => {
        setFormData({
            customerName: '',
            amount: 0,
            currency: '',
            provider: '',
            verified: false
        })
    }

    return(
        <div>
            <h1>Payment Portal</h1>
            <div>
                <h3>Please fill out details below</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="customerName"
                        placeholder="eg. SamanthaSmith"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                    >
                    </input>

                    <br></br>

                    <input
                        type="text"
                        name="provider"
                        placeholder="eg. SWIFT"
                        value={formData.provider}
                        onChange={handleInputChange}
                        required
                    >
                    </input>

                    <br></br>

                    <input
                        type="text"
                        name="currency"
                        placeholder="e.g. ZAR"
                        value={formData.currency}
                        onChange={handleInputChange}
                        required
                    >
                    </input>

                    <br></br>

                    <input
                        type="text"
                        name="amount"
                        placeholder="e.g. 3000"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                    >
                    </input>

                    <br></br>

                    <button type="submit" onClick={() => {}}>Submit</button>
                    <button type="reset" onClick={handleReset}>Reset</button>
                </form>
            </div>
        </div>
    )
}