import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PaymentPortal from './pages/paymentPortal.jsx'
import CreatePayment from './pages/makePayment.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/paymentPortal" element={<PaymentPortal />} />
        <Route path="/makePayment" element={<CreatePayment />} />
      </Routes>   
    </Router>
  )
}

export default App
