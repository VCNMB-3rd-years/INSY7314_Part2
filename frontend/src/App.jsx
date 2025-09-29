import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PaymentPortal from './pages/paymentPortal.jsx'

function App() {
  return (
    <Router>
       <Routes>
          <Route path="/paymentPortal" element={<PaymentPortal />} />
          </Routes>   
    </Router>
  )
}

export default App
