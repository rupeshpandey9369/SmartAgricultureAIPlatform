import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { farmsApi } from '../api/client'
import { useNavigate } from 'react-router-dom'

const QUICK_ACTIONS = [
  { icon: '🦠', label: 'Disease Detection', path: '/disease-detection', color: 'bg-forest' },
  { icon: '🌦️', label: 'Weather', path: '/weather', color: 'bg-forest' },
  { icon: '🌱', label: 'Fertilizer', path: '/fertilizer', color: 'bg-forest' },
  { icon: '📊', label: 'Yield Prediction', path: '/yield', color: 'bg-forest' },
  { icon: '💹', label: 'Market Prices', path: '/market', color: 'bg-forest' },
  { icon: '🤖', label: 'KisanBot', path: '/chatbot', color: 'bg-forest' },
  { icon: '📋', label: 'Govt Schemes', path: '/schemes', color: 'bg-forest' },
]

export default function Dashboard() {
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', area_acres: '', soil_type: '', current_crop: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const loadFarms = async () => {
    setLoading(true)
    try {
      const res = await farmsApi.list()
      setFarms(res.data)
    } catch {
      setError('Could not load farms. Is core-api running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadFarms() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await farmsApi.create({ ...form, area_acres: parseFloat(form.area_acres) })
      setForm({ name: '', area_acres: '', soil_type: '', current_crop: '' })
      setShowForm(false)
      loadFarms()
    } catch {
      setError('Could not create farm. Check the fields and try again.')
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-forest">Your farms</h1>
          <p className="text-ink/60 text-sm mt-1">Manage the farms linked to your account.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-terracotta text-wheat px-4 py-2 rounded-lg text-sm font-medium hover:bg-terracotta/90 transition"
        >
          {showForm ? 'Cancel' : '+ Add farm'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white/60 border border-forest/10 rounded-2xl p-6 mb-6 grid grid-cols-2 gap-4">
          <input
            placeholder="Farm name" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-4 py-2.5 rounded-lg border border-forest/20 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta"
          />
          <input
            placeholder="Area (acres)" type="number" step="0.1" required value={form.area_acres}
            onChange={(e) => setForm({ ...form, area_acres: e.target.value })}
            className="px-4 py-2.5 rounded-lg border border-forest/20 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta"
          />
          <input
            placeholder="Soil type (e.g. alluvial)" value={form.soil_type}
            onChange={(e) => setForm({ ...form, soil_type: e.target.value })}
            className="px-4 py-2.5 rounded-lg border border-forest/20 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta"
          />
          <input
            placeholder="Current crop" value={form.current_crop}
            onChange={(e) => setForm({ ...form, current_crop: e.target.value })}
            className="px-4 py-2.5 rounded-lg border border-forest/20 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta"
          />
          <button type="submit" className="col-span-2 bg-forest text-wheat py-2.5 rounded-lg font-medium hover:bg-forest/90 transition">
            Save farm
          </button>
        </form>
      )}

      {error && <p className="text-terracotta text-sm bg-terracotta/10 px-3 py-2 rounded-lg mb-4">{error}</p>}

      {loading ? (
        <p className="text-ink/50 text-sm">Loading farms...</p>
      ) : farms.length === 0 ? (
        <div className="bg-white/40 border border-forest/10 rounded-2xl p-10 text-center">
          <p className="text-ink/60">No farms yet. Add your first farm to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {farms.map((farm) => (
            <div key={farm.id} className="bg-white/60 border border-forest/10 rounded-2xl p-5 relative">
  <button
    onClick={async () => {
      if (confirm(`Delete "${farm.name}"?`)) {
        try {
          await farmsApi.remove(farm.id)
          loadFarms()
        } catch {
          alert('Could not delete farm.')
        }
      }
    }}
    className="absolute top-3 right-3 text-ink/30 hover:text-red-500 transition text-lg"
    title="Delete farm"
  >
    ✕
  </button>
  <p className="font-display text-lg text-forest">{farm.name}</p>
  <p className="text-sm text-ink/60 mt-1">{farm.area_acres} acres · {farm.soil_type || 'soil type not set'}</p>
  {farm.current_crop && (
    <span className="inline-block mt-3 text-xs bg-sage/20 text-forest px-2.5 py-1 rounded-full">
      {farm.current_crop}
    </span>
  )}
</div>
          ))}
        </div>
      )}

      {/* Hero Banner */}
      <div className="mt-8 rounded-2xl overflow-hidden relative" style={{ height: '260px' }}>
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80"
          alt="Agriculture field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/60 to-transparent flex items-center">
          <div className="px-8">
            <h2 className="font-display text-3xl font-bold text-white mb-2">
              Smart Farming with AI 🌾
            </h2>
            <p className="text-wheat/80 text-sm mb-4 max-w-md">
              Use AI-powered tools to detect diseases, predict yield, get fertilizer advice, and track market prices — all in one platform.
            </p>
            <button
              onClick={() => navigate('/disease-detection')}
              className="bg-terracotta text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-terracotta/90 transition"
            >
              Try Disease Detection →
            </button>
          </div>
        </div>
      </div>

    

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="font-display text-lg font-bold text-forest mb-3">Quick Actions</h2>
        <div className="grid grid-cols-7 gap-2">
          {QUICK_ACTIONS.map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className="bg-white/60 border border-forest/10 rounded-xl p-3 text-center hover:bg-forest hover:text-white hover:border-forest transition group"
            >
              <p className="text-2xl mb-1">{action.icon}</p>
              <p className="text-xs font-medium text-ink/70 group-hover:text-white leading-tight">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

    </Layout>
  )
}
