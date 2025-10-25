import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import PaymentPortal from './pages/paymentPortal.jsx'
import CreatePayment from './pages/makePayment.jsx'
import RegisterCustomer from './pages/registerCustomer.jsx'
import WelcomePage from './pages/welcomePage.jsx'
import Login from './pages/login.jsx'
import Navbar from './components/Navbar.jsx'
import PermissionDenied from './pages/permissionDenied.jsx';
import CustomerPayments from './pages/viewPayments.jsx';


function App() {
  return (
    <Router>
      <Navbar/>
        <div className="page-container">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/paymentPortal" element={<PaymentPortal />} />
        <Route path="/makePayment" element={<CreatePayment />} />
        <Route path="/register" element={<RegisterCustomer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customerPayments" element={<CustomerPayments />} />
        <Route path="/permissionDenied" element={<PermissionDenied/>} />
      </Routes> 
      </div>  
    </Router>
  )
}

export default App
