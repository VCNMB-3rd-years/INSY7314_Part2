import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import PaymentPortal from './pages/paymentPortal.jsx'
import RegisterEmployee from './pages/registerEmployee.jsx'
import WelcomePage from './pages/welcomePage.jsx'
import Login from './pages/login.jsx'
import Navbar from './components/Navbar.jsx'
import PermissionDenied from './pages/permissionDenied.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PaymentHistory from './pages/paymentHistory.jsx';
import AllEmployees from './pages/allEmployees.jsx'

function App() {
  return (
    <Router>
      <Navbar/>
        <div className="page-container">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={ <ProtectedRoute> <RegisterEmployee /> </ProtectedRoute>} />
        <Route path="/paymentPortal" element={<ProtectedRoute> <PaymentPortal /> </ProtectedRoute>} />
        <Route path="/paymentHistory" element={ <ProtectedRoute> <PaymentHistory /> </ProtectedRoute>} />
        <Route path="/permissionDenied" element={<PermissionDenied/>} />
        <Route path="/allEmployees" element={<AllEmployees />} />
      </Routes> 
      </div>  
    </Router>
  )
}

export default App
