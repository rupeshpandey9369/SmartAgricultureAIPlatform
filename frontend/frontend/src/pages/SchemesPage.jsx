import { useState, useEffect } from 'react'
import { coreApi } from '../api/client'
import { farmsApi } from '../api/client'

const CATEGORY_COLORS = {
  income_support: 'bg-green-100 text-green-800',
  insurance: 'bg-blue-100 text-blue-800',
  credit: 'bg-purple-100 text-purple-800',
  soil: 'bg-yellow-100 text-yellow-800',
  irrigation: 'bg-cyan-100 text-cyan-800',
  market: 'bg-orange-100 text-orange-800',
  infrastructure: 'bg-gray-100 text-gray-800',
  seeds_inputs: 'bg-lime-100 text-lime-800',
}

function SchemeCard({ scheme, onApply }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-wheat-deep shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl shrink-0">{scheme.emoji}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-ink">{scheme.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[scheme.category] || 'bg-gray-100 text-gray-800'}`}>
                  {scheme.category_label}
                </span>
              </div>
              <p className="text-xs text-ink/50 mt-0.5">{scheme.full_name}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-ink/70 mt-3">{scheme.description}</p>

        {/* Benefit highlight */}
        <div className="mt-3 bg-forest/5 border border-forest/20 rounded-lg px-3 py-2">
          <p className="text-xs font-semibold text-forest">🎁 Benefit: {scheme.benefit}</p>
        </div>

        {/* Expandable details */}
        {expanded && (
          <div className="mt-3 space-y-2">
            <div>
              <p className="text-xs font-semibold text-ink mb-1">📋 Required Documents:</p>
              <div className="flex flex-wrap gap-1">
                {scheme.documents.map((doc, i) => (
                  <span key={i} className="text-xs bg-wheat/60 text-ink/70 px-2 py-1 rounded-md">{doc}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-ink/50 hover:text-ink transition"
          >
            {expanded ? '▲ Less details' : '▼ More details'}
          </button>
          <div className="flex-1" />
          <button
            onClick={() => onApply(scheme)}
            className="bg-terracotta text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta/90 transition"
          >
            Apply Now →
          </button>
        </div>
      </div>
    </div>
  )
}

function ApplyModal({ scheme, onClose }) {
  if (!scheme) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{scheme.emoji}</span>
          <div>
            <h2 className="font-display font-bold text-ink text-lg">{scheme.name}</h2>
            <p className="text-xs text-ink/50">{scheme.full_name}</p>
          </div>
        </div>

        <div className="bg-forest/5 border border-forest/20 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-forest mb-1">How to Apply:</p>
          <ol className="text-sm text-ink/70 space-y-1 list-decimal list-inside">
            <li>Visit the official government portal (link below)</li>
            <li>Register with your Aadhaar and mobile number</li>
            <li>Fill the application form</li>
            <li>Upload required documents</li>
            <li>Submit and note your application reference number</li>
          </ol>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-ink mb-2">Required Documents:</p>
          <div className="flex flex-wrap gap-1">
            {scheme.documents.map((doc, i) => (
              <span key={i} className="text-xs bg-wheat/60 text-ink/70 px-2 py-1 rounded-md">{doc}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border border-wheat-deep text-ink/60 py-2.5 rounded-xl text-sm hover:bg-wheat/30 transition"
          >
            Cancel
          </button>
          <a
            href={scheme.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-terracotta text-white py-2.5 rounded-xl text-sm font-semibold text-center hover:bg-terracotta/90 transition"
          >
            Go to Official Portal →
          </a>
        </div>
        <p className="text-xs text-ink/30 text-center mt-3">
          You will be redirected to the official Government of India portal.
        </p>
      </div>
    </div>
  )
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [farms, setFarms] = useState([])
  const [selectedFarm, setSelectedFarm] = useState(null)
  const [applyScheme, setApplyScheme] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [schemesRes, farmsRes] = await Promise.all([
        coreApi.get('/schemes/'),
        farmsApi.list()
      ])
      setSchemes(schemesRes.data.schemes || [])
      setFarms(farmsRes.data || [])
    } catch {
      // Load schemes without farm data
      try {
        const res = await coreApi.get('/schemes/')
        setSchemes(res.data.schemes || [])
      } catch {}
    } finally {
      setLoading(false)
    }
  }

  async function handleFarmSelect(e) {
    const farmId = e.target.value
    setSelectedFarm(farmId)
    if (farmId) {
      const farm = farms.find(f => f.id === farmId)
      if (farm) {
        const res = await coreApi.get('/schemes/', {
          params: { area_acres: farm.area_acres, crop: farm.primary_crop }
        })
        setSchemes(res.data.schemes || [])
      }
    } else {
      const res = await coreApi.get('/schemes/')
      setSchemes(res.data.schemes || [])
    }
  }

  const categories = ['all', ...new Set(schemes.map(s => s.category))]
  const filtered = filter === 'all' ? schemes : schemes.filter(s => s.category === filter)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Government Schemes</h1>
        <p className="text-ink/60 text-sm mt-1">
          Find and apply for government schemes and subsidies for farmers.
        </p>
      </div>

      {/* Farm selector */}
      {farms.length > 0 && (
        <div className="bg-white rounded-xl border border-wheat-deep p-4 mb-5 shadow-sm">
          <label className="block text-sm font-semibold text-ink mb-2">
            🌾 Filter schemes by your farm profile
          </label>
          <select
            value={selectedFarm || ''}
            onChange={handleFarmSelect}
            className="w-full border border-wheat-deep rounded-lg px-3 py-2.5 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
          >
            <option value="">— Show all schemes —</option>
            {farms.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.area_acres} acres)</option>
            ))}
          </select>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-forest rounded-xl p-4 text-center text-wheat">
          <p className="text-3xl font-bold">{schemes.length}</p>
          <p className="text-xs text-wheat/60 mt-1">Eligible Schemes</p>
        </div>
        <div className="bg-white rounded-xl border border-wheat-deep p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-terracotta">₹6K+</p>
          <p className="text-xs text-ink/50 mt-1">Direct Benefits/Year</p>
        </div>
        <div className="bg-white rounded-xl border border-wheat-deep p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-forest">4%</p>
          <p className="text-xs text-ink/50 mt-1">Min Interest Rate</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
              filter === cat
                ? 'bg-terracotta text-white'
                : 'bg-white border border-wheat-deep text-ink/60 hover:border-terracotta'
            }`}
          >
            {cat === 'all' ? 'All Schemes' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Schemes list */}
      {!loading && (
        <div className="space-y-4">
          {filtered.map(scheme => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              onApply={setApplyScheme}
            />
          ))}
        </div>
      )}

      {/* Apply modal */}
      <ApplyModal scheme={applyScheme} onClose={() => setApplyScheme(null)} />

      <p className="text-xs text-ink/30 text-center mt-8">
        ℹ️ Eligibility shown is indicative. Visit official portals for current and complete eligibility criteria.
      </p>
    </div>
  )
}
