import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DiseaseDetection from './pages/DiseaseDetection'
import ProtectedRoute from './components/ProtectedRoute'
import FertilizerPage from './pages/FertilizerPage'
import WeatherPage from './pages/WeatherPage'
import YieldPredictionPage from './pages/YieldPredictionPage'
import MarketPricePage from './pages/MarketPricePage'
import ChatbotPage from './pages/ChatbotPage'
import SchemesPage from './pages/SchemesPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/yield" element={<ProtectedRoute><YieldPredictionPage /></ProtectedRoute>} />
      <Route path="/market" element={<ProtectedRoute><MarketPricePage /></ProtectedRoute>} />
      <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
      <Route path="/schemes" element={<ProtectedRoute><SchemesPage /></ProtectedRoute>} />

    <Route
  path="/fertilizer"
  element={
    <ProtectedRoute>
      <FertilizerPage />
    </ProtectedRoute>
  }
/>





<Route
  path="/weather"
  element={
    <ProtectedRoute>
      <WeatherPage />
    </ProtectedRoute>
  }
/>


    
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/disease-detection"
        element={
          <ProtectedRoute>
            <DiseaseDetection />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
