import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(phone, password)
      navigate('/dashboard')
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Could not sign in. Check your phone and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-wheat px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl text-forest">Smart Agriculture</p>
          <p className="text-sage text-sm mt-1 tracking-wide">AI Platform for Farmers</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/60 border border-forest/10 rounded-2xl p-7 space-y-5">
          <div>
            <label className="block text-sm text-ink/70 mb-1">Phone number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+919876543210"
              className="w-full px-4 py-2.5 rounded-lg border border-forest/20 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
          </div>
          <div>
            <label className="block text-sm text-ink/70 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-forest/20 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
          </div>

          {error && (
            <p className="text-terracotta text-sm bg-terracotta/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest text-wheat py-2.5 rounded-lg font-body font-medium hover:bg-forest/90 transition disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-5">
          New here?{' '}
          <Link to="/register" className="text-terracotta font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
