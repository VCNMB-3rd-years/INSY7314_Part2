import { useEffect, useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom'

export default function WelcomePage() {
    const navigate = useNavigate()

    const handleNavigateToPayPortal = () => {
        navigate('/paymentPortal')
    }

    return(
        <div>
            <h1>Welcome</h1>
            <div>
                <button type="submit" onClick={handleNavigateToPayPortal}>Make Payment</button>
            </div>
        </div>
    )
}