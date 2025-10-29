import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import PaymentPortal from './pages/paymentPortal.jsx'
import RegisterEmployee from './pages/registerEmployee.jsx'
import WelcomePage from './pages/welcomePage.jsx'
import Login from './pages/login.jsx'
import Navbar from './components/Navbar.jsx'
import PermissionDenied from './pages/permissionDenied.jsx';
import ProtectedRoute from './components/protectedRoute.jsx'

function App() {
  return (
    <Router>
      <Navbar/>
        <div className="page-container">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/paymentPortal" element={<ProtectedRoute> <PaymentPortal /> </ProtectedRoute>} />
        <Route path="/register" element={ <ProtectedRoute> <RegisterEmployee /> </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/permissionDenied" element={<PermissionDenied/>} />
      </Routes> 
      </div>  
    </Router>
  )
}

export default App
