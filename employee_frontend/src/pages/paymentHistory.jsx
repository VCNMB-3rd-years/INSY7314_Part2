import { useEffect, useState } from 'react'
import { getPendingPayments } from '../services/apiService.js'
import { useNavigate } from 'react-router-dom'
import '../App.css'

export default function PaymentPortal() {
    const [pendingPayments, setPendingPayments] = useState([])
    const navigate = useNavigate()

    const fetchPayments = async () => {
        try {
            const res = await getPendingPayments()
            console.log("api response: ", res)
            setPendingPayments(res.data)
        } catch (error) {
            console.error("Error fetching payments", error)
            if (error.response && error.response.status === 401) {
                navigate('/permissionDenied')
            }
            setPendingPayments([])
        }
    }

    useEffect(() => {
        fetchPayments() //finish getting data from api in the background
    }, []) //this method returns nothing so []

    return(
        <div>
            <h1>Payment Portal</h1>
            <div>
                <h3>Pending Verification</h3>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Provider</th>
                            <th>Currency</th>
                            <th>Amount</th>
                            <th>Verify</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingPayments.length === 0 && (
                            <tr>
                                <td colSpan="5">
                                    No payments in database
                                </td>
                            </tr>
                        )}
                        {pendingPayments.map( payment => (
                            <tr key={payment._id}>
                                <td>{payment.customerName}</td>
                                <td>{payment.provider}</td>
                                <td>{payment.currency}</td>
                                <td>{payment.amount}</td>
                                <td>
                                    <button onClick={() => {}}>Verify</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}