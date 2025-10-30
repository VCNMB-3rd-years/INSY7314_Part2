import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCustomerPayments } from '../services/apiService.js'
import '../App.css'

export default function CustomerPayments() {
    const navigate = useNavigate()
    const [customerPayments, setCustomerPayments] = useState([])

    const fetchPayments = async () => {
        try {
            const res = await getCustomerPayments()
            console.log("api response: ", res)
            setCustomerPayments(res.data)
        } catch (error) {
            console.error("Error fetching payments", error)
            setCustomerPayments([])
        }
    }

    useEffect(() => {
        fetchPayments() //finish getting data from api in the background
    }, []) //this method returns nothing so []

    return(
        <div>
            <h1>Payment Portal</h1>
            <div>
                <h3>All Your Payments</h3>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Provider</th>
                            <th>Currency</th>
                            <th>Amount</th>
                            <th>Verification Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerPayments.length === 0 && (
                            <tr>
                                <td colSpan="5">
                                    You haven't made any payments yet
                                    <button onClick={() => navigate('/makePayment')}>Make first payment</button>
                                </td>
                            </tr>
                        )}
                        {customerPayments.map( payment => (
                            <tr key={payment._id}>
                                <td>{payment.customerName}</td>
                                <td>{payment.provider}</td>
                                <td>{payment.currency}</td>
                                <td>{payment.amount}</td>
                                <td>{payment.verified}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}