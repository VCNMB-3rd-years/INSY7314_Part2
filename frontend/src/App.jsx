import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PaymentPortal from './pages/paymentPortal.jsx'
import CreatePayment from './pages/makePayment.jsx'
import RegisterCustomer from './pages/registerCustomer.jsx'
import WelcomePage from './pages/welcomePage.jsx'
import Login from './pages/login.jsx'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/paymentPortal" element={<PaymentPortal />} />
        <Route path="/makePayment" element={<CreatePayment />} />
        <Route path="/register" element={<RegisterCustomer />} />
        <Route path="/login" element={<Login />} />
      </Routes>   
    </Router>
  )
}

export default App
