import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { logout, phone } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg font-body text-sm transition ${
      isActive ? 'bg-terracotta text-wheat' : 'text-wheat/80 hover:bg-forest/60'
    }`

  return (
    <div className="min-h-screen flex bg-wheat">
      <aside className="w-60 bg-forest flex flex-col">
        <div className="px-5 py-6 border-b border-wheat/10">
          <p className="font-display text-wheat text-xl leading-tight">Smart Agriculture</p>
          <p className="text-sage text-xs mt-1">AI Platform</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/disease-detection" className={linkClass}>Disease Detection</NavLink>
          <NavLink to="/fertilizer" className={linkClass}>Fertilizer</NavLink>
          <NavLink to="/weather" className={linkClass}>Weather</NavLink>
          <NavLink to="/yield" className={linkClass}>Yield Prediction</NavLink>
          <NavLink to="/market" className={linkClass}>Market Prices</NavLink>
          <NavLink to="/chatbot" className={linkClass}>KisanBot</NavLink>
          <NavLink to="/schemes" className={linkClass}>Govt Schemes</NavLink>

        </nav>
        <div className="px-4 py-4 border-t border-wheat/10">
          <p className="text-wheat/60 text-xs mb-2">{phone}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-wheat/80 hover:text-terracotta transition"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
