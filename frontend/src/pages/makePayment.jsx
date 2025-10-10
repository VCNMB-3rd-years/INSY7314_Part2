import { useEffect, useState } from 'react'
import { createPayment  } from '../services/apiService.js'
import { useNavigate } from 'react-router-dom'
import '../App.css'

export default function CreatePayment() {
    const [formData, setFormData] = useState({
        customerName: '',
        customerAcc: '',
        amount: '',
        currency: '',
        provider: '',
        swiftCode: '',
        verified: false
    })
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target //pull details of which input box is changing        
        setFormData({...formData, [name]: value}) //updates variable data as user types    
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        //if anything was left empty, tell user to fill out data
        if (!formData.customerName || !formData.customerAcc || !formData.amount || !formData.currency || !formData.provider || !formData.swiftCode) {
            setError('Please fill out all required fields.');
            return;
        }

        try {
            await createPayment(formData)
            alert('Payment added successfully')
            navigate('/customerPayments')
            setFormData({
                customerName: '',
                customerAcc: '',
                amount: '',
                currency: '',
                provider: '',
                swiftCode: '',
                verified: false
            })
        } catch (error) {
            console.error('Error processing payment:', error);
            setError(
                error.response?.data?.message ||
                error.message ||
                'Sorry, we could not process your payment'
            )
        }
    }
    

    const handleReset = (e) => {
        setFormData({
            customerName: '',
            customerAcc: '',
            amount: '',
            currency: '',
            provider: '',
            swiftCode: '',
            verified: false
        })
        setError('')
    }

    const namePattern = "^[a-zA-Z0-9\s]+$" //(W3Schools, 2025)
    const accPattern = "^acc\\d{9}$" //(W3Schools, 2025)
    const currencyPattern = "^[A-Z]{3}$" //(W3Schools, 2025)
    const providerPattern = "^[a-zA-Z\s]+$" //(W3Schools, 2025)
    const swiftCodePattern = "^([a-zA-Z]{4})[-\\s]?([a-zA-Z]{2})[-\\s]?([0-9a-zA-Z]{2})([-\\s]?[0-9a-zA-Z]{3})?$" //(Klesun, 2024)
    //const amountPattern = "^((?!0)\d{1,10}|0|\.\d{1,2})($|\.$|\.\d{1,2}$)" //()

    //(Reactjs, 2025)
    return(
        <div>
            <h1>Payment Portal</h1>
            <div>
                <h3>Please fill out details below</h3>
                {error && <p>{error}</p>}
                <form onSubmit={handleSubmit} className="form-grid"> 
                    <label htmlFor="customerName">Your Full Name</label>
                    <input
                        type="text"
                        name="customerName"
                        placeholder="eg. SamanthaSmith"
                        value={formData.customerName}
                        pattern={namePattern}
                        onChange={handleInputChange}
                        required
                        title="Ensure that name has no special characters, and between 1 and 30 characters"
                    >
                    </input>

                    <br></br>        

                    <label htmlFor="customerAcc">Your Acc Number</label>
                    <input
                        type="text"
                        name="customerAcc"
                        placeholder="eg. acc123456789"
                        value={formData.customerAcc}
                        pattern={accPattern}
                        onChange={handleInputChange}
                        required
                        title="Account number must start with 'acc' followed by 9 digits"
                    >
                    </input>

                    <br></br>              

                    <label htmlFor="currency">Currency for this Payment</label>
                    <input
                        type="text"
                        name="currency"
                        placeholder="e.g. ZAR"
                        value={formData.currency}
                        onChange={handleInputChange}
                        pattern={currencyPattern}
                        required
                        title="Currency should be the 3 intials of the currency name"
                    >
                    </input>

                    <br></br>

                    <label htmlFor="amount">Payment Amount</label>
                    <input
                        type="number"
                        name="amount"
                        placeholder="3000"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                        min="0.01" //allows decimal entries
                        step="0.01"
                        title="Amount must be a positive number with up to two decimals"
                    >
                    </input>

                    <br></br>

                    <label htmlFor="provider">Provider for Payment</label>
                    <input
                        type="text"
                        name="provider"
                        placeholder="eg. SWIFT"
                        value={formData.provider}
                        onChange={handleInputChange}
                        pattern={providerPattern}
                        required
                        title="Provider should only contain letters"
                    >
                    </input>

                    <br></br>

                    <label htmlFor="swiftCode">Swift Code</label>
                    <input
                        type="text"
                        name="swiftCode"
                        placeholder="AAAA-BB-CC-123"
                        value={formData.swiftCode}
                        onChange={handleInputChange}
                        pattern={swiftCodePattern}
                        required
                        title="Swift Codes must follow the pattern of 4 letters, 2 letters, 2 letters and optionally 3 numbers"
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

/*
REFERENCES:
    Klesun. 28 June 2024. What is proper RegEx expression for SWIFT codes? [Online]. Available at: <https://stackoverflow.com/questions/3028150/what-is-proper-regex-expression-for-swift-codes> [Accessed 9 October 2025]
    Reactjs. 2025. Forms. [Online]. Available at: <https://legacy.reactjs.org/docs/forms.html> [Accessed 9 October 2025]
    Regexr. 2025. 10 digits with a 2 decimal digit. [Online]. Available at: <https://regexr.com/46u84> [Accessed 9 October 2025]
    W3Schools. 2025. RegExp Character Classes. [online]  available at: https://www.w3schools.com/js/js_regexp_characters.asp date accessed date 09 October 2025
*/