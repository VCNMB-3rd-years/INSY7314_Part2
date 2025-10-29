import { useEffect, useState } from 'react'
import { getPendingPayments, verifyPayment, rejectPayment } from '../services/apiService.js'
import { useNavigate } from 'react-router-dom'
import '../App.css'

export default function PaymentPortal() {
    const [pendingPayments, setPendingPayments] = useState([])
    const [updatePayment, setUpdatePayment] = useState([])
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

    const handleVerify = async (e) => {
        e.preventDefault()
        await verifyPayment(e.target.value, updatePayment)
        alert('Payment verified!')
        fetchPayments()
    }

    const handleReject = async (e) => {
        e.preventDefault()
        await rejectPayment(e.target.value, updatePayment)
        alert('Payment rejected!')
        fetchPayments()
    }

    useEffect(() => {
        fetchPayments() //finish getting data from api in the background
    }, []) //this method returns nothing so []

    return (
        <div>
            <h1>Payment Portal</h1>
            <div>
                <h3>Payment History</h3>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Provider</th>
                            <th>Currency</th>
                            <th>Amount</th>
                            <th>Current Status</th>
                            <th>Verify</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingPayments.length === 0 && (
                            <tr>
                                <td colSpan="6">
                                    No payments in database
                                </td>
                            </tr>
                        )}
                        {pendingPayments.map(payment => (
                            <tr key={payment._id}>
                                <td>{payment.customerName}</td>
                                <td>{payment.provider}</td>
                                <td>{payment.currency}</td>
                                <td>{payment.amount}</td>
                                <td>{payment.verified}</td>
                                <td>
                                    <button onClick={handleVerify}>Verify</button>
                                    <button onClick={handleReject}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}