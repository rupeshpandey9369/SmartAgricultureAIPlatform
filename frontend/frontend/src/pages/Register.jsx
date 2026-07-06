import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/client'

export default function Register() {
  const [step, setStep] = useState('register') // 'register' | 'otp'
  const [form, setForm] = useState({ phone: '', email: '', full_name: '', password: '' })
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.register(form)
      setStep('otp')
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Registration failed. Check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.verifyOtp({ phone: form.phone, otp })
      navigate('/login')
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-wheat px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl text-forest">Smart Agriculture</p>
          <p className="text-sage text-sm mt-1 tracking-wide">Create your farmer account</p>
        </div>

        {step === 'register' && (
          <form onSubmit={handleRegister} className="bg-white/60 border border-forest/10 rounded-2xl p-7 space-y-4">
            <div>
              <label className="block text-sm text-ink/70 mb-1">Full name</label>
              <input
                name="full_name" required value={form.full_name} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-forest/20 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta"
              />
            </div>
            <div>
              <label className="block text-sm text-ink/70 mb-1">Phone number</label>
              <input
                name="phone" type="tel" required value={form.phone} onChange={handleChange}
                placeholder="+919876543210"
                className="w-full px-4 py-2.5 rounded-lg border border-forest/20 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta"
              />
            </div>
            <div>
              <label className="block text-sm text-ink/70 mb-1">Email (optional)</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-forest/20 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta"
              />
            </div>
            <div>
              <label className="block text-sm text-ink/70 mb-1">Password</label>
              <input
                name="password" type="password" required value={form.password} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-forest/20 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta"
              />
            </div>

            {error && <p className="text-terracotta text-sm bg-terracotta/10 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full bg-forest text-wheat py-2.5 rounded-lg font-medium hover:bg-forest/90 transition disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerify} className="bg-white/60 border border-forest/10 rounded-2xl p-7 space-y-4">
            <p className="text-sm text-ink/70">
              Enter the code sent to <span className="font-medium text-forest">{form.phone}</span>.
              In dev mode, check your <code className="bg-forest/10 px-1 rounded">core-api</code> terminal for the code.
            </p>
            <input
              value={otp} onChange={(e) => setOtp(e.target.value)} required
              placeholder="6-digit code"
              className="w-full px-4 py-2.5 rounded-lg border border-forest/20 bg-white text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
            {error && <p className="text-terracotta text-sm bg-terracotta/10 px-3 py-2 rounded-lg">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-terracotta text-wheat py-2.5 rounded-lg font-medium hover:bg-terracotta/90 transition disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify and continue'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-ink/60 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-terracotta font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
