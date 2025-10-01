import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PaymentPortal from './pages/paymentPortal.jsx'
import CreatePayment from './pages/makePayment.jsx'
import RegisterCustomer from './pages/registerCustomer.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/paymentPortal" element={<PaymentPortal />} />
        <Route path="/makePayment" element={<CreatePayment />} />
        <Route path="/register" element={<RegisterCustomer />} />
      </Routes>   
    </Router>
  )
}

export default App
